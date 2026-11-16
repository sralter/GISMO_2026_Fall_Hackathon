"""Fetch NYC CityGML or check supplied local datasets; never overwrite inputs."""
import argparse
from contextlib import closing
import json
from pathlib import Path, PurePosixPath
import shutil
import stat
import tempfile
import urllib.request
import zipfile

import pyarrow.parquet as pq
from pyproj import CRS

from gismo_2026_fall_hackathon.citygml import iter_buildings


ROOT = Path(__file__).resolve().parents[1]
GML_URL = 'https://maps.nyc.gov/download/3dmodel/DA_WISE_GML.zip'
GML_NAMES = {f'DA{i}_3D_Buildings_Merged.gml' for i in range(1, 21)}
SIDECARS = {'DeliveryArea' + suffix for suffix in ('.shp', '.shx', '.dbf', '.prj')}
OPTIONAL_SIDECARS = {'DeliveryArea' + suffix for suffix in ('.sbn', '.sbx', '.shp.xml')}
FOOTPRINTS = '09_NYC_Building_Footprints.parquet'
RADIATION = '18_NYC_Solar_Candidates_With_Radiation.parquet'
PERMITS = '26_dob_solar_approved_permits_11142026.parquet'


def extract_gml(archive, root=ROOT):
    """Normalize archive prefixes using known filenames, preserving existing files."""
    destination = Path(root) / 'data/DA_WISE_GML'
    with zipfile.ZipFile(archive) as source:
        members = {}
        for member in source.infolist():
            path = PurePosixPath(member.filename)
            if (path.is_absolute() or '..' in path.parts or '\\' in member.filename
                    or ':' in member.filename or stat.S_ISLNK(member.external_attr >> 16)):
                raise ValueError(f'Unsafe archive entry: {member.filename}')
            if member.is_dir():
                continue
            name = path.name
            if name not in GML_NAMES | SIDECARS | OPTIONAL_SIDECARS:
                continue
            if name in members:
                raise ValueError(f'Duplicate archive filename: {name}')
            members[name] = member
        missing = (GML_NAMES | SIDECARS) - members.keys()
        if missing:
            raise ValueError('Incomplete CityGML archive; missing: ' + ', '.join(sorted(missing)))
        for name, member in members.items():
            target = destination / 'DA_WISE_GMLs' / name if name in GML_NAMES else destination / name
            if target.exists():
                print(f'Kept existing: {target}')
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            # Stage the complete member first so interruption cannot leave a partial input.
            with tempfile.TemporaryDirectory(dir=target.parent) as folder:
                staged = Path(folder) / name
                with source.open(member) as incoming, staged.open('wb') as outgoing:
                    shutil.copyfileobj(incoming, outgoing)
                # An exclusive hard link also preserves files created by another process.
                try:
                    target.hardlink_to(staged)
                except FileExistsError:
                    print(f'Kept existing: {target}')
                    continue
            print(f'Extracted: {target}')


def download_gml(root=ROOT):
    print(f'Downloading {GML_URL} (about 874 MiB; extracted GMLs need about 13 GiB)', flush=True)
    with tempfile.TemporaryDirectory() as folder:
        archive = Path(folder) / 'DA_WISE_GML.zip'
        with urllib.request.urlopen(GML_URL, timeout=60) as incoming, archive.open('wb') as outgoing:
            shutil.copyfileobj(incoming, outgoing)
        extract_gml(archive, root)


def check_parquet(path, columns, *, geographic=False):
    schema = pq.read_schema(path)
    missing = set(columns) - set(schema.names)
    if missing:
        raise ValueError('Missing columns: ' + ', '.join(sorted(missing)))
    if not geographic and 'geometry' not in columns:
        return
    geo = json.loads((schema.metadata or {}).get(b'geo', b'{}'))
    primary = geo.get('primary_column')
    if primary != 'geometry' or primary not in schema.names:
        raise ValueError('Expected GeoParquet metadata with primary column geometry')
    geometry = geo['columns'][primary]
    if geometry.get('encoding') != 'WKB':
        raise ValueError('Expected WKB geometry encoding')
    crs = geometry.get('crs', 'OGC:CRS84')
    if crs is None:
        raise ValueError('Geometry CRS is unknown')
    crs = CRS.from_user_input(crs)
    if geographic:
        if not crs.equals(CRS.from_epsg(4326), ignore_axis_order=True):
            raise ValueError('Footprints must use WGS84 longitude/latitude coordinates')
        bbox = geometry.get('covering', {}).get('bbox', {})
        for key in ('xmin', 'ymin', 'xmax', 'ymax'):
            fields = bbox.get(key)
            if not isinstance(fields, list) or not fields:
                raise ValueError('Missing GeoParquet bounding-box covering metadata')
            field = schema.field(fields[0])
            for child in fields[1:]:
                field = field.type.field(child)


def check_data(root=ROOT):
    root = Path(root)
    buildings = root / 'data/buildings'
    problems = {}

    def inspect(label, action):
        try:
            action()
        except (OSError, ValueError, KeyError, TypeError, IndexError) as exc:
            problems[label] = str(exc)
            print(f'FAIL {label}: {exc}')
            return False
        print(f'OK   {label}')
        return True

    footprints = inspect(FOOTPRINTS, lambda: check_parquet(buildings / FOOTPRINTS,
        ['geometry', 'height_roo', 'doitt_id', 'bin', 'base_bbl', 'feature_co', 'ground_ele'], geographic=True))
    radiation = inspect(RADIATION, lambda: check_parquet(buildings / RADIATION,
        ['geometry', 'doitt_id', 'height_roo', 'MEAN_1']))
    permits = inspect(PERMITS, lambda: check_parquet(buildings / PERMITS,
        ['Bin', 'House No', 'Street Name', 'Borough', 'Permit Status',
         'Estimated Job Costs', 'Latitude', 'Longitude']))
    data = root / 'data/DA_WISE_GML'

    def sample(name):
        with closing(iter_buildings(data / 'DA_WISE_GMLs' / name, limit=1)) as reader:
            if next(reader, None) is None:
                raise ValueError('No top-level CityGML building found')

    gml = [inspect(name, lambda name=name: sample(name))
           for name in sorted(GML_NAMES, key=lambda name: int(name.split('_')[0][2:]))]

    def sidecar(name):
        if not (data / name).is_file() or (data / name).stat().st_size == 0:
            raise ValueError('Missing or empty shapefile companion')

    sides = [inspect(name, lambda name=name: sidecar(name)) for name in sorted(SIDECARS)]
    features = {
        'Building shadows / calculated solar preparation': footprints,
        'Reference-exposure map': footprints and radiation,
        'Height impact': radiation,
        'Height impact with permit overlays': radiation and permits,
        'Complete CityGML exploration (all 20 areas)': all(gml),
        'CityGML inspection notebook (all areas)': all(gml) and all(sides),
    }
    for label, ready in features.items():
        print(f'{"READY" if ready else "INCOMPLETE"}: {label}')
    print('Checks cover schemas and one building per GML; they do not certify full geometry or solar caches.')
    return 1 if problems else 0


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    commands.add_parser('download-gml', help='Download and extract NYC CityGML, preserving existing files')
    extract = commands.add_parser('extract-gml', help='Extract an existing NYC ZIP')
    extract.add_argument('--archive', type=Path, required=True)
    commands.add_parser('check', help='Read-only check of the complete local data setup')
    args = parser.parse_args(argv)
    try:
        if args.command == 'check':
            return check_data()
        if args.command == 'download-gml':
            download_gml()
        else:
            extract_gml(args.archive)
    except (OSError, ValueError, zipfile.BadZipFile, RuntimeError) as exc:
        parser.exit(1, f'Data setup failed: {exc}\n')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

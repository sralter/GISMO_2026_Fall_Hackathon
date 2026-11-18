"""Pre-run Height impact demo scenarios into Streamlit's disk cache, so they load instantly in the app.

Run again after editing the model: the cache key includes the model files' stamps.
    uv run python scripts/warm_demo_cache.py            # default building, +300 ft
    uv run python scripts/warm_demo_cache.py 200 400    # other heights
"""
import sys
import time
from pathlib import Path
from unittest.mock import patch

from streamlit.runtime.caching.storage.local_disk_cache_storage import LocalDiskCacheStorageManager
from streamlit.testing.v1 import AppTest

PAGE = Path(__file__).resolve().parents[1] / 'src/streamlit/app_pages/height_impact.py'


def warm(heights: list[int]) -> None:
    # AppTest normally uses an in-memory cache; the app server uses this disk storage.
    with patch('streamlit.testing.v1.app_test.MemoryCacheStorageManager', LocalDiskCacheStorageManager):
        at = AppTest.from_file(str(PAGE), default_timeout=900).run()
        for feet in heights:
            start = time.time()
            at.slider(key='impact_added_ft').set_value(feet)
            at.button(key='impact_run').click().run()
            if at.exception:
                raise SystemExit(at.exception[0].value)
            print(f'+{feet} ft: {time.time() - start:.0f} s · {at.caption[1].value}')


if __name__ == '__main__':
    warm([int(arg) for arg in sys.argv[1:]] or [300])

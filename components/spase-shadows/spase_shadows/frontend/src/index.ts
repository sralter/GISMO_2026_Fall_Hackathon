import type {FrontendRenderer, FrontendRendererArgs} from '@streamlit/component-v2-lib';
import {type Effect, type Layer, Deck, MapView, AmbientLight, DirectionalLight, LightingEffect, type MapViewState} from '@deck.gl/core';
import {SolidPolygonLayer, PathLayer} from '@deck.gl/layers';
import {JSONConverter} from '@deck.gl/json';
import './style.css';
import {roofColor, roofColorKey, roofValues, type SolarData} from './solar';

type Step = {timestamp: number; label: string; elevation: number; direction: [number, number, number]; noon: boolean};
type Data = {scene: string; scene_id: string; steps: Step[]; slot: number;
  shadows: boolean; live: boolean; camera: MapViewState | null; camera_command: number; highlighted_building_ids?: string[]; solar?: string; solar_id?: string; color_mode?: string};
type State = {slot: number; loaded_scene_id: string; loaded_solar_id: string};
type Emit = FrontendRendererArgs<State, Data>['setStateValue'];
type BuildingInfo = Record<string, {height_m: number; bin: string; roof_area_m2: number}>;
type Roof = {building_id: string; polygon: number[][][]; color: [number, number, number]};
type Instance = {solar: SolarData | null; solarId: string; solarIndex: Map<string, number>; colorKey: string; layers: Layer[]; roofs: Roof[]; highlightKey: string; info: BuildingInfo; deck: Deck<MapView>; effect: LightingEffect; root: HTMLElement; slider: HTMLInputElement; label: HTMLOutputElement;
  status: HTMLElement; sceneId: string; cameraCommand: number; frame: number; cleanup: ReturnType<typeof setTimeout> | null;
  data: Data; emit: Emit; draws: number; renderMs: number; lastStart: number};
const instances = new WeakMap<FrontendRendererArgs['parentElement'], Instance>();
const converter = new JSONConverter({configuration: {classes: {SolidPolygonLayer, PathLayer, MapView}}});

/** deck.gl 9.4 skips LightingEffect when picking, leaving the shadow module without a texture, so picked layers never draw. */
function pickingShadowShim(lighting: LightingEffect): Effect {
  return {id: 'picking-shadow-shim', props: {}, useInPicking: true, setup() {}, preRender() {}, cleanup() {},
    getShaderModuleProps: () => ({shadow: {dummyShadowMap: (lighting as unknown as {dummyShadowMap: unknown}).dummyShadowMap}})};
}

function illuminate(instance: Instance) {
  const step = instance.data.steps[Number(instance.slider.value)];
  if (!step) return;
  const daylight = step.elevation > 0;
  const lights: Record<string, AmbientLight | DirectionalLight> = {
    ambient: new AmbientLight({color: [255, 255, 255], intensity: 0.65}),
  };
  // Keep shadow resources alive: deck.gl 9.1 leaves stale texture bindings when removing the last shadow light.
  lights.sun = new DirectionalLight({color: [255, 250, 238], intensity: daylight ? 1.2 : 0,
    direction: daylight ? step.direction : [0, 0, -1], _shadow: true});
  instance.effect.setProps(lights);
  instance.effect.shadowColor = [0, 0, 0, daylight && instance.data.shadows ? 0.55 : 0];
  instance.label.textContent = step.label;
  instance.status.textContent = `Sun elevation ${step.elevation.toFixed(1)}° · ${daylight ? 'Clear sky · direct sunlight' : 'Night · cast shadows off'}`;
  instance.slider.setAttribute('aria-valuetext', step.label);
  instance.root.dataset.timestamp = String(step.timestamp);
  instance.root.dataset.elevation = String(step.elevation);
  updateRoofColors(instance);
  instance.deck.redraw('sun changed');
}

function currentValues(instance: Instance, buildingId: string) {
  const slot = Number(instance.slider.value);
  return roofValues(instance.solarId === instance.data.solar_id ? instance.solar : null,
    instance.solarIndex.get(buildingId), slot, instance.data.steps[slot]?.timestamp);
}

function updateRoofColors(instance: Instance) {
  if (!instance.layers.length) return;
  const mode = instance.data.color_mode ?? 'annual';
  const key = roofColorKey(mode, instance.solarId, instance.data.solar_id, instance.solar !== null, instance.slider.value);
  if (instance.colorKey === key) return;
  instance.colorKey = key;
  instance.layers = instance.layers.map(layer => layer.id === 'roofs'
    ? (layer as SolidPolygonLayer<Roof>).clone({
      getFillColor: (roof: Roof) => roofColor(mode === 'annual' ? currentValues(instance, roof.building_id).annual
        : currentValues(instance, roof.building_id).instant, mode === 'annual' ? 2200 : 1200),
      updateTriggers: {getFillColor: key},
    }) : layer);
  instance.highlightKey = '';
  updateHighlights(instance);
}

function updateHighlights(instance: Instance) {
  if (!instance.layers.length) return;
  const ids = instance.data.highlighted_building_ids ?? [];
  const key = JSON.stringify(ids);
  if (key === instance.highlightKey) return;
  instance.highlightKey = key;
  const selected = new Set(ids);
  const paths = instance.roofs.filter(roof => selected.has(roof.building_id)).flatMap(roof =>
    roof.polygon.map(ring => ({building_id: roof.building_id,
      path: ring.map(point => [point[0], point[1], point[2] + 0.3])})));
  const overlay = new PathLayer({id: 'chat-results', data: paths, getPath: d => d.path,
    getColor: [0, 235, 255], getWidth: 4, widthUnits: 'pixels', pickable: true,
    shadowEnabled: false, parameters: {depthCompare: 'always'}});
  instance.deck.setProps({layers: [...instance.layers, overlay]});
  instance.root.dataset.highlightedIds = JSON.stringify(ids);
}

const render: FrontendRenderer<State, Data> = ({parentElement, data, setStateValue}) => {
  let instance = instances.get(parentElement);
  if (instance?.cleanup) clearTimeout(instance.cleanup);
  if (instance && !instance.root.isConnected) {
    instance.deck.finalize(); instances.delete(parentElement); instance = undefined;
  }
  if (!instance) {
    const root = parentElement.querySelector<HTMLElement>('.shadow-root')!;
    const canvas = root.querySelector<HTMLDivElement>('.shadow-canvas')!;
    const slider = root.querySelector<HTMLInputElement>('input')!;
    const label = root.querySelector<HTMLOutputElement>('output')!;
    const status = root.querySelector<HTMLElement>('.shadow-status')!;
    const next: Instance = {root, slider, label, status, sceneId: '', cameraCommand: -1, frame: 0, cleanup: null,
      effect: new LightingEffect({sun: new DirectionalLight({direction: [0, 0, -1], _shadow: true})}),
      solar: null, solarId: '', solarIndex: new Map(), colorKey: '', layers: [], roofs: [], highlightKey: '', info: {}, data, emit: setStateValue, draws: 0, renderMs: 0, lastStart: 0, deck: null as unknown as Deck<MapView>};
    try {
      next.deck = new Deck({parent: canvas, views: new MapView({repeat: false}), controller: true,
        initialViewState: data.camera ?? {longitude: -73.9875, latitude: 40.6935, zoom: 14.3, pitch: 55, bearing: -20},
        effects: [next.effect, pickingShadowShim(next.effect)], width: '100%', height: '100%', useDevicePixels: Math.min(window.devicePixelRatio, 2),
        getTooltip: ({object, layer}) => {
          const info = next.info[object?.building_id];
          if (!info) return null;
          const values = currentValues(next, object.building_id);
          const calculated = [
            values.annual === null ? 'Annual resource unavailable' : `Annual clear-sky · ${values.annual.toFixed(1)} kWh/m²/year`,
            values.instant === null ? 'Selected-time result unavailable' : `Clear-sky irradiance · ${values.instant.toFixed(1)} W/m²`,
            values.sunlit === null ? '' : `Sunlit roof · ${(values.sunlit * 100).toFixed(1)}%`,
          ].filter(Boolean).join('\n');
          // Façade area will be implemented separately when wall measurements are available.
          const surface = (layer?.id === 'roofs' || layer?.id === 'chat-results')
            ? `Roof area · ${info.roof_area_m2.toLocaleString(undefined, {maximumFractionDigits: 2})} m²\n${calculated}`
            : 'Façade';
          return {text: `Building ${object.building_id}\n${surface}\nBIN ${info.bin}`};
        },
        onBeforeRender: () => {next.lastStart = performance.now();},
        onAfterRender: () => {next.draws++; next.renderMs = performance.now() - next.lastStart;
          root.dataset.draws = String(next.draws); root.dataset.renderMs = next.renderMs.toFixed(1);},
        onError: (error: Error) => {status.textContent = `3D rendering failed: ${error.message}. Try a smaller area or enable WebGL2 in your browser.`; root.dataset.error = error.message; root.dataset.errorStack = error.stack;},
      });
    } catch (error) {
      status.textContent = `WebGL2 is required for 3D shadows. ${String(error)}`;
      root.dataset.error = String(error); return;
    }
    slider.oninput = () => {
      label.textContent = next.data.steps[Number(slider.value)].label;
      if (next.data.live && !next.frame) next.frame = requestAnimationFrame(() => {next.frame = 0; illuminate(next);});
    };
    slider.onchange = () => {
      if (next.frame) {cancelAnimationFrame(next.frame); next.frame = 0;}
      illuminate(next); next.emit('slot', Number(slider.value));
    };
    canvas.addEventListener('webglcontextlost', () => {
      status.textContent = 'The graphics context was lost. Reload the page or load a smaller area.';
    }, true);
    instances.set(parentElement, next); instance = next;
    if (!data.scene) setStateValue('loaded_scene_id', '');
    if (!data.solar) setStateValue('loaded_solar_id', '');
  }
  instance.data = data; instance.emit = setStateValue;
  instance.slider.max = String(data.steps.length - 1);
  instance.slider.value = String(Math.min(data.slot, data.steps.length - 1));
  instance.root.dataset.live = String(data.live);
  instance.root.dataset.shadows = String(data.shadows);
  if (instance.sceneId !== data.scene_id && data.scene) {
    const current = instance;
    current.sceneId = data.scene_id;
    // A compressed payload avoids resending tens of MB of nested coordinates on control updates.
    const bytes = Uint8Array.from(atob(data.scene), c => c.charCodeAt(0));
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    new Response(stream).text().then(text => {
      if (instances.get(parentElement) !== current || current.sceneId !== data.scene_id) return;
      const decoded = JSON.parse(text);
      current.info = decoded.buildingInfo;
      const spec = converter.convert(decoded) as {layers: Layer[]; initialViewState: MapViewState};
      current.layers = spec.layers;
      current.roofs = decoded.layers.find((layer: {id: string}) => layer.id === 'roofs').data;
      current.highlightKey = '';
      current.colorKey = '';
      updateHighlights(current);
      current.deck.setProps({initialViewState: current.data.camera ?? spec.initialViewState});
      current.root.dataset.sceneId = data.scene_id;
      illuminate(current);
      current.emit('loaded_scene_id', data.scene_id);
    }).catch(error => {current.status.textContent = `Could not load the 3D scene: ${String(error)}`;});
  }
  if (instance.solarId !== data.solar_id && data.solar) {
    const current = instance;
    const requestedId = data.solar_id ?? '';
    current.solarId = requestedId;
    current.solar = null;
    current.solarIndex.clear();
    const bytes = Uint8Array.from(atob(data.solar), c => c.charCodeAt(0));
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    new Response(stream).text().then(text => {
      if (instances.get(parentElement) !== current || current.solarId !== requestedId) return;
      current.solar = JSON.parse(text) as SolarData;
      current.solarIndex = new Map(current.solar.ids.map((id, i) => [id, i]));
      current.colorKey = '';
      illuminate(current);
      current.emit('loaded_solar_id', requestedId);
    }).catch(error => {
      current.status.textContent = `Could not load roof solar data: ${String(error)}`;
      current.solarId = '';
    });
  }
  if (data.camera && instance.cameraCommand !== data.camera_command) {
    instance.deck.setProps({initialViewState: data.camera}); instance.cameraCommand = data.camera_command;
    instance.root.dataset.cameraCommand = String(data.camera_command);
  }
  updateHighlights(instance);
  illuminate(instance);
  const current = instance;
  return () => {
    // Retain the GPU context across synchronous prop updates, but release it on unmount.
    current.cleanup = setTimeout(() => {
      if (current.frame) cancelAnimationFrame(current.frame);
      current.deck.finalize(); instances.delete(parentElement);
    }, 0);
  };
};
export default render;

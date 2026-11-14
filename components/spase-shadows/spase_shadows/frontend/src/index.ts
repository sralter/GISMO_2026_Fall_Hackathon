import type {FrontendRenderer, FrontendRendererArgs} from '@streamlit/component-v2-lib';
import {Deck, MapView, AmbientLight, DirectionalLight, LightingEffect, type MapViewState} from '@deck.gl/core';
import {SolidPolygonLayer, PathLayer} from '@deck.gl/layers';
import {JSONConverter} from '@deck.gl/json';
import './style.css';

type Step = {timestamp: number; label: string; elevation: number; direction: [number, number, number]; noon: boolean};
type Data = {scene: string; scene_id: string; steps: Step[]; slot: number;
  shadows: boolean; live: boolean; camera: MapViewState | null; camera_command: number};
type State = {slot: number; loaded_scene_id: string};
type Emit = FrontendRendererArgs<State, Data>['setStateValue'];
type BuildingInfo = Record<string, {height_m: number; bin: string; roof_area_m2: number; roof_exposure: number | null}>;
type Instance = {info: BuildingInfo; deck: Deck<MapView>; effect: LightingEffect; root: HTMLElement; slider: HTMLInputElement; label: HTMLOutputElement;
  status: HTMLElement; sceneId: string; cameraCommand: number; frame: number; cleanup: ReturnType<typeof setTimeout> | null;
  data: Data; emit: Emit; draws: number; renderMs: number; lastStart: number};
const instances = new WeakMap<FrontendRendererArgs['parentElement'], Instance>();
const converter = new JSONConverter({configuration: {classes: {SolidPolygonLayer, PathLayer, MapView}}});

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
  instance.deck.redraw('sun changed');
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
      info: {}, data, emit: setStateValue, draws: 0, renderMs: 0, lastStart: 0, deck: null as unknown as Deck<MapView>};
    try {
      next.deck = new Deck({parent: canvas, views: new MapView({repeat: false}), controller: true,
        initialViewState: data.camera ?? {longitude: -73.9875, latitude: 40.6935, zoom: 14.3, pitch: 55, bearing: -20},
        effects: [next.effect], width: '100%', height: '100%', useDevicePixels: Math.min(window.devicePixelRatio, 2),
        getTooltip: ({object, layer}) => {
          const info = next.info[object?.building_id];
          if (!info) return null;
          // Façade area will be implemented separately when wall measurements are available.
          const surface = layer?.id === 'roofs'
            ? `Roof area · ${info.roof_area_m2.toLocaleString(undefined, {maximumFractionDigits: 2})} m²\n${info.roof_exposure === null ? 'No exposure data' : `June 21 exposure · ${info.roof_exposure.toFixed(2)} (units unspecified)`}`
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
      const spec = converter.convert(decoded) as {layers: never[]; initialViewState: MapViewState};
      current.deck.setProps({layers: spec.layers, initialViewState: current.data.camera ?? spec.initialViewState});
      current.root.dataset.sceneId = data.scene_id;
      illuminate(current);
      current.emit('loaded_scene_id', data.scene_id);
    }).catch(error => {current.status.textContent = `Could not load the 3D scene: ${String(error)}`;});
  }
  if (data.camera && instance.cameraCommand !== data.camera_command) {
    instance.deck.setProps({initialViewState: data.camera}); instance.cameraCommand = data.camera_command;
    instance.root.dataset.cameraCommand = String(data.camera_command);
  }
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

export type SolarData = {ids: string[]; annual: (number | null)[]; irradiance: number[][];
  sunlit: number[][]; valid: boolean[]; timestamps: number[]};

export function roofColor(value: number | null, maximum: number): [number, number, number] {
  if (value === null || !Number.isFinite(value)) return [160, 160, 160];
  const fraction = Math.max(0, Math.min(value / maximum, 1));
  return fraction <= 0.5 ? [255, Math.round(255 - fraction * 254), 0]
    : [255, Math.round(256 * (1 - fraction)), 0];
}

export function roofValues(solar: SolarData | null, index: number | undefined, slot: number, timestamp: number) {
  if (!solar || index === undefined) return {annual: null, instant: null, sunlit: null};
  const ready = solar.valid[index] && solar.timestamps[slot] === timestamp;
  return {annual: solar.annual[index] ?? null,
    instant: ready ? solar.irradiance[slot]?.[index] ?? null : null,
    sunlit: ready ? solar.sunlit[slot]?.[index] ?? null : null};
}

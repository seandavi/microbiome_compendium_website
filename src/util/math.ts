export type Point = { x: number; y: number };

/** trig sin in degrees */
export const sin = (degrees: number) => Math.sin((2 * Math.PI * degrees) / 360);
/** trig cos in degrees */
export const cos = (degrees: number) => Math.cos((2 * Math.PI * degrees) / 360);

/** normalize point as vector */
export const normalize = ({ x, y }: Point): Point => {
  const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return { x: x / dist, y: y / dist };
};

/** normalize point as vector */
export const scale = ({ x, y }: Point, scale: number): Point => ({
  x: x * scale,
  y: y * scale,
});

/** clamp value between min and max */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** format number to string */
export const formatNumber = (value?: number, compact = false) =>
  (value || 0).toLocaleString(
    undefined,
    compact ? { notation: "compact" } : undefined,
  );

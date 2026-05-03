/**
 * Sanitizes a numeric value into an integer constrained to a range.
 * Falls back when the input is not finite.
 */
export const sanitizeIntegerInRange = (
  value: number,
  {
    min,
    max,
    fallback,
  }: {
    min: number
    max: number
    fallback: number
  }
) => {
  const safeMin = Number.isFinite(min) ? Math.floor(min) : 0
  const safeMax = Number.isFinite(max) ? Math.floor(max) : safeMin
  const boundedMin = Math.min(safeMin, safeMax)
  const boundedMax = Math.max(safeMin, safeMax)
  const safeFallback = Number.isFinite(fallback)
    ? Math.floor(fallback)
    : boundedMin
  const clampedFallback = Math.min(boundedMax, Math.max(boundedMin, safeFallback))

  if (!Number.isFinite(value)) {
    return clampedFallback
  }

  const floored = Math.floor(value)
  return Math.min(boundedMax, Math.max(boundedMin, floored))
}

export function getMinMax(values: number[]) {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY

  for (const v of values) {
    if (!Number.isFinite(v)) continue
    if (v < min) min = v
    if (v > max) max = v
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 0, max: 1 }
  }

  if (min === max) {
    return { min: min - 1, max: max + 1 }
  }

  return { min, max }
}

export function clampDomain(params: {
  domain: { min: number; max: number }
  full: { min: number; max: number }
}) {
  const fullSpan = params.full.max - params.full.min
  const span = params.domain.max - params.domain.min

  if (!Number.isFinite(fullSpan) || fullSpan <= 0) return params.full
  if (!Number.isFinite(span) || span <= 0) return params.full

  const minSpan = fullSpan / 1000
  const nextSpan = Math.max(minSpan, Math.min(fullSpan, span))

  const center = (params.domain.min + params.domain.max) / 2
  let nextMin = center - nextSpan / 2
  let nextMax = center + nextSpan / 2

  if (nextMin < params.full.min) {
    nextMax += params.full.min - nextMin
    nextMin = params.full.min
  }
  if (nextMax > params.full.max) {
    nextMin -= nextMax - params.full.max
    nextMax = params.full.max
  }

  nextMin = Math.max(params.full.min, nextMin)
  nextMax = Math.min(params.full.max, nextMax)

  if (nextMax - nextMin < minSpan) {
    return params.full
  }

  return { min: nextMin, max: nextMax }
}

export function findNearestIndex(values: number[], target: number) {
  let lo = 0
  let hi = values.length - 1
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (values[mid] < target) lo = mid + 1
    else hi = mid
  }

  if (lo <= 0) return 0
  if (lo >= values.length) return values.length - 1

  const prev = lo - 1
  return Math.abs(values[prev] - target) <= Math.abs(values[lo] - target)
    ? prev
    : lo
}

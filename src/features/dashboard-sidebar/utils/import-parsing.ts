export function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function extractWellStage(filename: string) {
  const normalized = filename.replace(/\.[^.]+$/, '')
  const stageRegex =
    /(?<well>[a-z0-9\s_-]+?)[_\s.-]*(?:stage|stg|zone)[_\s.-]*(?<stage>\d+)/i
  const match = normalized.match(stageRegex)

  if (match && match.groups) {
    return {
      wellName: match.groups.well?.trim() || 'Unknown well',
      stageName: match.groups.stage?.trim(),
    }
  }

  const fallbackWell = normalized.replace(/[_\s.-]+/g, ' ').trim()
  return {
    wellName: fallbackWell || 'Unknown well',
    stageName: undefined,
  }
}

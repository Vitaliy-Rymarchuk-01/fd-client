import type { StageNode } from '../types/stage'

export function compareStages(a: StageNode, b: StageNode) {
  const aNum = a.stageName ? Number(a.stageName) : Number.NaN
  const bNum = b.stageName ? Number(b.stageName) : Number.NaN

  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
    return aNum - bNum
  }

  if (!Number.isNaN(aNum) && Number.isNaN(bNum)) {
    return -1
  }

  if (Number.isNaN(aNum) && !Number.isNaN(bNum)) {
    return 1
  }

  return a.fileName.localeCompare(b.fileName)
}

export function groupStages(stageNodes: StageNode[]) {
  return stageNodes.reduce<Record<string, StageNode[]>>((acc, node) => {
    acc[node.wellName] = acc[node.wellName]
      ? [...acc[node.wellName], node]
      : [node]
    return acc
  }, {})
}

export type ModuleId =
  | 'main-data'
  | 'input-data'
  | 'phases'
  | 'vols'
  | 'breakdowns'
  | 'filter-bds'
  | 'separate-bds'
  | 'permeability'
  | 'curves'
  | 'axes'
  | 'stable-intervals'
  | 'pore-press'
  | 'bottom-press'
  | 'propant'

export interface ModuleGroup {
  id: string
  items: ReadonlyArray<{ id: ModuleId; label: string }>
}

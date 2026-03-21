export type ModuleId =
  | 'main-data'
  | 'input-data'
  | 'vols'
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

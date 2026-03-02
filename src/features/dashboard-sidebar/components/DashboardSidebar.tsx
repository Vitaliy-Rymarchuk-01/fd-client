import { useState } from 'react'

import type { ImportFileItem } from '@/features/data-import/types/file-import'

import { ScrollArea } from '@/shared/components/ui/scroll-area'

import type { ModuleGroup, ModuleId } from '../types/module'
import type { StageNode } from '../types/stage'
import { createId, extractWellStage } from '../utils/import-parsing'
import { MainDataSection } from './MainDataSection'
import { ModuleDropdown } from './ModuleDropdown'

const MODULE_GROUPS: ReadonlyArray<ModuleGroup> = [
  {
    id: 'primary',
    items: [
      { id: 'main-data', label: 'Main Data' },
      { id: 'input-data', label: 'Input data' },
      { id: 'phases', label: 'Phases' },
      { id: 'vols', label: 'Vols' },
      { id: 'breakdowns', label: 'Breakdowns' },
      { id: 'filter-bds', label: 'Filter BDs' },
      { id: 'separate-bds', label: 'Separate BDs' },
      { id: 'permeability', label: 'Permeability' },
      { id: 'curves', label: 'Curves' },
    ],
  },
  {
    id: 'secondary',
    items: [
      { id: 'axes', label: 'Axes' },
      { id: 'stable-intervals', label: 'Stable Intervals' },
      { id: 'pore-press', label: 'Pore Press.' },
      { id: 'bottom-press', label: 'Bottom Press' },
      { id: 'propant', label: 'Propant' },
    ],
  },
]

export function DashboardSidebar() {
  const [importItems, setImportItems] = useState<ImportFileItem[]>([])
  const [stageNodes, setStageNodes] = useState<StageNode[]>([])
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('main-data')
  const [selectedStageIds, setSelectedStageIds] = useState<
    Record<string, boolean>
  >({})

  const isMainDataEmpty =
    activeModuleId === 'main-data' && stageNodes.length === 0

  const handleFilesAdded = (files: File[]) => {
    const newItems: ImportFileItem[] = []
    const newStageNodes: StageNode[] = []

    files.forEach((file) => {
      const fileId = createId()
      const { wellName, stageName } = extractWellStage(file.name)

      newItems.push({ id: fileId, file, status: 'queued' })
      newStageNodes.push({
        id: createId(),
        fileId,
        wellName,
        stageName,
        fileName: file.name,
        status: 'pending',
      })
    })

    setImportItems((prev) => [...prev, ...newItems])
    setStageNodes((prev) => [...prev, ...newStageNodes])
  }

  const handleRemoveItem = (fileId: string) => {
    setImportItems((prev) => prev.filter((item) => item.id !== fileId))
    setStageNodes((prev) => prev.filter((node) => node.fileId !== fileId))
    setSelectedStageIds((prev) => {
      const next: Record<string, boolean> = {}
      stageNodes.forEach((node) => {
        if (node.fileId !== fileId && prev[node.id]) {
          next[node.id] = true
        }
      })
      return next
    })
  }

  const handleClear = () => {
    setImportItems([])
    setStageNodes([])
    setSelectedStageIds({})
  }

  const handleToggleStage = (stageId: string, checked: boolean) => {
    setSelectedStageIds((prev) => ({
      ...prev,
      [stageId]: checked,
    }))
  }

  return (
    <nav className="flex h-full flex-col">
      <div className="border-sidebar-border bg-sidebar/60 supports-backdrop-filter:bg-sidebar/40 border-b p-2 backdrop-blur">
        <ModuleDropdown
          activeModuleId={activeModuleId}
          moduleGroups={MODULE_GROUPS}
          onSelect={setActiveModuleId}
        />
      </div>

      {isMainDataEmpty ? (
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <div className="flex min-h-0 flex-1 flex-col">
            <MainDataSection
              importItems={importItems}
              stageNodes={stageNodes}
              selectedStageIds={selectedStageIds}
              onFilesAdded={handleFilesAdded}
              onRemoveImportItem={handleRemoveItem}
              onClearAll={handleClear}
              onToggleStage={handleToggleStage}
            />
          </div>
        </div>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex h-full min-h-0 flex-col p-4">
            {activeModuleId === 'main-data' ? (
              <MainDataSection
                importItems={importItems}
                stageNodes={stageNodes}
                selectedStageIds={selectedStageIds}
                onFilesAdded={handleFilesAdded}
                onRemoveImportItem={handleRemoveItem}
                onClearAll={handleClear}
                onToggleStage={handleToggleStage}
              />
            ) : (
              <section className="border-sidebar-border/70 text-muted-foreground rounded-xl border px-3 py-3 text-xs">
                Module — controls will be implemented here.
              </section>
            )}
          </div>
        </ScrollArea>
      )}
    </nav>
  )
}

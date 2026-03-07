import { useMemo, useState } from 'react'

import { useUploadFiles, useWellsStages } from '@/features/data-import'
import type { ImportFileItem } from '@/features/data-import/types/file-import'

import { ScrollArea } from '@/shared/components/ui/scroll-area'

import type { ModuleGroup, ModuleId } from '../types/module'
import type { StageNode } from '../types/stage'
import { createId } from '../utils/import-parsing'
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
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('main-data')
  const [batchId, setBatchId] = useState<string | null>(null)
  const [serverStageIdByLocalFileId, setServerStageIdByLocalFileId] = useState<
    Record<string, string>
  >({})
  const [excludedServerStageIds, setExcludedServerStageIds] = useState<
    Record<string, boolean>
  >({})
  const [selectedStageIds, setSelectedStageIds] = useState<
    Record<string, boolean>
  >({})

  const uploadFilesMutation = useUploadFiles()
  const wellsStagesQuery = useWellsStages(batchId)

  const stageNodes: StageNode[] = useMemo(() => {
    if (!wellsStagesQuery.data) return []

    return wellsStagesQuery.data.wells
      .flatMap((well) =>
        well.stages.map((stage) => ({
          id: stage.id,
          fileId: stage.id,
          wellName: well.name,
          stageName: stage.name,
          fileName: stage.fileName,
          status: 'ready' as const,
        })),
      )
      .filter((node) => !excludedServerStageIds[node.id])
  }, [excludedServerStageIds, wellsStagesQuery.data])

  const isMainDataEmpty =
    activeModuleId === 'main-data' && stageNodes.length === 0

  const handleFilesAdded = async (files: File[]) => {
    const localIdByFileName: Record<string, string> = {}
    const newItems: ImportFileItem[] = files.map((file) => {
      const localId = createId()
      localIdByFileName[file.name] = localId
      return { id: localId, file, status: 'uploading' }
    })

    setImportItems((prev) => [...prev, ...newItems])

    try {
      const res = await uploadFilesMutation.mutateAsync({
        files,
        batchId: batchId ?? undefined,
      })

      const nextBatchId = res.batchId
      setBatchId(nextBatchId)
      if (batchId) {
        void wellsStagesQuery.refetch()
      }

      setServerStageIdByLocalFileId((prev) => {
        const next = { ...prev }
        res.files.forEach((uploaded) => {
          const localId = localIdByFileName[uploaded.fileName]
          if (localId) {
            next[localId] = uploaded.fileId
          }
        })
        return next
      })

      setImportItems((prev) =>
        prev.map((item) => {
          const isUploadedNow =
            localIdByFileName[item.file.name] === item.id &&
            files.some((f) => f.name === item.file.name)
          if (!isUploadedNow) return item
          return { ...item, status: 'uploaded' }
        }),
      )
    } catch {
      setImportItems((prev) =>
        prev.map((item) => {
          const isUploadedNow =
            localIdByFileName[item.file.name] === item.id &&
            files.some((f) => f.name === item.file.name)
          if (!isUploadedNow) return item

          return {
            ...item,
            status: 'error',
            errorMessage: 'Upload failed',
          }
        }),
      )
    }
  }

  const handleRemoveItem = (fileId: string) => {
    setImportItems((prev) => prev.filter((item) => item.id !== fileId))

    const serverStageId = serverStageIdByLocalFileId[fileId]
    if (serverStageId) {
      setExcludedServerStageIds((prev) => ({ ...prev, [serverStageId]: true }))
    }

    setSelectedStageIds((prev) => {
      const next: Record<string, boolean> = {}
      stageNodes.forEach((node) => {
        if (node.id !== serverStageId && prev[node.id]) {
          next[node.id] = true
        }
      })
      return next
    })
  }

  const handleClear = () => {
    setImportItems([])
    setBatchId(null)
    setServerStageIdByLocalFileId({})
    setExcludedServerStageIds({})
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

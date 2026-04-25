import { useEffect, useMemo, useState } from 'react'

import { useUploadFiles, useWellsStages } from '@/features/data-import'
import type { ImportFileItem } from '@/features/data-import/types/file-import'
import { useActiveProjectStore, useProjects } from '@/features/projects'

import { ScrollArea } from '@/shared/components/ui/scroll-area'
import { useStageSelectionStore } from '@/shared/store/stage-selection'

import type { ModuleGroup, ModuleId } from '../types/module'
import type { StageNode } from '../types/stage'
import { createId } from '../utils/import-parsing'
import { CurvesSection } from './CurvesSection'
import { MainDataSection } from './MainDataSection'
import { ModuleDropdown } from './ModuleDropdown'

const SIDEBAR_STORAGE_KEY = 'fd.sidebar:imports'

function projectStorageKey(projectId: string): string {
  return `${SIDEBAR_STORAGE_KEY}:${projectId}`
}

function loadSidebarStateForProject(projectId: string | null): {
  batchId: string | null
  excludedStageIds: Record<string, boolean>
  selectedStageIds: Record<string, boolean>
} {
  if (!projectId || typeof window === 'undefined') {
    return { batchId: null, excludedStageIds: {}, selectedStageIds: {} }
  }

  try {
    const raw = window.localStorage.getItem(projectStorageKey(projectId))
    if (!raw) {
      return { batchId: null, excludedStageIds: {}, selectedStageIds: {} }
    }

    const parsed = JSON.parse(raw) as {
      batchId: string | null
      excludedStageIds?: Record<string, boolean>
      selectedStageIds?: Record<string, boolean>
    } | null

    if (!parsed) {
      return { batchId: null, excludedStageIds: {}, selectedStageIds: {} }
    }

    return {
      batchId: parsed.batchId ?? null,
      excludedStageIds: parsed.excludedStageIds ?? {},
      selectedStageIds: parsed.selectedStageIds ?? {},
    }
  } catch {
    return { batchId: null, excludedStageIds: {}, selectedStageIds: {} }
  }
}

const MODULE_GROUPS: ReadonlyArray<ModuleGroup> = [
  {
    id: 'primary',
    items: [
      { id: 'main-data', label: 'Main Data' },
      { id: 'input-data', label: 'Input data' },
      { id: 'vols', label: 'Vols' },
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
  const activeProjectId = useActiveProjectStore((s) => s.activeProjectId)
  const projectsQuery = useProjects()
  const [batchId, setBatchId] = useState<string | null>(
    () => loadSidebarStateForProject(activeProjectId).batchId,
  )
  const [serverStageIdByLocalFileId, setServerStageIdByLocalFileId] = useState<
    Record<string, string>
  >({})
  const [excludedServerStageIds, setExcludedServerStageIds] = useState<
    Record<string, boolean>
  >(() => loadSidebarStateForProject(activeProjectId).excludedStageIds)
  const [selectedStageIds, setSelectedStageIds] = useState<
    Record<string, boolean>
  >(() => loadSidebarStateForProject(activeProjectId).selectedStageIds)

  const setSelectedStageId = useStageSelectionStore((s) => s.setSelectedStageId)
  const uploadFilesMutation = useUploadFiles()
  const wellsStagesQuery = useWellsStages(batchId)

  useEffect(() => {
    if (typeof window === 'undefined' || !activeProjectId) return

    try {
      window.localStorage.setItem(
        projectStorageKey(activeProjectId),
        JSON.stringify({
          batchId,
          excludedStageIds: excludedServerStageIds,
          selectedStageIds,
        }),
      )
    } catch {
      // ignore quota / JSON errors
    }
  }, [activeProjectId, batchId, excludedServerStageIds, selectedStageIds])

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

  useEffect(() => {
    if (stageNodes.length === 0) return
    const restoredId = Object.keys(selectedStageIds).find(
      (id) => selectedStageIds[id] && stageNodes.some((n) => n.id === id),
    )
    setSelectedStageId(restoredId ?? null)
  }, [stageNodes, selectedStageIds, setSelectedStageId])

  const handleFilesAdded = async (files: File[]) => {
    if (!activeProjectId) return

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
        projectId: activeProjectId,
      })

      setBatchId(res.batchId)
      if (batchId) {
        void wellsStagesQuery.refetch()
      }

      setServerStageIdByLocalFileId((prev) => {
        const next = { ...prev }
        res.files.forEach((uploaded) => {
          const localId = localIdByFileName[uploaded.fileName]
          if (localId) next[localId] = uploaded.fileId
        })
        return next
      })

      setImportItems((prev) =>
        prev.map((item) => {
          const shouldUpdate =
            localIdByFileName[item.file.name] === item.id &&
            files.some((f) => f.name === item.file.name)
          return shouldUpdate ? { ...item, status: 'uploaded' } : item
        }),
      )
    } catch {
      setImportItems((prev) =>
        prev.map((item) => {
          const shouldUpdate =
            localIdByFileName[item.file.name] === item.id &&
            files.some((f) => f.name === item.file.name)
          return shouldUpdate
            ? { ...item, status: 'error', errorMessage: 'Upload failed' }
            : item
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
    setSelectedStageId(null)
  }

  const handleToggleStage = (stageId: string, checked: boolean) => {
    if (!checked) {
      setSelectedStageIds({})
      setSelectedStageId(null)
      return
    }

    setSelectedStageIds({ [stageId]: true })
    setSelectedStageId(stageId)
  }

  const isMainDataEmpty =
    activeModuleId === 'main-data' && stageNodes.length === 0
  const activeProjectName = useMemo(() => {
    if (!activeProjectId) return null

    return (
      projectsQuery.data?.find((project) => project.id === activeProjectId)
        ?.name ?? null
    )
  }, [activeProjectId, projectsQuery.data])

  return (
    <nav className="flex h-full flex-col">
      <div className="border-sidebar-border bg-sidebar/60 supports-backdrop-filter:bg-sidebar/40 flex items-center gap-3 border-b p-3 backdrop-blur">
        <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
          Current project
        </p>
        <p className="text-sidebar-foreground truncate text-xs font-semibold uppercase">
          {activeProjectName ?? activeProjectId ?? 'No project selected'}
        </p>
      </div>

      <div className="border-sidebar-border bg-sidebar/60 supports-backdrop-filter:bg-sidebar/40 border-b p-1 backdrop-blur">
        <ModuleDropdown
          activeModuleId={activeModuleId}
          moduleGroups={MODULE_GROUPS}
          onSelect={setActiveModuleId}
        />
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex w-full min-w-0 flex-col p-4">
          {!activeProjectId ? (
            <section className="border-sidebar-border/70 text-muted-foreground rounded-xl border px-3 py-3 text-xs">
              Create or select a project to start uploading files.
            </section>
          ) : isMainDataEmpty ? (
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
          ) : activeModuleId === 'main-data' ? (
            <MainDataSection
              importItems={importItems}
              stageNodes={stageNodes}
              selectedStageIds={selectedStageIds}
              onFilesAdded={handleFilesAdded}
              onRemoveImportItem={handleRemoveItem}
              onClearAll={handleClear}
              onToggleStage={handleToggleStage}
            />
          ) : activeModuleId === 'curves' ? (
            <CurvesSection />
          ) : (
            <section className="border-sidebar-border/70 text-muted-foreground rounded-xl border px-3 py-3 text-xs">
              Module — controls will be implemented here.
            </section>
          )}
        </div>
      </ScrollArea>
    </nav>
  )
}

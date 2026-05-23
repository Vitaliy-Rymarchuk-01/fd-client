import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderClosed,
  FolderPlus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'

import {
  useActiveProjectStore,
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from '@/features/projects'

import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import { cn } from '@/shared/lib/utils'

interface AppSidebarProps {
  collapsed?: boolean
}

export function AppSidebar({ collapsed = false }: AppSidebarProps) {
  const activeProjectId = useActiveProjectStore((s) => s.activeProjectId)
  const setActiveProjectId = useActiveProjectStore((s) => s.setActiveProjectId)
  const projectsQuery = useProjects()
  const createProjectMutation = useCreateProject()
  const updateProjectMutation = useUpdateProject()
  const deleteProjectMutation = useDeleteProject()
  const [projectsOpen, setProjectsOpen] = useState(true)
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [renameProjectName, setRenameProjectName] = useState('')
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [projectActionsOpenId, setProjectActionsOpenId] = useState<
    string | null
  >(null)
  const renameInputRef = useRef<HTMLInputElement | null>(null)
  const ignoreNextRenameBlurRef = useRef(false)
  const [projectToEdit, setProjectToEdit] = useState<{
    id: string
    name: string
  } | null>(null)

  const sortedProjects = useMemo(
    () =>
      [...(projectsQuery.data ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    [projectsQuery.data],
  )

  const handleCreateProject = () => {
    const name = newProjectName.trim()
    if (!name) return

    createProjectMutation.mutate(
      { name },
      {
        onSuccess: (project) => {
          setActiveProjectId(project.id)
          setNewProjectName('')
          setIsCreateProjectOpen(false)
        },
      },
    )
  }

  const cancelInlineRename = () => {
    setProjectToEdit(null)
    setRenameProjectName('')
    setEditingProjectId(null)
  }

  const openRenameProject = (project: { id: string; name: string }) => {
    setProjectToEdit(project)
    setRenameProjectName(project.name)
    ignoreNextRenameBlurRef.current = true
    setProjectActionsOpenId(null)
    setEditingProjectId(project.id)
  }

  useLayoutEffect(() => {
    if (!editingProjectId) return

    const frameId = window.requestAnimationFrame(() => {
      ignoreNextRenameBlurRef.current = false
      renameInputRef.current?.focus()
      renameInputRef.current?.select()
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [editingProjectId])

  useEffect(() => {
    if (!collapsed || !editingProjectId) return

    const frameId = window.requestAnimationFrame(() => {
      setProjectToEdit(null)
      setRenameProjectName('')
      setEditingProjectId(null)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [collapsed, editingProjectId])

  const openDeleteProject = (project: { id: string; name: string }) => {
    setProjectToEdit(project)
    setProjectActionsOpenId(null)
    setIsDeleteProjectOpen(true)
  }

  const handleRenameProject = () => {
    if (!projectToEdit) return

    const nextName = renameProjectName.trim()
    if (!nextName) return

    updateProjectMutation.mutate(
      { projectId: projectToEdit.id, name: nextName },
      {
        onSuccess: () => {
          setProjectToEdit(null)
          setEditingProjectId(null)
        },
      },
    )
  }

  const handleDeleteProject = () => {
    if (!projectToEdit) return

    deleteProjectMutation.mutate(projectToEdit.id, {
      onSuccess: () => {
        if (activeProjectId === projectToEdit.id) {
          setActiveProjectId(
            sortedProjects.find((project) => project.id !== projectToEdit.id)
              ?.id ?? null,
          )
        }
        setIsDeleteProjectOpen(false)
        setProjectToEdit(null)
      },
    })
  }

  return (
    <nav className="flex h-full flex-col gap-2 px-2 py-3">
      <div>
        <button
          className={cn(
            'flex w-full items-center rounded-md p-2 text-sm transition-colors',
            'text-sidebar-foreground hover:bg-muted',
            collapsed ? 'justify-center' : 'justify-between',
          )}
          type="button"
          onClick={() => {
            if (!collapsed) setProjectsOpen((prev) => !prev)
          }}
        >
          <span
            className={cn(
              'flex items-center',
              collapsed ? 'justify-center' : undefined,
            )}
          >
            <FolderClosed className="size-4 shrink-0" />
            <span
              className={cn(
                'truncate transition-[opacity,transform,width] duration-200 [transition-timing-function:var(--ease-out-quart)] motion-reduce:transition-none',
                collapsed
                  ? 'w-0 -translate-x-1 opacity-0'
                  : 'ml-2 w-auto translate-x-0 text-[13px] font-medium uppercase opacity-100',
              )}
            >
              Projects
            </span>
          </span>
          {collapsed ? null : projectsOpen ? (
            <ChevronDown className="text-muted-foreground size-4 shrink-0" />
          ) : (
            <ChevronRight className="text-muted-foreground size-4 shrink-0" />
          )}
        </button>

        {collapsed || !projectsOpen ? null : (
          <>
            <button
              className="text-sidebar-foreground hover:bg-muted mb-0.5 flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors"
              type="button"
              onClick={() => setIsCreateProjectOpen(true)}
            >
              <FolderPlus className="size-4 shrink-0" />
              <span className="truncate">New project</span>
            </button>

            <ScrollArea className="max-h-[calc(100dvh-220px)]">
              <div className="space-y-0.5">
                {sortedProjects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      'group flex items-center rounded-md text-sm transition-colors',
                      project.id === activeProjectId
                        ? 'bg-muted text-sidebar-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-sidebar-foreground',
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2 p-2">
                      <Folder className="size-4 shrink-0" />
                      {editingProjectId === project.id ? (
                        <Input
                          className="text-foreground h-5 min-w-0 flex-1 rounded-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                          ref={renameInputRef}
                          value={renameProjectName}
                          onBlur={() => {
                            if (ignoreNextRenameBlurRef.current) {
                              ignoreNextRenameBlurRef.current = false
                              return
                            }

                            handleRenameProject()
                          }}
                          onFocus={(event) => {
                            event.currentTarget.select()
                          }}
                          onChange={(event) => {
                            setRenameProjectName(event.target.value)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              e.currentTarget.blur()
                            }
                            if (e.key === 'Escape') {
                              cancelInlineRename()
                            }
                          }}
                        />
                      ) : (
                        <button
                          className="min-w-0 flex-1 text-left"
                          type="button"
                          onClick={() => setActiveProjectId(project.id)}
                        >
                          <span className="block min-w-0 truncate">
                            {project.name}
                          </span>
                        </button>
                      )}
                    </div>

                    <DropdownMenu
                      open={projectActionsOpenId === project.id}
                      onOpenChange={(open) => {
                        setProjectActionsOpenId(open ? project.id : null)
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="mr-1 size-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          size="icon"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation()
                          }}
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Project actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="min-w-44"
                        onCloseAutoFocus={(event) => event.preventDefault()}
                      >
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault()
                            openRenameProject(project)
                          }}
                        >
                          <Pencil className="size-4" />
                          Rename project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={(event) => {
                            event.preventDefault()
                            openDeleteProject(project)
                          }}
                        >
                          <Trash2 className="size-4" />
                          Delete project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </div>

      <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>
              Give your project a clear name.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="project-name-input">Project name</Label>
            <Input
              autoFocus
              id="project-name-input"
              placeholder="My project"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateProject()
                }
              }}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateProjectOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateProject}
              disabled={createProjectMutation.isPending}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteProjectOpen} onOpenChange={setIsDeleteProjectOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This will permanently remove the project and its data.
            </DialogDescription>
          </DialogHeader>

          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete{' '}
            <span className="text-foreground font-medium">
              {projectToEdit?.name}
            </span>
            ?
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteProjectOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={deleteProjectMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  )
}

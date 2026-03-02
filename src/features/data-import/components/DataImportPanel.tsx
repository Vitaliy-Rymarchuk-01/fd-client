import { useMemo, useRef, useState } from 'react'

import { FileSpreadsheet, Trash2, UploadCloud } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

import type { ImportFileItem } from '../types/file-import'

const ACCEPTED_EXTENSIONS = ['.txt', '.csv', '.xlsx'] as const

interface DataImportPanelProps {
  items: ImportFileItem[]
  onFilesAdded: (files: File[]) => void
  onRemoveItem: (id: string) => void
  onClear: () => void
  variant?: 'default' | 'full'
  className?: string
}

export function DataImportPanel({
  items,
  onFilesAdded,
  onRemoveItem,
  onClear,
  variant = 'default',
  className,
}: DataImportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const acceptAttr = useMemo(() => ACCEPTED_EXTENSIONS.join(','), [])

  const handleFiles = (files: FileList | File[]) => {
    const accepted = Array.from(files).filter((file) => {
      const extension = file.name
        .slice(file.name.lastIndexOf('.'))
        .toLowerCase()
      return ACCEPTED_EXTENSIONS.includes(
        extension as (typeof ACCEPTED_EXTENSIONS)[number],
      )
    })

    if (accepted.length > 0) {
      onFilesAdded(accepted)
    }
  }

  const onBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    handleFiles(e.target.files)
    e.target.value = ''
  }

  return (
    <div
      className={cn(
        variant === 'full' ? 'flex h-full min-h-0 flex-col gap-4' : 'space-y-4',
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptAttr}
        multiple
        className="hidden"
        onChange={onFileInputChange}
      />

      <div
        className={cn(
          'bg-sidebar-accent/10 hover:bg-sidebar-accent/15 text-sidebar-foreground relative flex flex-col items-center justify-center gap-4 rounded-2xl px-6 py-10 text-center transition-colors',
          variant === 'full' ? 'flex-1' : null,
          isDragging ? 'bg-sidebar-accent/25' : null,
        )}
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDragging(false)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDragging(false)

          if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files)
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onBrowseClick()
          }
        }}
        onClick={onBrowseClick}
      >
        <div className="bg-primary/12 text-primary flex size-16 items-center justify-center rounded-2xl">
          <UploadCloud className="size-7" />
        </div>

        <div>
          <p className="text-base font-semibold">Import files</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Drag & drop or click to upload
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Supports {ACCEPTED_EXTENSIONS.join(', ')}
          </p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">Queued files</p>
              <p className="text-muted-foreground text-xs">
                Automatically mapped into wells → stages
              </p>
            </div>
            <Button size="xs" variant="ghost" type="button" onClick={onClear}>
              Clear
            </Button>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="border-sidebar-border/80 flex items-center gap-3 rounded-lg border px-3 py-2"
              >
                <div className="text-sidebar-foreground/80">
                  <FileSpreadsheet className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {item.file.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {item.status === 'error' ? item.errorMessage : 'Queued'}
                  </p>
                </div>
                <Button
                  aria-label="Remove file"
                  size="icon-xs"
                  variant="ghost"
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

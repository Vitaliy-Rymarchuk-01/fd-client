import { useMemo, useRef, useState } from 'react'

import { CheckCircle2, Loader2, UploadCloud, XCircle } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

import type { ImportFileItem } from '../types/file-import'

const ACCEPTED_EXTENSIONS = ['.txt', '.csv', '.xlsx'] as const

interface UploadProgressProps {
  items: ImportFileItem[]
  onClear: () => void
}

function UploadProgress({ items, onClear }: UploadProgressProps) {
  const total = items.length
  const done = items.filter(
    (i) => i.status === 'uploaded' || i.status === 'error',
  ).length
  const hasError = items.some((i) => i.status === 'error')
  const allDone = done === total

  return (
    <div className="bg-sidebar-accent/10 rounded-2xl px-4 py-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {allDone ? (
            hasError ? (
              <XCircle className="text-destructive size-4" />
            ) : (
              <CheckCircle2 className="size-4 text-green-500" />
            )
          ) : (
            <Loader2 className="text-primary size-4 animate-spin" />
          )}
          <p className="text-sm font-semibold">
            {allDone
              ? hasError
                ? 'Upload failed'
                : 'Upload complete'
              : 'Uploading files…'}
          </p>
        </div>
        <Button size="xs" variant="ghost" type="button" onClick={onClear}>
          Clear
        </Button>
      </div>

      <div className="bg-sidebar-border/40 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            hasError ? 'bg-destructive' : 'bg-primary',
          )}
          style={{ width: `${Math.round((done / total) * 100)}%` }}
        />
      </div>

      <p className="text-muted-foreground mt-2 text-xs">
        {done} / {total} files processed
      </p>
    </div>
  )
}

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
        variant === 'full' ? 'flex h-full min-h-0 flex-col gap-2' : 'space-y-3',
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
          'bg-sidebar-accent/10 hover:bg-sidebar-accent/15 text-sidebar-foreground relative flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-5 text-center transition-colors',
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
        <div className="bg-primary/12 text-primary flex size-12 items-center justify-center rounded-xl">
          <UploadCloud className="size-5" />
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
        <UploadProgress items={items} onClear={onClear} />
      ) : null}
    </div>
  )
}

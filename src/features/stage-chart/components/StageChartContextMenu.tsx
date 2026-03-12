import { useEffect, useRef } from 'react'

type Props = {
  open: boolean
  x: number
  y: number
  onResetScale: () => void
  onClose: () => void
}

export function StageChartContextMenu(props: Props) {
  const { open, onClose } = props
  const contextMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDownCapture = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && contextMenuRef.current?.contains(target)) {
        return
      }
      onClose()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('pointerdown', onPointerDownCapture, true)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('pointerdown', onPointerDownCapture, true)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!props.open) return null

  const menuWidthPx = 192
  const menuHeightPx = 44
  const padding = 8

  const viewportW =
    typeof window !== 'undefined' ? window.innerWidth : props.x + menuWidthPx
  const viewportH =
    typeof window !== 'undefined' ? window.innerHeight : props.y + menuHeightPx

  const left = Math.max(
    padding,
    Math.min(props.x, viewportW - menuWidthPx - padding),
  )
  const top = Math.max(
    padding,
    Math.min(props.y, viewportH - menuHeightPx - padding),
  )

  return (
    <div
      ref={contextMenuRef}
      className="bg-popover text-popover-foreground border-border fixed z-50 min-w-48 overflow-hidden rounded-md border p-1 shadow-md"
      style={{ left, top }}
      role="menu"
    >
      <button
        type="button"
        className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-left text-sm"
        onClick={() => {
          props.onResetScale()
          props.onClose()
        }}
      >
        Set Scale to Default
      </button>
    </div>
  )
}

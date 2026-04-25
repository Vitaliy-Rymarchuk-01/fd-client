import { useEffect, useRef, useState } from 'react'
import type { PointerEventHandler, WheelEventHandler } from 'react'

import { localPoint } from '@visx/event'
import { ParentSize } from '@visx/responsive'
import { scaleLinear } from '@visx/scale'

import { useBreakdowns } from '@/features/breakdowns'
import { useStageSeries } from '@/features/stage-series'

import { useCurveVisibilityStore } from '@/shared/store/curve-visibility'
import { useStageSelectionStore } from '@/shared/store/stage-selection'

import { clampDomain, findNearestIndex, getMinMax } from '../utils/domain'
import { StageChartContextMenu } from './StageChartContextMenu'
import { StageChartHeader } from './StageChartHeader'
import { StageChartPlot } from './StageChartPlot'

export function StageChart() {
  const selectedStageId = useStageSelectionStore((s) => s.selectedStageId)
  const q = useStageSeries(selectedStageId)

  const showTreatingPressure = useCurveVisibilityStore(
    (s) => s.showTreatingPressure,
  )
  const showBottomHolePressure = useCurveVisibilityStore(
    (s) => s.showBottomHolePressure,
  )
  const showSlurryRate = useCurveVisibilityStore((s) => s.showSlurryRate)
  const showPropCon = useCurveVisibilityStore((s) => s.showPropCon)
  const showWellBorePropMass = useCurveVisibilityStore(
    (s) => s.showWellBorePropMass,
  )
  const breakdownMode = useCurveVisibilityStore((s) => s.breakdownMode)

  const breakdownsQ = useBreakdowns(selectedStageId, q.data, breakdownMode)

  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const [contextMenu, setContextMenu] = useState<{
    open: boolean
    x: number
    y: number
  }>({ open: false, x: 0, y: 0 })

  const openContextMenu = (x: number, y: number) => {
    setContextMenu({ open: true, x, y })
  }

  const [xDomainByStageId, setXDomainByStageId] = useState<
    Record<string, { min: number; max: number }>
  >({})

  const xDomainOverride = selectedStageId
    ? (xDomainByStageId[selectedStageId] ?? null)
    : null

  const setXDomainOverride = (next: { min: number; max: number } | null) => {
    if (!selectedStageId) return

    setXDomainByStageId((prev) => {
      const updated = { ...prev }
      if (next == null) {
        delete updated[selectedStageId]
        return updated
      }
      updated[selectedStageId] = next
      return updated
    })
  }

  const panRef = useRef<{
    startX: number
    domain: { min: number; max: number }
  } | null>(null)

  const selectionRef = useRef<{
    startX: number
    startY: number
    currentX: number
    currentY: number
    active: boolean
  } | null>(null)

  const overlayRef = useRef<SVGRectElement | null>(null)

  const [, forceRerender] = useState(0)

  useEffect(() => {
    const node = overlayRef.current
    if (!node) return

    const stopAll = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    const wheelHandler = stopAll
    const gestureHandler = stopAll
    const touchHandler = stopAll

    node.addEventListener('wheel', wheelHandler, { passive: false })
    node.addEventListener('gesturestart', gestureHandler as EventListener, {
      passive: false,
    })
    node.addEventListener('gesturechange', gestureHandler as EventListener, {
      passive: false,
    })
    node.addEventListener('touchmove', touchHandler, { passive: false })

    return () => {
      node.removeEventListener('wheel', wheelHandler)
      node.removeEventListener('gesturestart', gestureHandler as EventListener)
      node.removeEventListener('gesturechange', gestureHandler as EventListener)
      node.removeEventListener('touchmove', touchHandler)
    }
  }, [selectedStageId])

  return (
    <section className="flex h-full min-h-0 flex-col">
      <StageChartHeader title="Stage chart" />

      <div className="bg-card/80 min-h-0 flex-1 p-2">
        <div className="h-full min-h-0">
          {!selectedStageId ? (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
              Select a stage to see chart.
            </div>
          ) : q.isLoading ? (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
              Loading series…
            </div>
          ) : q.isError || !q.data ? (
            <div className="text-destructive flex h-full w-full items-center justify-center text-sm">
              Failed to load series.
            </div>
          ) : (
            <ParentSize>
              {({ width, height }) => {
                const margin = { top: 16, right: 196, bottom: 28, left: 56 }
                const mainHeight = Math.max(0, height)

                const innerWidth = Math.max(
                  0,
                  width - margin.left - margin.right,
                )
                const innerHeight = Math.max(
                  0,
                  mainHeight - margin.top - margin.bottom,
                )

                const {
                  bottomHolePressure,
                  bottomHolePropCon,
                  propCon,
                  seconds,
                  slurryRate,
                  treatingPressure,
                  wellBorePropMass,
                } = q.data

                if (
                  seconds.length < 2 ||
                  treatingPressure.length < 2 ||
                  slurryRate.length < 2 ||
                  bottomHolePressure.length < 2
                ) {
                  return (
                    <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
                      Not enough data to render chart.
                    </div>
                  )
                }

                const fullX = getMinMax(seconds)
                const currentX = clampDomain({
                  domain: xDomainOverride ?? fullX,
                  full: fullX,
                })

                const pressureMinMax = getMinMax(
                  showBottomHolePressure
                    ? treatingPressure.concat(bottomHolePressure)
                    : treatingPressure,
                )
                const slurryMinMax = getMinMax(slurryRate)

                const propConMinMax = getMinMax(
                  showBottomHolePressure
                    ? propCon.concat(bottomHolePropCon)
                    : propCon,
                )

                const wellBorePropMassMinMax = getMinMax(wellBorePropMass)

                const xScale = scaleLinear({
                  domain: [currentX.min, currentX.max],
                  range: [0, innerWidth],
                  nice: false,
                })

                const pressureScale = scaleLinear({
                  domain: [
                    pressureMinMax.min / 1000,
                    pressureMinMax.max / 1000,
                  ],
                  range: [innerHeight, 0],
                  nice: true,
                })

                const slurryScale = scaleLinear({
                  domain: [slurryMinMax.min, slurryMinMax.max],
                  range: [innerHeight, 0],
                  nice: true,
                })

                const propConScale = scaleLinear({
                  domain: [propConMinMax.min, propConMinMax.max],
                  range: [innerHeight, 0],
                  nice: true,
                })

                const wellBorePropMassScale = scaleLinear({
                  domain: [
                    wellBorePropMassMinMax.min / 1000,
                    wellBorePropMassMinMax.max / 1000,
                  ],
                  range: [innerHeight, 0],
                  nice: true,
                })

                const onWheel: WheelEventHandler<SVGRectElement> = (e) => {
                  e.stopPropagation()
                  const pt = localPoint(e)
                  if (!pt) return
                  const x = pt.x - margin.left
                  if (x < 0 || x > innerWidth) return

                  const at = xScale.invert(x)
                  const span = currentX.max - currentX.min
                  const fullSpan = fullX.max - fullX.min
                  if (!Number.isFinite(span) || span <= 0) return
                  if (!Number.isFinite(fullSpan) || fullSpan <= 0) return

                  const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1

                  const next = clampDomain({
                    domain: {
                      min: at - (at - currentX.min) * zoomFactor,
                      max: at + (currentX.max - at) * zoomFactor,
                    },
                    full: fullX,
                  })
                  setXDomainOverride(next)
                }

                const onDoubleClick: PointerEventHandler<SVGRectElement> = (
                  e,
                ) => {
                  e.stopPropagation()
                  e.preventDefault()
                  const native = e.nativeEvent
                  openContextMenu(native.clientX, native.clientY)
                }

                const onContextMenu: React.MouseEventHandler<SVGRectElement> = (
                  e,
                ) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openContextMenu(e.clientX, e.clientY)
                }

                const onHoverMove: PointerEventHandler<SVGRectElement> = (
                  e,
                ) => {
                  if (selectionRef.current?.active) return
                  if (panRef.current) return

                  const pt = localPoint(e)
                  if (!pt) return
                  const x = pt.x - margin.left
                  if (x < 0 || x > innerWidth) return

                  const sec = xScale.invert(x)
                  const idx = findNearestIndex(seconds, sec)
                  setHoverIndex(idx)
                }

                const onHoverLeave: PointerEventHandler<
                  SVGRectElement
                > = () => {
                  setHoverIndex(null)
                }

                const onPointerDown: PointerEventHandler<SVGRectElement> = (
                  e,
                ) => {
                  const pt = localPoint(e)
                  if (!pt) return
                  const x = pt.x - margin.left
                  const y = pt.y - margin.top
                  if (x < 0 || x > innerWidth) return

                  if (e.altKey) {
                    panRef.current = {
                      startX: x,
                      domain: currentX,
                    }
                    ;(e.target as SVGRectElement).setPointerCapture(e.pointerId)
                    return
                  }

                  selectionRef.current = {
                    startX: x,
                    startY: Math.max(0, Math.min(innerHeight, y)),
                    currentX: x,
                    currentY: Math.max(0, Math.min(innerHeight, y)),
                    active: true,
                  }
                  forceRerender((v) => v + 1)
                  ;(e.target as SVGRectElement).setPointerCapture(e.pointerId)
                }

                const onPointerMove: PointerEventHandler<SVGRectElement> = (
                  e,
                ) => {
                  e.stopPropagation()
                  e.preventDefault()
                  const pt = localPoint(e)
                  if (!pt) return
                  const x = pt.x - margin.left
                  const y = pt.y - margin.top

                  if (selectionRef.current?.active) {
                    selectionRef.current.currentX = Math.max(
                      0,
                      Math.min(innerWidth, x),
                    )
                    selectionRef.current.currentY = Math.max(
                      0,
                      Math.min(innerHeight, y),
                    )
                    forceRerender((v) => v + 1)
                    return
                  }

                  if (!panRef.current) return
                  const dx = x - panRef.current.startX

                  const span =
                    panRef.current.domain.max - panRef.current.domain.min
                  if (!Number.isFinite(span) || span <= 0) return

                  const delta = (dx / Math.max(1, innerWidth)) * span
                  const next = clampDomain({
                    domain: {
                      min: panRef.current.domain.min - delta,
                      max: panRef.current.domain.max - delta,
                    },
                    full: fullX,
                  })
                  setXDomainOverride(next)
                }

                const onPointerUp: PointerEventHandler<SVGRectElement> = (
                  e,
                ) => {
                  if (selectionRef.current?.active) {
                    const start = selectionRef.current.startX
                    const end = selectionRef.current.currentX
                    const startY = selectionRef.current.startY
                    const endY = selectionRef.current.currentY
                    selectionRef.current = null
                    forceRerender((v) => v + 1)

                    const x0 = Math.min(start, end)
                    const x1 = Math.max(start, end)
                    const y0 = Math.min(startY, endY)
                    const y1 = Math.max(startY, endY)

                    if (Math.abs(x1 - x0) > 6 && Math.abs(y1 - y0) > 6) {
                      const next = clampDomain({
                        domain: {
                          min: xScale.invert(x0),
                          max: xScale.invert(x1),
                        },
                        full: fullX,
                      })
                      setXDomainOverride(next)
                    }

                    try {
                      ;(e.target as SVGRectElement).releasePointerCapture(
                        e.pointerId,
                      )
                    } catch {
                      // ignore
                    }

                    return
                  }

                  panRef.current = null
                  ;(e.target as SVGRectElement).releasePointerCapture(
                    e.pointerId,
                  )
                }

                const onPointerCancel: PointerEventHandler<SVGRectElement> = (
                  e,
                ) => {
                  panRef.current = null
                  selectionRef.current = null
                  try {
                    ;(e.target as SVGRectElement).releasePointerCapture(
                      e.pointerId,
                    )
                  } catch {
                    // ignore
                  }
                }

                const selection = selectionRef.current
                const selectionBox =
                  selection && selection.active
                    ? {
                        x: Math.min(selection.startX, selection.currentX),
                        y: Math.min(selection.startY, selection.currentY),
                        w: Math.max(
                          0,
                          Math.abs(selection.currentX - selection.startX),
                        ),
                        h: Math.max(
                          0,
                          Math.abs(selection.currentY - selection.startY),
                        ),
                      }
                    : null

                const idx =
                  hoverIndex == null
                    ? null
                    : Math.max(0, Math.min(seconds.length - 1, hoverIndex))

                const hoverX =
                  idx == null ? null : (xScale(seconds[idx] ?? 0) ?? null)

                const hoverTreatingY =
                  idx == null
                    ? null
                    : (pressureScale((treatingPressure[idx] ?? 0) / 1000) ??
                      null)

                const hoverBhY =
                  idx == null
                    ? null
                    : (pressureScale((bottomHolePressure[idx] ?? 0) / 1000) ??
                      null)

                const hoverSlurryY =
                  idx == null
                    ? null
                    : (slurryScale(slurryRate[idx] ?? 0) ?? null)

                const hoverPropConY =
                  idx == null
                    ? null
                    : (propConScale(
                        (showBottomHolePressure
                          ? bottomHolePropCon[idx]
                          : propCon[idx]) ?? 0,
                      ) ?? null)

                const hoverWellBorePropMassY =
                  idx == null
                    ? null
                    : (wellBorePropMassScale(
                        (wellBorePropMass[idx] ?? 0) / 1000,
                      ) ?? null)

                return (
                  <div className="h-full w-full">
                    <StageChartContextMenu
                      open={contextMenu.open}
                      x={contextMenu.x}
                      y={contextMenu.y}
                      onResetScale={() => setXDomainOverride(null)}
                      onClose={() =>
                        setContextMenu((prev) => ({ ...prev, open: false }))
                      }
                    />
                    <StageChartPlot
                      width={width}
                      height={height}
                      margin={margin}
                      innerWidth={innerWidth}
                      innerHeight={innerHeight}
                      startTime={q.data.startTime}
                      seconds={seconds}
                      treatingPressure={treatingPressure}
                      bottomHolePressure={bottomHolePressure}
                      slurryRate={slurryRate}
                      propCon={propCon}
                      bottomHolePropCon={bottomHolePropCon}
                      wellBorePropMass={wellBorePropMass}
                      showTreatingPressure={showTreatingPressure}
                      showBottomHolePressure={showBottomHolePressure}
                      showSlurryRate={showSlurryRate}
                      showPropCon={showPropCon}
                      showWellBorePropMass={showWellBorePropMass}
                      showBreakdownZones={Boolean(breakdownMode)}
                      breakdownZones={
                        breakdownMode ? (breakdownsQ.data?.zones ?? []) : []
                      }
                      xScale={xScale}
                      pressureScale={pressureScale}
                      slurryScale={slurryScale}
                      propConScale={propConScale}
                      wellBorePropMassScale={wellBorePropMassScale}
                      selectionBox={selectionBox}
                      hoverX={hoverX}
                      hoverTreatingY={hoverTreatingY}
                      hoverBhY={hoverBhY}
                      hoverSlurryY={hoverSlurryY}
                      hoverPropConY={hoverPropConY}
                      hoverWellBorePropMassY={hoverWellBorePropMassY}
                      hoverIndex={idx}
                      onWheel={onWheel}
                      onDoubleClick={onDoubleClick}
                      onContextMenu={onContextMenu}
                      onPointerDown={onPointerDown}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={onPointerCancel}
                      onHoverLeave={onHoverLeave}
                      onHoverMove={onHoverMove}
                      overlayRef={overlayRef}
                    />
                  </div>
                )
              }}
            </ParentSize>
          )}
        </div>
      </div>
    </section>
  )
}

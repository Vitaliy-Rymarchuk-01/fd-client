import type {
  MouseEventHandler,
  PointerEventHandler,
  RefObject,
  WheelEventHandler,
} from 'react'
import { useId } from 'react'

import { AxisBottom, AxisLeft, AxisRight } from '@visx/axis'
import { curveMonotoneX } from '@visx/curve'
import { GridRows } from '@visx/grid'
import { Group } from '@visx/group'
import { AreaClosed, LinePath } from '@visx/shape'
import type { ScaleLinear } from 'd3-scale'

import type { BreakdownZoneDTO } from '@/features/breakdowns'

import { useTheme } from '@/shared/hooks/use-theme'

type Margin = {
  top: number
  right: number
  bottom: number
  left: number
}

type SelectionBox = {
  x: number
  y: number
  w: number
  h: number
}

type Props = {
  width: number
  height: number
  margin: Margin
  innerWidth: number
  innerHeight: number

  startTime: string

  seconds: number[]
  treatingPressure: number[]
  bottomHolePressure: number[]
  slurryRate: number[]
  cleanRate: number[]
  propCon: number[]
  bottomHolePropCon: number[]
  wellBorePropMass: number[]

  showTreatingPressure: boolean
  showBottomHolePressure: boolean
  showSlurryRate: boolean
  showCleanRate: boolean
  showPropCon: boolean
  showWellBorePropMass: boolean

  showBreakdownZones: boolean
  breakdownZones: BreakdownZoneDTO[]

  xScale: ScaleLinear<number, number>
  pressureScale: ScaleLinear<number, number>
  slurryScale: ScaleLinear<number, number>
  propConScale: ScaleLinear<number, number>
  wellBorePropMassScale: ScaleLinear<number, number>

  selectionBox: SelectionBox | null

  hoverX: number | null
  hoverTreatingY: number | null
  hoverBhY: number | null
  hoverSlurryY: number | null
  hoverCleanRateY: number | null
  hoverPropConY: number | null
  hoverWellBorePropMassY: number | null
  hoverIndex: number | null

  onWheel: WheelEventHandler<SVGRectElement>
  onDoubleClick: PointerEventHandler<SVGRectElement>
  onContextMenu: MouseEventHandler<SVGRectElement>
  onPointerDown: PointerEventHandler<SVGRectElement>
  onPointerMove: PointerEventHandler<SVGRectElement>
  onPointerUp: PointerEventHandler<SVGRectElement>
  onPointerCancel: PointerEventHandler<SVGRectElement>
  onHoverLeave: PointerEventHandler<SVGRectElement>
  onHoverMove: PointerEventHandler<SVGRectElement>

  overlayRef: RefObject<SVGRectElement | null>
}

export function StageChartPlot(props: Props) {
  const {
    width,
    height,
    margin,
    innerWidth,
    innerHeight,
    startTime,
    seconds,
    treatingPressure,
    bottomHolePressure,
    slurryRate,
    cleanRate,
    propCon,
    bottomHolePropCon,
    wellBorePropMass,
    showTreatingPressure,
    showBottomHolePressure,
    showSlurryRate,
    showCleanRate,
    showPropCon,
    showWellBorePropMass,
    showBreakdownZones,
    breakdownZones,
    xScale,
    pressureScale,
    slurryScale,
    propConScale,
    wellBorePropMassScale,
    selectionBox,
    hoverX,
    hoverTreatingY,
    hoverBhY,
    hoverSlurryY,
    hoverCleanRateY,
    hoverPropConY,
    hoverWellBorePropMassY,
    hoverIndex,
    onWheel,
    onDoubleClick,
    onContextMenu,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onHoverLeave,
    onHoverMove,
    overlayRef,
  } = props

  const { theme } = useTheme()

  const treatingColor = '#ef4444'
  const bhColor = '#22c55e'
  const slurryColor = '#2563eb'
  const cleanRateColor = '#ADD8E6'
  const propConColor = '#94a3b8'
  const wellBorePropMassColor = '#a16207'

  const gridColor = 'rgba(148, 163, 184, 0.22)'
  const axisStroke = 'rgba(148, 163, 184, 0.55)'
  const tickStroke = 'rgba(148, 163, 184, 0.35)'
  const tickLabel = theme === 'dark' ? 'rgba(255, 255, 255, 0.55)' : '#000000'

  const idx =
    hoverIndex == null
      ? null
      : Math.max(0, Math.min(seconds.length - 1, hoverIndex))

  const startDate = new Date(startTime)

  const clipId = useId()

  const formatTimeTick = (v: unknown) => {
    const sec = Number(v)
    if (!Number.isFinite(sec)) return ''
    const ms = startDate.getTime() + sec * 1000
    const d = new Date(ms)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  }

  return (
    <svg
      width={width}
      height={height}
      aria-label="Stage chart"
      className="overflow-hidden select-none"
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <rect x={0} y={0} width={innerWidth} height={innerHeight} />
        </clipPath>

        <linearGradient id="treatingArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={treatingColor} stopOpacity={0.22} />
          <stop offset="100%" stopColor={treatingColor} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="bhArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bhColor} stopOpacity={0.18} />
          <stop offset="100%" stopColor={bhColor} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="slurryArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={slurryColor} stopOpacity={0.2} />
          <stop offset="100%" stopColor={slurryColor} stopOpacity={0} />
        </linearGradient>
      </defs>

      <Group left={margin.left} top={margin.top}>
        <g clipPath={`url(#${clipId})`}>
          <GridRows
            scale={pressureScale}
            width={innerWidth}
            stroke={gridColor}
            strokeOpacity={1}
          />

          {showTreatingPressure ? (
            <AreaClosed
              data={seconds}
              x={(sec) => xScale(sec) ?? 0}
              y={(_, i) =>
                pressureScale((treatingPressure[i] ?? 0) / 1000) ?? 0
              }
              yScale={pressureScale}
              curve={curveMonotoneX}
              fill="url(#treatingArea)"
            />
          ) : null}

          {selectionBox && selectionBox.w > 0 && selectionBox.h > 0 ? (
            <rect
              x={selectionBox.x}
              y={selectionBox.y}
              width={selectionBox.w}
              height={selectionBox.h}
              fill="rgba(37, 99, 235, 0.10)"
              stroke="rgba(37, 99, 235, 0.45)"
              strokeWidth={1}
            />
          ) : null}

          {showBottomHolePressure ? (
            <AreaClosed
              data={seconds}
              x={(sec) => xScale(sec) ?? 0}
              y={(_, i) =>
                pressureScale((bottomHolePressure[i] ?? 0) / 1000) ?? 0
              }
              yScale={pressureScale}
              curve={curveMonotoneX}
              fill="url(#bhArea)"
            />
          ) : null}

          {showSlurryRate ? (
            <AreaClosed
              data={seconds}
              x={(sec) => xScale(sec) ?? 0}
              y={(_, i) => slurryScale(slurryRate[i] ?? 0) ?? 0}
              yScale={slurryScale}
              curve={curveMonotoneX}
              fill="url(#slurryArea)"
            />
          ) : null}

          {showTreatingPressure ? (
            <LinePath
              data={seconds}
              x={(sec) => xScale(sec) ?? 0}
              y={(_, idx2) =>
                pressureScale((treatingPressure[idx2] ?? 0) / 1000) ?? 0
              }
              curve={curveMonotoneX}
              stroke={treatingColor}
              strokeOpacity={0.9}
              strokeWidth={2}
            />
          ) : null}

          {showBreakdownZones && showTreatingPressure
            ? breakdownZones.map((zone, i) => {
                const startIdx = Math.max(0, zone.startIndex)
                const endIdx = Math.min(seconds.length - 1, zone.endIndex)
                if (endIdx - startIdx < 1) return null

                const segmentSeconds = seconds.slice(startIdx, endIdx + 1)
                const segmentPressure = treatingPressure.slice(
                  startIdx,
                  endIdx + 1,
                )

                const stroke =
                  zone.kind === 'large'
                    ? 'rgba(255, 0, 0, 1)'
                    : zone.kind === 'medium'
                      ? 'rgba(255, 119, 0, 1)'
                      : 'rgba(255, 255, 0, 1)'

                return (
                  <g key={`tp-bz-${i}`}>
                    <LinePath
                      data={segmentSeconds}
                      x={(sec) => xScale(sec) ?? 0}
                      y={(_, idx2) =>
                        pressureScale((segmentPressure[idx2] ?? 0) / 1000) ?? 0
                      }
                      curve={curveMonotoneX}
                      stroke="rgba(0, 0, 0, 0.85)"
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <LinePath
                      data={segmentSeconds}
                      x={(sec) => xScale(sec) ?? 0}
                      y={(_, idx2) =>
                        pressureScale((segmentPressure[idx2] ?? 0) / 1000) ?? 0
                      }
                      curve={curveMonotoneX}
                      stroke={stroke}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )
              })
            : null}

          {showBreakdownZones
            ? breakdownZones.map((zone, i) => {
                const startIdx = Math.max(0, zone.startIndex)
                const endIdx = Math.min(seconds.length - 1, zone.endIndex)
                if (endIdx - startIdx < 1) return null

                const x0 = xScale(seconds[startIdx] ?? 0) ?? 0
                const x1 = xScale(seconds[endIdx] ?? 0) ?? 0

                const tpY0 = showTreatingPressure
                  ? (pressureScale((treatingPressure[startIdx] ?? 0) / 1000) ??
                    0)
                  : null
                const tpY1 = showTreatingPressure
                  ? (pressureScale((treatingPressure[endIdx] ?? 0) / 1000) ?? 0)
                  : null

                const srY0 = showSlurryRate
                  ? (slurryScale(slurryRate[startIdx] ?? 0) ?? 0)
                  : null
                const srY1 = showSlurryRate
                  ? (slurryScale(slurryRate[endIdx] ?? 0) ?? 0)
                  : null

                return (
                  <g key={`bz-link-${i}`}>
                    {tpY0 != null && srY0 != null ? (
                      <line
                        x1={x0}
                        x2={x0}
                        y1={Math.min(tpY0, srY0)}
                        y2={Math.max(tpY0, srY0)}
                        stroke="rgba(0, 0, 0, 0.45)"
                        strokeWidth={1}
                        strokeDasharray="3 4"
                      />
                    ) : null}

                    {tpY1 != null && srY1 != null ? (
                      <line
                        x1={x1}
                        x2={x1}
                        y1={Math.min(tpY1, srY1)}
                        y2={Math.max(tpY1, srY1)}
                        stroke="rgba(0, 0, 0, 0.45)"
                        strokeWidth={1}
                        strokeDasharray="3 4"
                      />
                    ) : null}
                  </g>
                )
              })
            : null}

          {showBottomHolePressure ? (
            <LinePath
              data={seconds}
              x={(sec) => xScale(sec) ?? 0}
              y={(_, idx2) =>
                pressureScale((bottomHolePressure[idx2] ?? 0) / 1000) ?? 0
              }
              curve={curveMonotoneX}
              stroke={bhColor}
              strokeOpacity={0.75}
              strokeWidth={2}
            />
          ) : null}

          {showSlurryRate ? (
            <LinePath
              data={seconds}
              x={(sec) => xScale(sec) ?? 0}
              y={(_, idx2) => slurryScale(slurryRate[idx2] ?? 0) ?? 0}
              curve={curveMonotoneX}
              stroke={slurryColor}
              strokeOpacity={0.9}
              strokeWidth={2}
            />
          ) : null}

          {showCleanRate ? (
            <LinePath
              data={seconds}
              x={(sec) => xScale(sec) ?? 0}
              y={(_, idx2) => slurryScale(cleanRate[idx2] ?? 0) ?? 0}
              curve={curveMonotoneX}
              stroke={cleanRateColor}
              strokeOpacity={0.9}
              strokeWidth={2}
            />
          ) : null}

          {showBreakdownZones && showSlurryRate
            ? breakdownZones.map((zone, i) => {
                const startIdx = Math.max(0, zone.startIndex)
                const endIdx = Math.min(seconds.length - 1, zone.endIndex)
                if (endIdx - startIdx < 1) return null

                const segmentSeconds = seconds.slice(startIdx, endIdx + 1)
                const segmentRate = slurryRate.slice(startIdx, endIdx + 1)

                const stroke =
                  zone.kind === 'large'
                    ? 'rgba(255, 0, 0, 1)'
                    : zone.kind === 'medium'
                      ? 'rgba(255, 119, 0, 1)'
                      : 'rgba(255, 255, 0, 1)'

                return (
                  <g key={`sr-bz-${i}`}>
                    <LinePath
                      data={segmentSeconds}
                      x={(sec) => xScale(sec) ?? 0}
                      y={(_, idx2) => slurryScale(segmentRate[idx2] ?? 0) ?? 0}
                      curve={curveMonotoneX}
                      stroke="rgba(0, 0, 0, 0.85)"
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <LinePath
                      data={segmentSeconds}
                      x={(sec) => xScale(sec) ?? 0}
                      y={(_, idx2) => slurryScale(segmentRate[idx2] ?? 0) ?? 0}
                      curve={curveMonotoneX}
                      stroke={stroke}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )
              })
            : null}

          {showPropCon ? (
            <LinePath
              data={seconds}
              x={(sec) => xScale(sec) ?? 0}
              y={(_, idx2) =>
                propConScale(
                  (showBottomHolePressure
                    ? bottomHolePropCon[idx2]
                    : propCon[idx2]) ?? 0,
                ) ?? 0
              }
              curve={curveMonotoneX}
              stroke={propConColor}
              strokeOpacity={0.85}
              strokeWidth={1.5}
            />
          ) : null}

          {showWellBorePropMass ? (
            <LinePath
              data={seconds}
              x={(sec) => xScale(sec) ?? 0}
              y={(_, idx2) =>
                wellBorePropMassScale((wellBorePropMass[idx2] ?? 0) / 1000) ?? 0
              }
              curve={curveMonotoneX}
              stroke={wellBorePropMassColor}
              strokeOpacity={0.85}
              strokeWidth={1.5}
            />
          ) : null}

          {hoverX != null ? (
            <line
              x1={hoverX}
              x2={hoverX}
              y1={0}
              y2={innerHeight}
              stroke="rgba(148, 163, 184, 0.65)"
              strokeDasharray="4 4"
            />
          ) : null}

          {hoverX != null && hoverTreatingY != null && showTreatingPressure ? (
            <circle
              cx={hoverX}
              cy={hoverTreatingY}
              r={3.5}
              fill={treatingColor}
              stroke="white"
              strokeWidth={1.5}
            />
          ) : null}

          {hoverX != null && hoverBhY != null && showBottomHolePressure ? (
            <circle
              cx={hoverX}
              cy={hoverBhY}
              r={3.5}
              fill={bhColor}
              stroke="white"
              strokeWidth={1.5}
            />
          ) : null}

          {hoverX != null && hoverSlurryY != null && showSlurryRate ? (
            <circle
              cx={hoverX}
              cy={hoverSlurryY}
              r={3.5}
              fill={slurryColor}
              stroke="white"
              strokeWidth={1.5}
            />
          ) : null}

          {hoverX != null && hoverCleanRateY != null && showCleanRate ? (
            <circle
              cx={hoverX}
              cy={hoverCleanRateY}
              r={3.5}
              fill={cleanRateColor}
              stroke="white"
              strokeWidth={1.5}
            />
          ) : null}

          {hoverX != null && hoverPropConY != null && showPropCon ? (
            <circle
              cx={hoverX}
              cy={hoverPropConY}
              r={3.5}
              fill={propConColor}
              stroke="white"
              strokeWidth={1.5}
            />
          ) : null}

          {hoverX != null &&
          hoverWellBorePropMassY != null &&
          showWellBorePropMass ? (
            <circle
              cx={hoverX}
              cy={hoverWellBorePropMassY}
              r={3.5}
              fill={wellBorePropMassColor}
              stroke="white"
              strokeWidth={1.5}
            />
          ) : null}
        </g>

        {hoverX != null && idx != null ? (
          <g>
            <rect
              x={Math.min(innerWidth - 180, hoverX + 12)}
              y={12}
              width={168}
              height={showPropCon || showWellBorePropMass ? 116 : 76}
              rx={12}
              fill="#ffffff"
              opacity={0.98}
              stroke="rgba(15, 23, 42, 0.08)"
              strokeWidth={1}
            />
            <text
              x={Math.min(innerWidth - 170, hoverX + 20)}
              y={35}
              fill={treatingColor}
              fontSize={11}
              fontWeight={600}
            >
              {`TP: ${Number(treatingPressure[idx] ?? 0).toFixed(0)} psi (${(
                Number(treatingPressure[idx] ?? 0) / 1000
              ).toFixed(1)}k)`}
            </text>
            <text
              x={Math.min(innerWidth - 170, hoverX + 20)}
              y={55}
              fill={bhColor}
              fontSize={11}
              fontWeight={600}
            >
              {`BHP: ${Number(bottomHolePressure[idx] ?? 0).toFixed(0)} psi (${(
                Number(bottomHolePressure[idx] ?? 0) / 1000
              ).toFixed(1)}k)`}
            </text>
            <text
              x={Math.min(innerWidth - 170, hoverX + 20)}
              y={75}
              fill={slurryColor}
              fontSize={11}
              fontWeight={600}
            >
              {`Rate: ${Number(slurryRate[idx] ?? 0).toFixed(2)}`}
            </text>

            {showPropCon ? (
              <text
                x={Math.min(innerWidth - 170, hoverX + 20)}
                y={95}
                fill={propConColor}
                fontSize={11}
                fontWeight={600}
              >
                {`Prop: ${Number(propCon[idx] ?? 0).toFixed(2)} PPA`}
              </text>
            ) : null}

            {showWellBorePropMass ? (
              <text
                x={Math.min(innerWidth - 170, hoverX + 20)}
                y={115}
                fill={wellBorePropMassColor}
                fontSize={11}
                fontWeight={600}
              >
                {`WB Prop: ${Number(wellBorePropMass[idx] ?? 0).toFixed(0)} lb (${(
                  Number(wellBorePropMass[idx] ?? 0) / 1000
                ).toFixed(1)}k)`}
              </text>
            ) : null}
          </g>
        ) : null}

        <text
          x={-42}
          y={innerHeight / 2}
          transform={`rotate(-90, -42, ${innerHeight / 2})`}
          fill={treatingColor}
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
        >
          Pressure (psi*10^3)
        </text>

        {(() => {
          let rightOffset = 0
          const slurryLabelX = showSlurryRate ? innerWidth + 32 : null
          if (showSlurryRate) rightOffset += 65
          const propConLabelX = showPropCon
            ? innerWidth + rightOffset + 11
            : null
          if (showPropCon) rightOffset += 65
          const wbpmLabelX = showWellBorePropMass
            ? innerWidth + rightOffset + 11
            : null
          return (
            <>
              {slurryLabelX != null ? (
                <text
                  x={slurryLabelX}
                  y={innerHeight / 1.9}
                  transform={`rotate(-90, ${slurryLabelX}, ${innerHeight / 2})`}
                  fill={slurryColor}
                  fontSize={12}
                  fontWeight={600}
                  textAnchor="middle"
                >
                  Rate (bbl/min)
                </text>
              ) : null}
              {propConLabelX != null ? (
                <text
                  x={propConLabelX}
                  y={innerHeight / 1.8}
                  transform={`rotate(-90, ${propConLabelX}, ${innerHeight / 2})`}
                  fill={propConColor}
                  fontSize={12}
                  fontWeight={600}
                  textAnchor="middle"
                >
                  Prop. conc. (ppg)
                </text>
              ) : null}
              {wbpmLabelX != null ? (
                <text
                  x={wbpmLabelX}
                  y={innerHeight / 1.7}
                  transform={`rotate(-90, ${wbpmLabelX}, ${innerHeight / 2})`}
                  fill={wellBorePropMassColor}
                  fontSize={12}
                  fontWeight={600}
                  textAnchor="middle"
                >
                  Wellbore prop. mass (lbs*10^3)
                </text>
              ) : null}
            </>
          )
        })()}

        <AxisBottom
          top={innerHeight}
          scale={xScale}
          tickFormat={formatTimeTick}
          stroke={axisStroke}
          tickStroke={tickStroke}
          tickLabelProps={() => ({
            fill: tickLabel,
            fontSize: 11,
            textAnchor: 'middle',
            dy: '0.25em',
          })}
        />
        <AxisLeft
          scale={pressureScale}
          tickFormat={(v) => Number(v).toFixed(0)}
          stroke={axisStroke}
          tickStroke={tickStroke}
          tickLabelProps={() => ({
            fill: tickLabel,
            fontSize: 11,
            textAnchor: 'end',
            dx: '-0.25em',
            dy: '0.25em',
          })}
        />
        {(() => {
          let rightOffset = 0
          const axes: React.ReactNode[] = []
          if (showSlurryRate) {
            axes.push(
              <AxisRight
                key="slurry"
                left={innerWidth + rightOffset}
                scale={slurryScale}
                tickFormat={(v) => Number(v).toFixed(0)}
                stroke={axisStroke}
                tickStroke={tickStroke}
                tickLabelProps={() => ({
                  fill: tickLabel,
                  fontSize: 11,
                  textAnchor: 'start',
                  dx: '0.25em',
                  dy: '0.25em',
                })}
              />,
            )
            rightOffset += 65
          }
          if (showPropCon) {
            axes.push(
              <AxisRight
                key="propCon"
                left={innerWidth + rightOffset}
                scale={propConScale}
                tickFormat={(v) => Number(v).toFixed(1)}
                stroke={axisStroke}
                tickStroke={tickStroke}
                tickLabelProps={() => ({
                  fill: tickLabel,
                  fontSize: 11,
                  textAnchor: 'start',
                  dx: '0.25em',
                  dy: '0.25em',
                })}
              />,
            )
            rightOffset += 65
          }
          if (showWellBorePropMass) {
            axes.push(
              <AxisRight
                key="wbpm"
                left={innerWidth + rightOffset}
                scale={wellBorePropMassScale}
                tickFormat={(v) => Number(v).toFixed(0)}
                stroke={axisStroke}
                tickStroke={tickStroke}
                tickLabelProps={() => ({
                  fill: tickLabel,
                  fontSize: 11,
                  textAnchor: 'start',
                  dx: '0.25em',
                  dy: '0.25em',
                })}
              />,
            )
          }
          return axes
        })()}
      </Group>

      <rect
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={innerHeight}
        fill="transparent"
        onWheel={onWheel}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onHoverLeave}
        onPointerMoveCapture={onHoverMove}
        style={{
          touchAction: 'none',
          overscrollBehavior: 'contain',
        }}
        ref={overlayRef}
      />
    </svg>
  )
}

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

type Margin = {
  top: number
  right: number
  bottom: number
  left: number
}

type BreakdownsOverlay = {
  startIndex: number
  endIndex: number
  isTooSmall: boolean
  isLarge: boolean
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
  propCon: number[]
  bottomHolePropCon: number[]
  wellBorePropMass: number[]

  showTreatingPressure: boolean
  showBottomHolePressure: boolean
  showSlurryRate: boolean
  showPropCon: boolean
  showWellBorePropMass: boolean

  breakdowns: BreakdownsOverlay[]

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
    propCon,
    bottomHolePropCon,
    wellBorePropMass,
    showTreatingPressure,
    showBottomHolePressure,
    showSlurryRate,
    showPropCon,
    showWellBorePropMass,
    breakdowns,
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

  const overlayStroke = 'rgba(15, 23, 42, 0.25)'

  const treatingColor = '#ef4444'
  const bhColor = '#22c55e'
  const slurryColor = '#2563eb'
  const propConColor = '#94a3b8'
  const wellBorePropMassColor = '#a16207'

  const gridColor = 'rgba(148, 163, 184, 0.22)'
  const axisStroke = 'rgba(148, 163, 184, 0.55)'
  const tickStroke = 'rgba(148, 163, 184, 0.35)'
  const tickLabel = 'hsl(var(--muted-foreground))'

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

          {breakdowns.map((br) => {
            if (
              br.startIndex < 0 ||
              br.endIndex < 0 ||
              br.startIndex >= seconds.length ||
              br.endIndex >= seconds.length
            ) {
              return null
            }

            const x1 = xScale(seconds[br.startIndex] ?? 0) ?? 0
            const x2 = xScale(seconds[br.endIndex] ?? 0) ?? 0

            const fill = br.isTooSmall
              ? 'rgba(34,197,94,0.18)'
              : br.isLarge
                ? 'rgba(239,68,68,0.22)'
                : 'rgba(59,130,246,0.18)'

            return (
              <rect
                key={`${br.startIndex}-${br.endIndex}`}
                x={Math.min(x1, x2)}
                y={0}
                width={Math.max(1, Math.abs(x2 - x1))}
                height={innerHeight}
                fill={fill}
                stroke={overlayStroke}
                strokeWidth={0.5}
              />
            )
          })}

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

        <text
          x={innerWidth + 32}
          y={innerHeight / 1.9}
          transform={`rotate(-90, ${innerWidth + 32}, ${innerHeight / 2})`}
          fill={slurryColor}
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
        >
          Rate (bbl/min)
        </text>

        {showPropCon ? (
          <text
            x={innerWidth + 76}
            y={innerHeight / 1.8}
            transform={`rotate(-90, ${innerWidth + 76}, ${innerHeight / 2})`}
            fill={propConColor}
            fontSize={12}
            fontWeight={600}
            textAnchor="middle"
          >
            Prop. conc. (ppg)
          </text>
        ) : null}

        {showWellBorePropMass ? (
          <text
            x={innerWidth + 120}
            y={innerHeight / 1.7}
            transform={`rotate(-90, ${innerWidth + 120}, ${innerHeight / 2})`}
            fill={wellBorePropMassColor}
            fontSize={12}
            fontWeight={600}
            textAnchor="middle"
          >
            Wellbore prop. mass (lbs*10^3)
          </text>
        ) : null}

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
        <AxisRight
          left={innerWidth}
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
        />

        {showPropCon ? (
          <AxisRight
            left={innerWidth + 65}
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
          />
        ) : null}

        {showWellBorePropMass ? (
          <AxisRight
            left={innerWidth + 130}
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
          />
        ) : null}
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

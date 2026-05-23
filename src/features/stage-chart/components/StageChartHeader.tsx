type Props = {
  title?: string
}

export function StageChartHeader(props: Props) {
  return (
    <div className="border-border bg-card flex flex-col border-b px-4 py-2">
      <div className="truncate text-sm font-semibold">
        {props.title ?? 'Stage chart'}
      </div>
      <div className="text-muted-foreground truncate text-xs">
        multi-series vs seconds
      </div>
    </div>
  )
}

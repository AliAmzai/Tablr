interface StatusLegendProps {
  counts: {
    available: number
    occupied: number
    reserved: number
  }
}

export function StatusLegend({ counts }: StatusLegendProps) {
  const statuses = [
    { key: "available", label: "Available", color: "bg-green-500", count: counts.available },
    { key: "reserved", label: "Reserved", color: "bg-blue-500", count: counts.reserved },
    { key: "occupied", label: "Occupied", color: "bg-red-500", count: counts.occupied },
  ]
  
  return (
    <div className="flex flex-wrap items-center gap-4">
      {statuses.map((status) => (
        <div key={status.key} className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${status.color}`} />
          <span className="text-sm text-muted-foreground">
            {status.label}
          </span>
          <span className="text-sm font-medium">
            ({status.count})
          </span>
        </div>
      ))}
    </div>
  )
}

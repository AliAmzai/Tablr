"use client"

import React from "react"

import { useRef, useState, useCallback } from "react"
import { Users, Trash2 } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

export type TableStatus = "available" | "occupied" | "reserved"
export type TableShape = "round" | "square" | "rectangular"

export interface Table {
  id: string
  name: string
  shape: TableShape
  capacity: number
  status: TableStatus
  x: number
  y: number
  width: number
  height: number
  reservation?: {
    name: string
    time: string
    guests: number
  }
}

interface FloorPlanProps {
  tables: Table[]
  onTableClick: (table: Table) => void
  selectedTableId: string | null
  isEditMode: boolean
  onTableMove?: (tableId: string, x: number, y: number) => void
  onTableDelete?: (tableId: string) => void
}

export function FloorPlan({ 
  tables, 
  onTableClick, 
  selectedTableId, 
  isEditMode,
  onTableMove,
  onTableDelete
}: FloorPlanProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [draggedTable, setDraggedTable] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null)
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const handleDragStart = useCallback((tableId: string, e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditMode) return
    e.preventDefault()
    setDraggedTable(tableId)
    setDragPosition(null)
  }, [isEditMode])

  const handleDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!draggedTable || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    let clientX: number, clientY: number
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    
    const x = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.max(5, Math.min(95, ((clientY - rect.top) / rect.height) * 100))
    
    // Update local position immediately for smooth visual feedback
    setDragPosition({ x, y })
  }, [draggedTable])

  const handleDragEnd = useCallback(() => {
    if (draggedTable && dragPosition && onTableMove) {
      // Save to backend immediately on drag end
      onTableMove(draggedTable, dragPosition.x, dragPosition.y)
    }
    setDraggedTable(null)
    setDragPosition(null)
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current)
    }
  }, [draggedTable, dragPosition, onTableMove])

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full rounded-xl border overflow-hidden transition-colors ${
        isEditMode ? "border-indigo-500/50 border-dashed" : "border-border"
      } ${isDark ? 'bg-slate-900' : 'bg-white'}`}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchMove={handleDrag}
      onTouchEnd={handleDragEnd}
    >
      {/* Floor grid pattern */}
      <div 
        className={`absolute inset-0 transition-opacity ${
          isEditMode ? "opacity-10" : "opacity-[0.03]"
        }`}
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Edit mode indicator */}
      {isEditMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
          Edit Mode - Drag tables to reposition
        </div>
      )}
      
      {/* Restaurant areas labels */}
      <div className="absolute top-12 left-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Main Dining
      </div>
      <div className="absolute top-12 right-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Window Side
      </div>
      <div className="absolute bottom-4 left-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Bar Area
      </div>
      
      {/* Tables */}
      {tables.map((table) => (
        <TableElement
          key={table.id}
          table={table}
          dragPosition={draggedTable === table.id ? dragPosition : null}
          isSelected={selectedTableId === table.id}
          isEditMode={isEditMode}
          isDragging={draggedTable === table.id}
          onClick={() => onTableClick(table)}
          onDragStart={(e) => handleDragStart(table.id, e)}
          onDelete={() => onTableDelete?.(table.id)}
        />
      ))}
    </div>
  )
}

interface TableElementProps {
  table: Table
  dragPosition: { x: number; y: number } | null
  isSelected: boolean
  isEditMode: boolean
  isDragging: boolean
  onClick: () => void
  onDragStart: (e: React.MouseEvent | React.TouchEvent) => void
  onDelete: () => void
}

function TableElement({ 
  table,
  dragPosition, 
  isSelected, 
  isEditMode, 
  isDragging,
  onClick, 
  onDragStart,
  onDelete 
}: TableElementProps) {
  const statusStyles: Record<TableStatus, string> = {
    available: "bg-green-500 text-white hover:opacity-90",
    occupied: "bg-red-500 text-white hover:opacity-90",
    reserved: "bg-blue-500 text-white hover:opacity-90"
  }
  
  const shapeStyles: Record<TableShape, string> = {
    round: "rounded-full",
    square: "rounded-lg",
    rectangular: "rounded-lg"
  }
  
  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) return
    onClick()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }
  
  return (
    <div
      className={`absolute flex flex-col items-center justify-center transition-all shadow-sm select-none ${
        isSelected && !isEditMode ? "bg-white text-slate-900" : statusStyles[table.status]
      } ${
        shapeStyles[table.shape]
      } ${
        isSelected && !isEditMode ? "ring-2 ring-white ring-offset-2 ring-offset-card scale-110 font-bold" : ""
      } ${
        isEditMode ? "cursor-move" : ""
      } ${
        isDragging ? "opacity-80 scale-110 z-50" : ""
      } ${
        !isEditMode ? "cursor-pointer" : ""
      }`}
      style={{
        left: `${dragPosition ? dragPosition.x : table.x}%`,
        top: `${dragPosition ? dragPosition.y : table.y}%`,
        width: `${table.width}%`,
        height: `${table.height}%`,
        transform: 'translate(-50%, -50%)',
        transition: isDragging ? 'none' : 'all 0.2s ease-out'
      }}
      onClick={handleClick}
      onMouseDown={isEditMode ? onDragStart : undefined}
      onTouchStart={isEditMode ? onDragStart : undefined}
    >
      {/* Delete button in edit mode */}
      {isEditMode && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
      
      <span className="font-semibold text-sm">{table.name}</span>
      <span className="flex items-center gap-1 text-xs opacity-90">
        <Users className="w-3 h-3" />
        {table.capacity}
      </span>
    </div>
  )
}

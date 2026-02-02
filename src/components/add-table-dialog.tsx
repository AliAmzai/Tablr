"use client"

import React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import type { TableShape } from "./floor-plan"
import { Circle, Square, RectangleHorizontal } from "lucide-react"

interface AddTableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTable: (table: {
    name: string
    shape: TableShape
    capacity: number
  }) => void
}

export function AddTableDialog({ open, onOpenChange, onAddTable }: AddTableDialogProps) {
  const [name, setName] = useState("")
  const [shape, setShape] = useState<TableShape>("round")
  const [capacity, setCapacity] = useState("4")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    onAddTable({
      name: name.trim(),
      shape,
      capacity: parseInt(capacity, 10)
    })
    
    // Reset form
    setName("")
    setShape("round")
    setCapacity("4")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
          <DialogDescription>
            Create a new table for your floor plan. You can drag it to position after adding.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Table Name</Label>
            <Input
              id="name"
              placeholder="e.g., T14, VIP1, Patio1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label>Table Shape</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setShape("round")}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  shape === "round" 
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950" 
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <Circle className="w-6 h-6" />
                <span className="text-xs font-medium">Round</span>
              </button>
              <button
                type="button"
                onClick={() => setShape("square")}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  shape === "square" 
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950" 
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <Square className="w-6 h-6" />
                <span className="text-xs font-medium">Square</span>
              </button>
              <button
                type="button"
                onClick={() => setShape("rectangular")}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  shape === "rectangular" 
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950" 
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <RectangleHorizontal className="w-6 h-6" />
                <span className="text-xs font-medium">Rectangular</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity">Seating Capacity</Label>
            <Select value={capacity} onValueChange={setCapacity}>
              <SelectTrigger>
                <SelectValue placeholder="Select capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 seats</SelectItem>
                <SelectItem value="4">4 seats</SelectItem>
                <SelectItem value="6">6 seats</SelectItem>
                <SelectItem value="8">8 seats</SelectItem>
                <SelectItem value="10">10 seats</SelectItem>
                <SelectItem value="12">12 seats</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Add Table
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

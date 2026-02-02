"use client"

import { useState } from "react"
import type { Table, TableStatus } from "./floor-plan"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "./ui/select"
import { Users, Clock, User, X, Circle } from "lucide-react"

interface ReservationPanelProps {
  selectedTable: Table | null
  onUpdateStatus: (tableId: string, status: TableStatus, reservation?: Table["reservation"]) => void
  onClose: () => void
}

export function ReservationPanel({ selectedTable, onUpdateStatus, onClose }: ReservationPanelProps) {
  const [guestName, setGuestName] = useState("")
  const [guestCount, setGuestCount] = useState("2")
  const [reservationTime, setReservationTime] = useState("19:00")
  
  if (!selectedTable) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Circle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">Select a Table</h3>
        <p className="text-muted-foreground text-sm">
          Click on any table in the floor plan to view details or make a reservation
        </p>
      </div>
    )
  }
  
  const handleReserve = () => {
    if (guestName.trim()) {
      onUpdateStatus(selectedTable.id, "reserved", {
        name: guestName,
        time: reservationTime,
        guests: parseInt(guestCount)
      })
      setGuestName("")
    }
  }
  
  const handleSeat = () => {
    onUpdateStatus(selectedTable.id, "occupied", selectedTable.reservation)
  }
  
  const handleClear = () => {
    onUpdateStatus(selectedTable.id, "available", undefined)
  }
  
  const statusLabels: Record<TableStatus, { label: string; color: string }> = {
    available: { label: "Available", color: "bg-green-500" },
    occupied: { label: "Occupied", color: "bg-red-500" },
    reserved: { label: "Reserved", color: "bg-blue-500" }
  }
  
  const shapeLabels: Record<string, string> = {
    round: "Round Table",
    square: "Square Table",
    rectangular: "Rectangular Table"
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-lg">{selectedTable.name}</h3>
          <p className="text-sm text-muted-foreground">{shapeLabels[selectedTable.shape]}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Status & Details */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${statusLabels[selectedTable.status].color}`} />
          <span className="font-medium">{statusLabels[selectedTable.status].label}</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Capacity: {selectedTable.capacity}</span>
          </div>
        </div>
        
        {/* Current Reservation Info */}
        {selectedTable.reservation && (
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{selectedTable.reservation.name}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedTable.reservation.time}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {selectedTable.reservation.guests} guests
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex-1 p-4 border-t border-border">
        {selectedTable.status === "available" && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Make Reservation</h4>
            
            <div className="space-y-2">
              <Label htmlFor="guest-name">Guest Name</Label>
              <Input
                id="guest-name"
                placeholder="Enter guest name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="guest-count">Guests</Label>
                <Select value={guestCount} onValueChange={setGuestCount}>
                  <SelectTrigger id="guest-count">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: selectedTable.capacity }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "guest" : "guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select value={reservationTime} onValueChange={setReservationTime}>
                  <SelectTrigger id="time">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleReserve} disabled={!guestName.trim()}>
              Reserve Table
            </Button>
          </div>
        )}
        
        {selectedTable.status === "reserved" && (
          <div className="space-y-3">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleSeat}>
              Seat Guests
            </Button>
            <Button variant="outline" className="w-full" onClick={handleClear}>
              Cancel Reservation
            </Button>
          </div>
        )}
        
        {selectedTable.status === "occupied" && (
          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleClear}>
              Clear Table
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

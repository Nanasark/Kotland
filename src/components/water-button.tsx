"use client"

import { useState, useEffect } from "react"
import { Droplets, Loader2, Clock } from "lucide-react"

interface WaterButtonProps {
  isWaterable: boolean
  timeLeft?: number | null
  onWater: () => Promise<boolean>
}

export default function WaterButton({ isWaterable, timeLeft = null, onWater }: WaterButtonProps) {
  const [isWatering, setIsWatering] = useState(false)
  const [formattedTime, setFormattedTime] = useState<string>("")
  const [remainingTime, setRemainingTime] = useState<number | null>(timeLeft)

  // Update remainingTime when timeLeft prop changes
  useEffect(() => {
    setRemainingTime(timeLeft)
  }, [timeLeft])

  // Format and update the countdown timer
  useEffect(() => {
    if (remainingTime === null) {
      setFormattedTime("")
      return
    }

    // Format the time left into hours:minutes:seconds
    const formatTimeLeft = (seconds: number) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`
    }

    setFormattedTime(formatTimeLeft(remainingTime))

    // Set up countdown timer
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer)
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [remainingTime])

  const handleWater = async () => {
    if (!isWaterable || isWatering) return

    setIsWatering(true)
    try {
      const success = await onWater()
      if (success) {
        // Set a 24-hour countdown after successful watering
        setRemainingTime(24 * 60 * 60)
      }
    } finally {
      setIsWatering(false)
    }
  }

  return (
    <button
      onClick={handleWater}
      disabled={!isWaterable || isWatering}
      className={`relative p-2 rounded-lg flex flex-col items-center gap-1 transition-colors ${
        isWaterable
          ? "bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 text-blue-400"
          : "bg-[#2a2339] border border-gray-700 text-gray-500 cursor-not-allowed"
      }`}
    >
      {isWatering ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Droplets className={`h-4 w-4 ${isWaterable ? "text-blue-400" : "text-gray-500"}`} />
      )}
      <span className="text-xs">Water</span>

      {!isWaterable && remainingTime !== null && remainingTime > 0 && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-[#1a1528] px-2 py-1 rounded text-xs text-gray-300 whitespace-nowrap flex items-center gap-1 border border-gray-700 z-10">
          <Clock className="h-3 w-3 text-gray-400" />
          <span>{formattedTime}</span>
        </div>
      )}
    </button>
  )
}


"use client"

import { useState } from "react"
import { Scissors, Loader2, AlertCircle } from "lucide-react"

interface HarvestButtonProps {
  canHarvest: boolean
  growthStage: number
  onHarvest: () => Promise<boolean>
}

export default function HarvestButton({ canHarvest, growthStage, onHarvest }: HarvestButtonProps) {
  const [isHarvesting, setIsHarvesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if the crop is fully grown
  const isFullyGrown = growthStage === 100
  const isEligibleForHarvesting = canHarvest && isFullyGrown

  // Get the reason why harvesting is not possible
  const getErrorMessage = () => {
    if (!isFullyGrown) return "Crop not fully grown"
    return null
  }

  const handleHarvest = async () => {
    if (!isEligibleForHarvesting || isHarvesting) return

    setIsHarvesting(true)
    setError(null)

    try {
      const success = await onHarvest()
      if (!success) {
        setError("Failed to harvest crop")
      }
    } catch (err) {
      console.error("Error harvesting crop:", err)
      setError("Transaction failed")
    } finally {
      setIsHarvesting(false)
    }
  }

  return (
    <div className="relative w-full">
      <button
        onClick={handleHarvest}
        disabled={!isEligibleForHarvesting || isHarvesting}
        className={` w-full relative p-2 rounded-lg flex flex-col items-center gap-1 transition-colors ${
          isEligibleForHarvesting
            ? "bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 text-yellow-400"
            : "bg-[#2a2339] border border-gray-700 text-gray-500 cursor-not-allowed"
        }`}
        title={getErrorMessage() || "Harvest crop"}
      >
        {isHarvesting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Scissors className={`h-4 w-4 ${isEligibleForHarvesting ? "text-yellow-400" : "text-gray-500"}`} />
        )}
        <span className="text-xs">Harvest</span>
        {!isEligibleForHarvesting && !error && (
        <div className="left-1/2 transform  bg-[#1a1528] px-2 py-1 rounded text-xs text-gray-300 whitespace-nowrap flex items-center gap-1 border border-gray-700 z-10">
          <AlertCircle className="h-3 w-3 text-gray-400" />
          <span>{getErrorMessage()}</span>
        </div>
      )}

      </button>

      {/* Error message tooltip */}
      {error && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-red-500/20 border border-red-500 px-2 py-1 rounded text-xs text-red-200 whitespace-nowrap flex items-center gap-1 z-10">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}

     
      
    </div>
  )
}


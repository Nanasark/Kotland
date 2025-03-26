"use client"

import { useState } from "react"
import { Leaf, Loader2, AlertCircle } from "lucide-react"

interface FertilizeButtonProps {
  canFertilize: boolean
  fertilizerAmount: number
  onFertilize: () => Promise<boolean>
  tileHasCrop: boolean
  currentFertility: number
}

export default function FertilizeButton({
  canFertilize,
  fertilizerAmount,
  onFertilize,
  tileHasCrop,
  currentFertility,
}: FertilizeButtonProps) {
  const [isFertilizing, setIsFertilizing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check all requirements
  const hasSufficientFertilizer = fertilizerAmount >= 100
  const isNotMaxFertility = currentFertility < 100
  const isEligibleForFertilizing = canFertilize && hasSufficientFertilizer && tileHasCrop && isNotMaxFertility

  // Get the reason why fertilizing is not possible
  const getErrorMessage = () => {
    if (!tileHasCrop) return "No crop planted"
    if (!hasSufficientFertilizer) return "Need 100 fertz"
    if (!isNotMaxFertility) return "Max fert reached"
    return null
  }

  const handleFertilize = async () => {
    if (!isEligibleForFertilizing || isFertilizing) return

    setIsFertilizing(true)
    setError(null)

    try {
      const success = await onFertilize()
    //   if (!success) {
    //     setError("Failed to fertilize crop")
    //   }
    return success
    } catch (err) {
      console.error("Error fertilizing crop:", err)
      setError("Transaction failed")
    } finally {
      setIsFertilizing(false)
    }
  }

  return (
    <div className="relativev w-full">
      <button
        onClick={handleFertilize}
        disabled={!isEligibleForFertilizing || isFertilizing}
        className={`w-full relative p-2 rounded-lg flex flex-col items-center gap-1 transition-colors ${
          isEligibleForFertilizing
            ? "bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 text-green-400"
            : "bg-[#2a2339] border border-gray-700 text-gray-500 cursor-not-allowed"
        }`}
        title={getErrorMessage() || "Fertilize crop"}
      >
        {isFertilizing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Leaf className={`h-4 w-4 ${isEligibleForFertilizing ? "text-green-400" : "text-gray-500"}`} />
        )}
        <span className="text-xs">Fertilize</span>
        {!isEligibleForFertilizing && !error && (
        <div className=" transform bg-[#1a1528] px-2 py-1 rounded text-xs text-gray-300 whitespace-nowrap flex items-center gap-1 border border-gray-700 z-10 min-w-[90px] text-center">
          {/* <AlertCircle className="h-3 w-3 text-gray-400" /> */}
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

      {/* Requirement tooltip */}
    

      
    
    </div>
  )
}


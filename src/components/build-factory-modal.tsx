"use client"

import { useState } from "react"
import { X, AlertCircle, Loader2, Factory, Wrench } from "lucide-react"

interface BuildFactoryModalProps {
  isOpen: boolean
  onClose: () => void
  tileId: number
  fertility?: number
  waterLevel?: number
  sunlight?: number
  onBuildFactory: () => Promise<boolean>
}

export default function BuildFactoryModal({
  isOpen,
  onClose,
  tileId,
  fertility,
  waterLevel,
  sunlight,
  onBuildFactory,
}: BuildFactoryModalProps) {
  const [isBuilding, setIsBuilding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>("processing")

  if (!isOpen) return null

  const handleBuildFactory = async () => {
    setIsBuilding(true)
    setError(null)

    try {
      const success = await onBuildFactory()
      if (success) {
        onClose()
      }
    } catch (err) {
      setError("Failed to build factory. Please try again.")
      console.error("Building error:", err)
    } finally {
      setIsBuilding(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md p-6 bg-[#2a2339] rounded-lg shadow-xl animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-white">Build Factory on Tile #{tileId + 1}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="bg-[#1a1528] p-4 rounded-lg mb-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-300">Factory Type</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedType("processing")}
                className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  selectedType === "processing"
                    ? "bg-[#4cd6e3]/20 border border-[#4cd6e3]"
                    : "bg-[#2a2339] border border-[#2a2339] hover:border-[#4cd6e3]/30"
                }`}
              >
                <Factory className={`h-5 w-5 ${selectedType === "processing" ? "text-[#4cd6e3]" : "text-gray-400"}`} />
                <span className="text-xs">Processing</span>
              </button>
              <button
                onClick={() => setSelectedType("manufacturing")}
                className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  selectedType === "manufacturing"
                    ? "bg-[#4cd6e3]/20 border border-[#4cd6e3]"
                    : "bg-[#2a2339] border border-[#2a2339] hover:border-[#4cd6e3]/30"
                }`}
              >
                <Wrench
                  className={`h-5 w-5 ${selectedType === "manufacturing" ? "text-[#4cd6e3]" : "text-gray-400"}`}
                />
                <span className="text-xs">Manufacturing</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Construction Cost:</span>
              <span className="text-[#4cd6e3] font-medium">500 $SEED</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Build Time:</span>
              <span className="text-[#4cd6e3] font-medium">2 Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Production Capacity:</span>
              <span className="text-[#4cd6e3] font-medium">100 units/day</span>
            </div>
          </div>

          <h3 className="text-sm font-medium mt-4 mb-2 text-gray-300">Tile Properties</h3>

          {fertility !== undefined && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Fertility:</span>
              <div className="flex items-center gap-1">
                <div className="w-24 h-1.5 bg-[#2a2339] rounded-full overflow-hidden">
                  <div className="h-full bg-green-400" style={{ width: `${fertility}%` }}></div>
                </div>
                <span className="text-xs text-green-400">{fertility}%</span>
              </div>
            </div>
          )}

          {waterLevel !== undefined && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Water Access:</span>
              <div className="flex items-center gap-1">
                <div className="w-24 h-1.5 bg-[#2a2339] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400" style={{ width: `${waterLevel}%` }}></div>
                </div>
                <span className="text-xs text-blue-400">{waterLevel}%</span>
              </div>
            </div>
          )}

          {sunlight !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Sunlight:</span>
              <div className="flex items-center gap-1">
                <div className="w-24 h-1.5 bg-[#2a2339] rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${sunlight}%` }}></div>
                </div>
                <span className="text-xs text-yellow-400">{sunlight}%</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleBuildFactory}
          disabled={isBuilding}
          className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black"
        >
          {isBuilding ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Building...
            </>
          ) : (
            <>
              <Factory className="h-4 w-4" />
              Build Factory
            </>
          )}
        </button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Factories allow you to process crops into higher-value products.
        </p>
      </div>
    </div>
  )
}


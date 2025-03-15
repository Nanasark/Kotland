"use client"

import { useState } from "react"
import { X, AlertCircle, Loader2, Sun, Sprout, Box, Droplets } from "lucide-react"

interface PlantCropModalProps {
  isOpen: boolean
  onClose: () => void
  tileId: number
  fertility?: number
  waterLevel?: number
  sunlight?: number
  onPlantCrop: (cropType: number) => Promise<boolean>
}

export default function PlantCropModal({
  isOpen,
  onClose,
  tileId,
  fertility,
  waterLevel,
  sunlight,
  onPlantCrop,
}: PlantCropModalProps) {
  const [isPlanting, setIsPlanting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCrop, setSelectedCrop] = useState<string>("")

    if (!isOpen) return null
    
    const convertedCropType = selectedCrop === "wheat" ? 1 : selectedCrop === "corn" ? 2 : selectedCrop === "potato"? 3: selectedCrop === "carrot"? 4: 0

  const handlePlantCrop = async () => {
    setIsPlanting(true)
    setError(null)

    try {
      const success = await onPlantCrop(convertedCropType)
      if (success) {
        onClose()
      }
    } catch (err) {
      setError("Failed to plant crop. Please try again.")
      console.error("Planting error:", err)
    } finally {
      setIsPlanting(false)
    }
  }

  const cropDetails = {
    wheat: {
      name: "Wheat",
      icon: Sun,
      color: "text-yellow-400",
      growthTime: "10 days",
      waterNeeds: "Medium",
      sunlightNeeds: "High",
      yield: "150 units",
    },
    corn: {
      name: "Corn",
      icon: Sprout,
      color: "text-green-400",
      growthTime: "12 days",
      waterNeeds: "High",
      sunlightNeeds: "High",
      yield: "180 units",
    },
    potato: {
      name: "Potato",
      icon: Box,
      color: "text-brown-400",
      growthTime: "8 days",
      waterNeeds: "Medium",
      sunlightNeeds: "Medium",
      yield: "120 units",
    },
    carrot: {
      name: "Carrot",
      icon: Droplets,
      color: "text-orange-400",
      growthTime: "7 days",
      waterNeeds: "High",
      sunlightNeeds: "Low",
      yield: "100 units",
    },
  }

  const currentCrop = cropDetails[selectedCrop as keyof typeof cropDetails] || {
  name: "Select a Crop",
  icon: Box, // Default icon
  color: "text-gray-400",
  growthTime: "N/A",
  waterNeeds: "N/A",
  sunlightNeeds: "N/A",
  yield: "N/A",
};
  const CropIcon = currentCrop.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md p-6 bg-[#2a2339] rounded-lg shadow-xl animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-white">Plant Crops on Tile #{tileId + 1}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="bg-[#1a1528] p-4 rounded-lg mb-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-300">Select Crop</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(cropDetails).map(([id, crop]) => (
                <button
                  key={id}
                  onClick={() => setSelectedCrop(id)}
                  className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    selectedCrop === id
                      ? "bg-[#4cd6e3]/20 border border-[#4cd6e3]"
                      : "bg-[#2a2339] border border-[#2a2339] hover:border-[#4cd6e3]/30"
                  }`}
                >
                  <crop.icon className={`h-5 w-5 ${selectedCrop === id ? crop.color : "text-gray-400"}`} />
                  <span className="text-xs">{crop.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Growth Time:</span>
              <span className="text-[#4cd6e3] font-medium">{currentCrop.growthTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Water Needs:</span>
              <span className="text-[#4cd6e3] font-medium">{currentCrop.waterNeeds}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Sunlight Needs:</span>
              <span className="text-[#4cd6e3] font-medium">{currentCrop.sunlightNeeds}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Expected Yield:</span>
              <span className="text-[#4cd6e3] font-medium">{currentCrop.yield}</span>
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
          onClick={handlePlantCrop}
          disabled={isPlanting}
          className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black"
        >
          {isPlanting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Planting...
            </>
          ) : (
            <>
              <CropIcon className="h-4 w-4" />
              Plant {currentCrop.name}
            </>
          )}
        </button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Different crops have different growth times and resource requirements.
        </p>
      </div>
    </div>
  )
}


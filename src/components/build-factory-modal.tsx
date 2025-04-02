"use client"

import { useState } from "react"
import { X, AlertCircle, Loader2, Utensils, Zap, Cookie, Coffee, Fuel } from "lucide-react"

interface BuildFactoryModalProps {
  isOpen: boolean
  onClose: () => void
  tileId: number
  fertility?: number
  waterLevel?: number
  sunlight?: number
  onBuildFactory: (factoryType: number) => Promise<boolean>
}

export default function BuildFactoryModal({
  isOpen,
  onClose,
  tileId,
  // fertility,
  // waterLevel,
  // sunlight,
  onBuildFactory,
}: BuildFactoryModalProps) {
  const [isBuilding, setIsBuilding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>("FoodFactory")

  if (!isOpen) return null
  const convertedFactoryType = selectedType === "FoodFactory" ? 1 : selectedType=== "EnergyFactory" ? 2 : selectedType === "Bakery"? 3: selectedType === "JuiceFactory" ? 4: selectedType === "BioFuelFactory"? 5:0
  const factoryDetails = {
    FoodFactory: {
      name: "Food Factory",
      icon: Utensils,
      description: "Converts crops into food",
      input: "50 Wheat OR 50 Corn OR 50 Potato OR 50 Carrot",
      output: "15 Food",
      color: "text-green-400",
    },
    EnergyFactory: {
      name: "Energy Factory",
      icon: Zap,
      description: "Converts food and goods into energy",
      input: "20 Food + 10 Factory Goods",
      output: "10 Energy",
      color: "text-blue-400",
    },
    Bakery: {
      name: "Bakery",
      icon: Cookie,
      description: "Bakes wheat and food into goods",
      input: "20 Wheat + 10 Food",
      output: "20 Factory Goods",
      color: "text-yellow-400",
    },
    JuiceFactory: {
      name: "Juice Factory",
      icon: Coffee,
      description: "Processes corn and carrot into goods",
      input: "20 Corn + 10 Carrot",
      output: "20 Factory Goods",
      color: "text-orange-400",
    },
    BioFuelFactory: {
      name: "BioFuel Factory",
      icon: Fuel,
      description: "Converts goods and potato into energy and fertilizer",
      input: "20 Factory Goods + 30 Potato",
      output: "5 Energy + 40 Fertilizer",
      color: "text-purple-400",
    },
  }

  const handleBuildFactory = async () => {
    setIsBuilding(true)
    setError(null)

    try {
      const success = await onBuildFactory(convertedFactoryType)
      if (success) {
        onClose()
      }
      onClose()
      
    } catch (err) {
      setError("Failed to build factory. Please try again.")
      console.error("Building error:", err)
    } finally {
      setIsBuilding(false)
    }
  }

  const currentFactory = factoryDetails[selectedType as keyof typeof factoryDetails]
  const FactoryIcon = currentFactory.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-lg p-6 bg-[#2a2339] rounded-lg shadow-xl animate-fadeIn">
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
            <div className="grid grid-cols-2 gap-3 mb-3">
              {Object.entries(factoryDetails).map(([typeId, factory]) => (
                <button
                  key={typeId}
                  onClick={() => setSelectedType(typeId)}
                  className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    selectedType === typeId
                      ? "bg-[#4cd6e3]/20 border border-[#4cd6e3]"
                      : "bg-[#2a2339] border border-[#2a2339] hover:border-[#4cd6e3]/30"
                  }`}
                >
                  <factory.icon className={`h-5 w-5 ${selectedType === typeId ? factory.color : "text-gray-400"}`} />
                  <span className="text-xs">{factory.name}</span>
                </button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-[#2a2339] border border-[#4cd6e3]/30 mb-4">
              <h4 className="text-xs font-medium mb-1 text-gray-300">{currentFactory.name}</h4>
              <p className="text-xs text-gray-400 mb-2">{currentFactory.description}</p>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Input:</span>
                  <span className="text-xs text-[#4cd6e3]">{currentFactory.input}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Output:</span>
                  <span className="text-xs text-[#4cd6e3]">{currentFactory.output}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Construction Cost:</span>
              <span className="text-[#4cd6e3] font-medium">500 $SEED</span>
            </div>
          </div>

          {/* <h3 className="text-sm font-medium mt-4 mb-2 text-gray-300">Tile Properties</h3>

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
          )} */}
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
              <FactoryIcon className="h-4 w-4" />
              Build {currentFactory.name}
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


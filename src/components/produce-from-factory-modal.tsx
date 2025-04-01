"use client"

import { useState } from "react"
import { X, AlertCircle, Loader2, Zap, Utensils, Cookie, Coffee, Fuel } from "lucide-react"

interface ResourceRequirement {
  type: string
  amount: number
  required: boolean
  alternative?: boolean // Make alternative optional
}

interface ProduceFromFactoryModalProps {
  isOpen: boolean
  onClose: () => void
  tileId: number
  factoryType: string
  userInventory: { type: string; amount: number }[]
  onProduce: () => Promise<boolean>
}

export default function ProduceFromFactoryModal({
  isOpen,
  onClose,
  factoryType,
  userInventory,
  onProduce,
}: ProduceFromFactoryModalProps) {
  const [isProducing, setIsProducing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  console.log("Factory type received:", factoryType)

  if (!isOpen) return null

  const factoryDetails: Record<
    string,
    {
      name: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: any
      description: string
      requirements: ResourceRequirement[]
      output: { type: string; amount: number }[]
      color: string
    }
  > = {
    FoodFactory: {
      name: "Food Factory",
      icon: Utensils,
      description: "Converts crops into food",
      requirements: [
        { type: "Energy", amount: 10, required: true },
        { type: "Wheat", amount: 50, required: false, alternative: true },
        { type: "Corn", amount: 50, required: false, alternative: true },
        { type: "Potato", amount: 50, required: false, alternative: true },
        { type: "Carrot", amount: 50, required: false, alternative: true },
      ],
      output: [{ type: "Food", amount: 15 }],
      color: "text-green-400",
    },
    EnergyFactory: {
      name: "Energy Factory",
      icon: Zap,
      description: "Converts food and goods into energy",
      requirements: [
        { type: "Energy", amount: 10, required: true },
        { type: "Food", amount: 20, required: true },
        { type: "Factory Goods", amount: 10, required: true },
      ],
      output: [{ type: "Energy", amount: 10 }],
      color: "text-blue-400",
    },
    Bakery: {
      name: "Bakery",
      icon: Cookie,
      description: "Bakes wheat and food into goods",
      requirements: [
        { type: "Energy", amount: 10, required: true },
        { type: "Wheat", amount: 20, required: true },
        { type: "Food", amount: 10, required: true },
      ],
      output: [{ type: "Factory Goods", amount: 20 }],
      color: "text-yellow-400",
    },
    JuiceFactory: {
      name: "Juice Factory",
      icon: Coffee,
      description: "Processes corn and carrot into goods",
      requirements: [
        { type: "Energy", amount: 10, required: true },
        { type: "Corn", amount: 20, required: true },
        { type: "Carrot", amount: 10, required: true },
      ],
      output: [{ type: "Factory Goods", amount: 20 }],
      color: "text-orange-400",
    },
    BioFuelFactory: {
      name: "BioFuel Factory",
      icon: Fuel,
      description: "Converts goods and potato into energy and fertilizer",
      requirements: [
        { type: "Energy", amount: 10, required: true },
        { type: "Factory Goods", amount: 20, required: true },
        { type: "Potato", amount: 30, required: true },
      ],
      output: [
        { type: "Energy", amount: 5 },
        { type: "Fertilizer", amount: 40 },
      ],
      color: "text-purple-400",
    },
  }

  // Add a fallback for when factoryType doesn't match any key
  const currentFactory = factoryDetails[factoryType as keyof typeof factoryDetails] || {
    name: "Unknown Factory",
    icon: Zap,
    description: "Factory type not recognized",
    requirements: [],
    output: [],
    color: "text-gray-400",
  }
  const FactoryIcon = currentFactory.icon

  // Check if user has enough resources
  const checkRequirements = () => {
    // Check for required resources
    const requiredResources = currentFactory.requirements.filter((req) => req.required)
    for (const req of requiredResources) {
      const resource = userInventory.find((item) => item.type === req.type)
      if (!resource || resource.amount < req.amount) {
        return { canProduce: false, message: `Not enough ${req.type}. Need ${req.amount}.` }
      }
    }

    // For Food Factory, check if at least one alternative resource is available
    if (factoryType === "FoodFactory") {
      const alternativeResources = currentFactory.requirements.filter((req) => req.alternative === true)
      const hasAlternative = alternativeResources.some((req) => {
        const resource = userInventory.find((item) => item.type === req.type)
        return resource && resource.amount >= req.amount
      })

      if (!hasAlternative) {
        return {
          canProduce: false,
          message: "Need 50 of either Wheat, Corn, Potato, or Carrot.",
        }
      }
    }

    return { canProduce: true, message: "" }
  }

  const { canProduce, message } = checkRequirements()

  const handleProduce = async () => {
    if (!canProduce || isProducing) return

    setIsProducing(true)
    setError(null)

    try {
      const success = await onProduce()
      if (success) {
        onClose()
      }
      onClose()
    } catch (err) {
      setError("Failed to produce resources. Please try again.")
      console.error("Production error:", err)
    } finally {
      setIsProducing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-lg p-6 bg-[#2a2339] rounded-lg shadow-xl animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <FactoryIcon className={`h-6 w-6 ${currentFactory.color}`} />
          <h2 className="text-xl font-bold text-white">{currentFactory.name}</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {!canProduce && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">{message}</p>
          </div>
        )}

        <div className="bg-[#1a1528] p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-400 mb-4">{currentFactory.description}</p>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-300">Required Resources</h3>
              <div className="space-y-2">
                {currentFactory.requirements.map((req, index) => {
                  const userResource = userInventory.find((item) => item.type === req.type)
                  const hasEnough = userResource && userResource.amount >= req.amount

                  return (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{req.type}:</span>
                        {req.alternative && <span className="text-xs text-gray-400">(any one)</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${hasEnough ? "text-green-400" : "text-red-400"}`}>
                          {userResource?.amount || 0}/{req.amount}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-300">Output</h3>
              <div className="space-y-2">
                {currentFactory.output.map((output, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{output.type}:</span>
                    <span className="text-sm text-[#4cd6e3]">+{output.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleProduce}
          disabled={!canProduce || isProducing}
          className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            !canProduce
              ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
              : "bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black"
          }`}
        >
          {isProducing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Producing...
            </>
          ) : (
            <>
              <FactoryIcon className="h-4 w-4" />
              Produce Resources
            </>
          )}
        </button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Production is instant once you have all the required resources.
        </p>
      </div>
    </div>
  )
}


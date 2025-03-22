"use client"

import { useState } from "react"
import { X, AlertCircle, Loader2 } from 'lucide-react'
import { ResourceType, resourceTypeMap } from "../../utils/types/marketplace"

interface ListAssetModalProps {
  isOpen: boolean
  onClose: () => void
  onListAsset: (resourceType: number, amount: number, pricePerUnit: number) => Promise<boolean>
  userResources: { type: string; amount: number }[]
}

export default function ListAssetModal({
  isOpen,
  onClose,
  onListAsset,
  userResources,
}: ListAssetModalProps) {
  const [selectedResource, setSelectedResource] = useState<string>("")
  const [amount, setAmount] = useState<number>(1)
  const [pricePerUnit, setPricePerUnit] = useState<number>(10)
  const [isListing, setIsListing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleListAsset = async () => {
    if (!selectedResource) {
      setError("Please select a resource to list")
      return
    }

    if (amount <= 0) {
      setError("Amount must be greater than 0")
      return
    }

    if (pricePerUnit <= 0) {
      setError("Price per unit must be greater than 0")
      return
    }

    setIsListing(true)
    setError(null)

    try {
      const resourceTypeNumber = resourceTypeMap[selectedResource]
      const success = await onListAsset(resourceTypeNumber, amount, pricePerUnit)
      if (success) {
        onClose()
      }
    } catch (err) {
      setError("Failed to list asset. Please try again.")
      console.error("Listing error:", err)
    } finally {
      setIsListing(false)
    }
  }

  const maxAmount = userResources.find(r => r.type === selectedResource)?.amount || 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md p-6 bg-[#2a2339] rounded-lg shadow-xl animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-white">List Asset on Marketplace</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="bg-[#1a1528] p-4 rounded-lg mb-4 space-y-4">
          <div>
            <label htmlFor="resource-type" className="block text-sm font-medium text-gray-300 mb-1">
              Resource Type
            </label>
            <select
              id="resource-type"
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="w-full p-2 bg-[#2a2339] border border-[#4cd6e3]/30 rounded-lg text-white focus:outline-none focus:border-[#4cd6e3]"
            >
              <option value="">Select a resource</option>
              {userResources.map((resource) => (
                <option key={resource.type} value={resource.type} disabled={resource.amount <= 0}>
                  {resource.type} ({resource.amount} available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
              Amount to List
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1"
                max={maxAmount}
                className="w-full p-2 bg-[#2a2339] border border-[#4cd6e3]/30 rounded-lg text-white focus:outline-none focus:border-[#4cd6e3]"
              />
              {selectedResource && (
                <span className="ml-2 text-xs text-gray-400">Max: {maxAmount}</span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
              Price per Unit ($SEED)
            </label>
            <input
              type="number"
              id="price"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(Number(e.target.value))}
              min="1"
              className="w-full p-2 bg-[#2a2339] border border-[#4cd6e3]/30 rounded-lg text-white focus:outline-none focus:border-[#4cd6e3]"
            />
          </div>

          <div className="pt-2 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Listing Value:</span>
              <span className="text-[#4cd6e3] font-medium">{amount * pricePerUnit} $SEED</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleListAsset}
          disabled={isListing || !selectedResource || amount <= 0 || pricePerUnit <= 0}
          className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            isListing || !selectedResource || amount <= 0 || pricePerUnit <= 0
              ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
              : "bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black"
          }`}
        >
          {isListing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "List Asset"
          )}
        </button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Your asset will be listed on the marketplace for other players to purchase.
        </p>
      </div>
    </div>
  )
}

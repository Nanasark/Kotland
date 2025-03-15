"use client"

import { useState } from "react"
import { X, AlertCircle, Loader2 } from "lucide-react"

interface ListForSaleModalProps {
  isOpen: boolean
  onClose: () => void
  tileId: number
  fertility?: number
  waterLevel?: number
  sunlight?: number
  onListForSale: (price: number) => Promise<boolean>
}

export default function ListForSaleModal({
  isOpen,
  onClose,
  tileId,
  fertility,
  waterLevel,
  sunlight,
  onListForSale,
}: ListForSaleModalProps) {
  const [price, setPrice] = useState<number>(500)
  const [isListing, setIsListing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleListForSale = async () => {
    if (price <= 0) {
      setError("Please enter a valid price greater than 0")
      return
    }

    console.log("Modal price:", price);



    setIsListing(true)
    setError(null)

    try {
      const success = await onListForSale(price)
      
      if (success) {
        onClose()
      }

    } catch (err) {
      setError("Failed to list tile for sale. Please try again.")
      console.error("Listing error:", err)
    } finally {
      setIsListing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md p-6 bg-[#2a2339] rounded-lg shadow-xl animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-white">List Tile #{tileId + 1} For Sale</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="bg-[#1a1528] p-4 rounded-lg mb-4">
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
              Sale Price ($SEED)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="1"
              className="w-full p-2 bg-[#2a2339] border border-[#4cd6e3]/30 rounded-lg text-white focus:outline-none focus:border-[#4cd6e3]"
            />
          </div>

          <h3 className="text-sm font-medium mb-2 text-gray-300">Tile Properties</h3>

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
          onClick={handleListForSale}
          disabled={isListing}
          className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors bg-purple-500 hover:bg-purple-600 text-white"
        >
          {isListing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Listing...
            </>
          ) : (
            "List For Sale"
          )}
        </button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Your tile will be listed on the marketplace for other players to purchase.
        </p>
      </div>
    </div>
  )
}


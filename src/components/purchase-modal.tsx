"use client"

import { useState } from "react"
import { X, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  tileId: number
  price: number
  fertility?: number
  waterLevel?: number
  sunlight?: number
  onApprove: () => Promise<boolean>
  onPurchase: () => Promise<boolean>
}

export default function PurchaseModal({
  isOpen,
  onClose,
  tileId,
  price,
  fertility,
  waterLevel,
  sunlight,
  onApprove,
  onPurchase,
}: PurchaseModalProps) {
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleApprove = async () => {
    setIsApproving(true)
    setError(null)

    try {
      const success = await onApprove()
      setIsApproved(success)
    } catch (err) {
      setError("Failed to approve tokens. Please try again.")
      console.error("Approval error:", err)
    } finally {
      setIsApproving(false)
    }
  }

  const handlePurchase = async () => {
    setIsPurchasing(true)
    setError(null)

    try {
      const success = await onPurchase()
      if (success) {
         setTimeout(onClose, 300); 
      }
    } catch (err) {
      setError("Failed to purchase tile. Please try again.")
      console.error("Purchase error:", err)
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md p-6 bg-[#2a2339] rounded-lg shadow-xl animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-white">Purchase Tile #{tileId + 1}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="bg-[#1a1528] p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400">Price:</span>
            <span className="text-[#4cd6e3] font-medium">{price} $SEED</span>
          </div>

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

        <div className="space-y-3">
          <button
            onClick={handleApprove}
            disabled={isApproved || isApproving}
            className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              isApproved
                ? "bg-green-500/20 text-green-400 border border-green-500"
                : "bg-[#1a1528] hover:bg-[#4cd6e3]/10 text-[#4cd6e3] border border-[#4cd6e3]/30"
            }`}
          >
            {isApproving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : isApproved ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Tokens Approved
              </>
            ) : (
              "Approve Tokens"
            )}
          </button>

          <button
            onClick={handlePurchase}
            disabled={!isApproved || isPurchasing}
            className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              !isApproved
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black"
            }`}
          >
            {isPurchasing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Purchase"
            )}
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          This will require two transactions: one to approve token spending and another to complete the purchase.
        </p>
      </div>
    </div>
  )
}


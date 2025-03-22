"use client"

import { useState } from "react"
import { X, AlertCircle, Loader2, Plus, Minus, ShoppingCart, CheckCircle } from "lucide-react"
import Image from "next/image"
import { type MarketListing, getResourceImage } from "../../utils/types/marketplace"

interface BuyAssetModalProps {
  isOpen: boolean
  onClose: () => void
  listing: MarketListing | null
  onApproveTokens: (amount: number) => Promise<boolean>
  onBuyAsset: (listingId: number, amount: number) => Promise<boolean>
}

export default function BuyAssetModal({ isOpen, onClose, listing, onApproveTokens, onBuyAsset }: BuyAssetModalProps) {
  const [quantity, setQuantity] = useState<number>(1)
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !listing) return null

  const handleQuantityChange = (value: number) => {
    // Ensure quantity is between 1 and the available amount
    const newQuantity = Math.max(1, Math.min(value, listing.amount))
    setQuantity(newQuantity)
    // Reset approval when quantity changes
    setIsApproved(false)
  }

  const totalPrice = quantity * listing.pricePerUnit

  const handleApproveTokens = async () => {
    if (quantity <= 0 || quantity > listing.amount) {
      setError("Invalid quantity")
      return
    }

    setIsApproving(true)
    setError(null)

    try {
      const success = await onApproveTokens(totalPrice)
      setIsApproved(success)
    } catch (err) {
      setError("Failed to approve tokens. Please try again.")
      console.error("Approval error:", err)
    } finally {
      setIsApproving(false)
    }
  }

  const handleBuyAsset = async () => {
    if (!isApproved) {
      setError("Please approve tokens first")
      return
    }

    if (quantity <= 0 || quantity > listing.amount) {
      setError("Invalid quantity")
      return
    }

    setIsBuying(true)
    setError(null)

    try {
      const success = await onBuyAsset(listing.id, quantity)
      if (success) {
        onClose()
      }
    } catch (err) {
      setError("Failed to purchase asset. Please try again.")
      console.error("Purchase error:", err)
    } finally {
      setIsBuying(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md p-6 bg-[#2a2339] rounded-lg shadow-xl animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-white">Purchase {listing.resourceType}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="bg-[#1a1528] p-4 rounded-lg mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 relative flex-shrink-0 bg-[#2a2339] rounded-lg overflow-hidden">
              <Image
                src={getResourceImage(listing.resourceType) || "/placeholder.svg?height=80&width=80"}
                alt={listing.resourceType}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <h3 className="font-medium text-white">{listing.resourceType}</h3>
              <p className="text-sm text-gray-400">
                Seller: {listing.seller.substring(0, 6)}...{listing.seller.substring(listing.seller.length - 4)}
              </p>
              <p className="text-sm text-[#4cd6e3]">{listing.pricePerUnit} $SEED per unit</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity ({listing.amount} available)
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 bg-[#2a2339] border border-[#4cd6e3]/30 rounded-l-lg text-white disabled:text-gray-500"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) )}
                  min="1"
                  max={listing.amount}
                  className="w-full p-2 bg-[#2a2339] border-y border-[#4cd6e3]/30 text-center text-white focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= listing.amount}
                  className="p-2 bg-[#2a2339] border border-[#4cd6e3]/30 rounded-r-lg text-white disabled:text-gray-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Price per Unit:</span>
                <span className="text-[#4cd6e3] font-medium">{listing.pricePerUnit} $SEED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Quantity:</span>
                <span className="text-[#4cd6e3] font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-sm">Total Price:</span>
                <span className="text-[#4cd6e3] font-medium">{totalPrice} $SEED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleApproveTokens}
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
            onClick={handleBuyAsset}
            disabled={!isApproved || isBuying}
            className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              !isApproved
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black"
            }`}
          >
            {isBuying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Buy Now for {totalPrice} $SEED
              </>
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


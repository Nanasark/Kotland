"use client"

import { useState } from "react"
import Image from "next/image"
import { Clock, Heart, Info, ShoppingCart, X } from "lucide-react"
import { NFTItem } from "@/app/types/marketplace"
interface NFTCardProps {
  nft: NFTItem
}

export function NFTCard({ nft }: NFTCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 20))
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const toggleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setIsLiked(!isLiked)
  }

  // Format the listed time as "X days/hours ago"
  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInMs = now.getTime() - past.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  // Get the appropriate color for the rarity badge
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-orange-500/20 text-orange-400"
      case "epic":
        return "bg-purple-500/20 text-purple-400"
      case "rare":
        return "bg-blue-500/20 text-blue-400"
      case "uncommon":
        return "bg-green-500/20 text-green-400"
      case "common":
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <>
      <div className="bg-[#2a2339] border border-[#4cd6e3]/20 rounded-lg overflow-hidden group hover:border-[#4cd6e3] transition-all hover:shadow-[0_0_15px_rgba(76,214,227,0.2)]">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={nft.imageUrl || "/placeholder.svg"}
              alt={nft.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>

          <div className="absolute top-2 right-2 flex gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(nft.rarity)}`}>
              {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
            </span>
          </div>

          <button
            className={`absolute bottom-2 right-2 p-2 rounded-full ${
              isLiked ? "bg-pink-500/20 text-pink-500" : "bg-[#1a1528]/60 text-gray-400 hover:text-pink-500"
            }`}
            onClick={toggleLike}
          >
            <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-white">{nft.name}</h3>
          </div>

          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{nft.description}</p>

          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400 mb-1">Price</div>
              <div className="text-[#4cd6e3] font-bold">
                {nft.price} ${nft.currency}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">Seller</div>
              <div className="text-sm">{nft.seller}</div>
            </div>
          </div>

          <div className="flex items-center mt-3 text-xs text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>Listed {getTimeAgo(nft.listedAt)}</span>
            <span className="mx-2">•</span>
            <Heart className="h-3 w-3 mr-1" />
            <span>{likeCount}</span>
          </div>
        </div>

        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 border border-[#4cd6e3]/30 hover:bg-[#1a1528] hover:text-[#4cd6e3] py-2 rounded-lg transition-colors text-sm"
          >
            <Info className="h-4 w-4" />
            Details
          </button>

          <button className="flex-1 flex items-center justify-center gap-2 bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black py-2 rounded-lg transition-colors text-sm">
            <ShoppingCart className="h-4 w-4" />
            Buy
          </button>
        </div>
      </div>

      {/* NFT Details Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDialogOpen(false)}></div>
          <div className="relative z-10 bg-[#2a2339] border border-[#4cd6e3]/30 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{nft.name}</h2>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="p-1 rounded-full hover:bg-[#1a1528] text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image src={nft.imageUrl || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                </div>

                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-1">Price</div>
                    <div className="text-[#4cd6e3] text-2xl font-bold">
                      {nft.price} ${nft.currency}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-1">Seller</div>
                    <div className="text-white">{nft.seller}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-1">Listed</div>
                    <div className="text-white">{getTimeAgo(nft.listedAt)}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-2">Attributes</div>
                    <div className="grid grid-cols-2 gap-2">
                      {nft.attributes.map((attr, index) => (
                        <div key={index} className="bg-[#1a1528] p-2 rounded-lg">
                          <div className="text-xs text-gray-400">{attr.trait}</div>
                          <div className="text-[#4cd6e3]">{attr.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="border border-[#4cd6e3]/30 hover:bg-[#1a1528] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


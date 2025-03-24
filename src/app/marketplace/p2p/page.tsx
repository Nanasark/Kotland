"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingCart, Plus, Loader2, Search, ArrowUpDown, Tag } from "lucide-react"
import Header from "@/components/Header"
import ListAssetModal from "@/components/list-asset-modal"
import BuyAssetModal from "@/components/buy-asset-modal"
import { type MarketListing, getResourceImage } from "../../../../utils/types/marketplace"
import { readContract, toEther } from "thirdweb"
import { mainContract, SEEDTokenContract } from "@/app/contract"
import { useLandContract } from "../../../../utils/use-land-contract"
import { balanceOf } from "thirdweb/extensions/erc20"
import { GetUserAddress } from "../../../../utils/getUserAddress"

const resourceNames = [
  "None", // Will be skipped
  "Wheat",
  "Corn",
  "Potato",
  "Carrot",
  "Food",
  "Energy",
  "Factory Goods",
  "Fertilizer",
];


const fetchUserInventory = async (userAddress: string) => {
  try {
    console.log("Fetching user inventory...");

    const inventoryData: readonly bigint[] = await readContract({
      contract: mainContract,
      method: "getUserAllInventory",
      params: [userAddress],
    });

    console.log("Raw inventory data:", inventoryData);

    if (!inventoryData || inventoryData.length !== resourceNames.length) {
      console.error("Unexpected inventory data format:", inventoryData);
      return [];
    }

    // Map data, skipping "None" (index 0)
    return inventoryData.slice(1).map((amount, index) => ({
      type: resourceNames[index + 1], // Offset by 1 since we skipped "None"
      amount: Number(amount),
    }));
  } catch (error) {
    console.error("Error fetching user inventory:", error);
    return [];
  }
};


const fetchMarketListings = async () => {
  try {
    console.log("Fetching market listings...");

    const data = await readContract({
      contract: mainContract,
      method: "getAllMarketListings",
      params: [],
    });

    console.log("Raw data from contract:", data);

    if (!data || data.length !== 5) {
      console.error("Unexpected data format", data);
      return [];
    }

    const [listingIds, sellers, resourceTypes, amounts, pricePerUnits] = data;

    // Transform data into a structured array
    const listings = listingIds.map((id: bigint, index: number) => ({
      id: Number(id),
      seller: sellers[index],
      resourceType: getResourceTypeName(Number(resourceTypes[index])), // Convert enum to readable name
      amount: Number(amounts[index]),
      // pricePerUnit: Number(pricePerUnits[index]), // Convert BigInt to number
      pricePerUnit: Number(toEther(pricePerUnits[index])),
    }));

    console.log("Formatted listings:", listings);
    return listings;
  } catch (error) {
    console.error("Error fetching market listings:", error);
    return [];
  }
};


// Helper function to get resource type name
const getResourceTypeName = (resourceType: number): string => {
  const resourceNames = ["None", "Wheat", "Corn", "Potato", "Carrot", "Food", "Energy", "Factory Goods", "Fertilizer"]

  return resourceNames[resourceType] || "Unknown"
}

// Mock user resources for the list asset modal
// const mockUserResources = [
//   { type: "Wheat", amount: 200 },
//   { type: "Corn", amount: 150 },
//   { type: "Potato", amount: 100 },
//   { type: "Carrot", amount: 80 },
//   { type: "Food", amount: 50 },
//   { type: "Energy", amount: 30 },
//   { type: "Factory Goods", amount: 20 },
//   { type: "Fertilizer", amount: 10 },
// ]

export default function P2PMarketplacePage() {
      const { approveTokens, buyResource, listResource


      } = useLandContract()
  
  const [listings, setListings] = useState<MarketListing[]>([])
  const [filteredListings, setFilteredListings] = useState<MarketListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [inventory, setInventory] = useState<{ type: string; amount: number }[]>([]);
  const address = GetUserAddress()
  // Modal states
  const [isListAssetModalOpen, setIsListAssetModalOpen] = useState(false)
  const [isBuyAssetModalOpen, setIsBuyAssetModalOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null)

  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true)
      try {
        const data = await fetchMarketListings()
        setListings(data)
        setFilteredListings(data)
      } catch (error) {
        console.error("Failed to load listings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadListings()
  }, [])

  useEffect(() => {
    if (!address) return; // Prevent fetching if no userAddress

    // setInventoryLoading(true);
    fetchUserInventory(address)
      .then(setInventory)
      // .finally(() => setInventoryLoading(false));
  }, [address]);

  useEffect(() => {
    // Filter listings based on search term
    const filtered = listings.filter((listing) => listing.resourceType.toLowerCase().includes(searchTerm.toLowerCase()))

    // Sort listings
    const sorted = [...filtered].sort((a, b) => {
      const fieldA = a[sortField as keyof MarketListing]
      const fieldB = b[sortField as keyof MarketListing]

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
      }

      // For numeric fields
      return sortDirection === "asc" ? Number(fieldA) - Number(fieldB) : Number(fieldB) - Number(fieldA)
    })

    setFilteredListings(sorted)
  }, [listings, searchTerm, sortField, sortDirection])

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleOpenBuyModal = (listing: MarketListing) => {
    setSelectedListing(listing)
    setIsBuyAssetModalOpen(true)
  }

  // Mock functions for contract interactions
  const handleListAsset = async (resourceType: number, amount: number, pricePerUnit: number): Promise<boolean> => {
    console.log(`Listing asset: Type ${resourceType}, Amount ${amount}, Price ${pricePerUnit}`)
    // Simulate contract call delay
    
    const success = await listResource(resourceType,amount, pricePerUnit)
    await fetchMarketListings()
   
    return success
  }

  const handleBuyAsset = async (listingId: number, amount: number): Promise<boolean> => {
    console.log(`Buying asset: Listing ID ${listingId}, Amount ${amount}`)
    const success = await buyResource(listingId,amount)
    await fetchMarketListings()
    return success
     
  }

  const handleApproveTokens = async (amount: number): Promise<boolean> => {
    console.log(`Approving tokens: Amount ${amount}`)
  
     const balance = await balanceOf({
        contract: SEEDTokenContract,
        address: address
      })

          return await approveTokens(balance)
    // In a real app, this would call the token contract's approve method
    return true
  }

  return (
    <div className="min-h-screen bg-[#1a1528] text-white">
      <Header />

      {/* Modals */}
      <ListAssetModal
        isOpen={isListAssetModalOpen}
        onClose={() => setIsListAssetModalOpen(false)}
        onListAsset={handleListAsset}
        userResources={inventory}
      />

      <BuyAssetModal
        isOpen={isBuyAssetModalOpen}
        onClose={() => setIsBuyAssetModalOpen(false)}
        listing={selectedListing}
        onApproveTokens={handleApproveTokens}
        onBuyAsset={handleBuyAsset}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">P2P Marketplace</h1>
            <p className="text-gray-400">Buy and sell resources with other players</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2a2339] border border-[#4cd6e3]/30 rounded-lg text-white focus:outline-none focus:border-[#4cd6e3]"
              />
            </div>

            <button
              onClick={() => setIsListAssetModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              List Asset
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-[#4cd6e3] animate-spin mb-4" />
            <p className="text-gray-400">Loading marketplace listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-[#2a2339] rounded-lg p-8 text-center">
            <Tag className="h-12 w-12 text-[#4cd6e3] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">No listings found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? "No resources match your search criteria." : "The marketplace is empty right now."}
            </p>
            <button
              onClick={() => setIsListAssetModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Be the first to list an asset
            </button>
          </div>
        ) : (
          <div className="bg-[#2a2339] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1a1528]">
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center gap-1">
                        ID
                        {sortField === "id" && (
                          <ArrowUpDown className={`h-3 w-3 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("resourceType")}
                    >
                      <div className="flex items-center gap-1">
                        Resource
                        {sortField === "resourceType" && (
                          <ArrowUpDown className={`h-3 w-3 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center gap-1">
                        Amount
                        {sortField === "amount" && (
                          <ArrowUpDown className={`h-3 w-3 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("pricePerUnit")}
                    >
                      <div className="flex items-center gap-1">
                        Price Per Unit
                        {sortField === "pricePerUnit" && (
                          <ArrowUpDown className={`h-3 w-3 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1528]">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-[#1a1528]/50">
                      <td className="px-6 py-4 whitespace-nowrap">#{listing.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 relative flex-shrink-0 bg-[#2a2339] rounded-lg overflow-hidden">
                            <Image
                              src={getResourceImage(listing.resourceType) || "/placeholder.svg?height=80&width=80"}
                              alt={listing.resourceType}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <span>{listing.resourceType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{listing.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[#4cd6e3]">{listing.pricePerUnit} $SEED</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {listing.seller.substring(0, 6)}...{listing.seller.substring(listing.seller.length - 4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleOpenBuyModal(listing)}
                          className="inline-flex items-center gap-1 bg-[#4cd6e3]/10 hover:bg-[#4cd6e3]/20 text-[#4cd6e3] px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Buy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 bg-[#2a2339] rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3">Marketplace Information</h2>
          <div className="space-y-2 text-sm">
            <p className="text-gray-400">
              • The P2P marketplace allows players to trade resources directly with each other
            </p>
            <p className="text-gray-400">• All transactions are secured by smart contracts on the blockchain</p>
            <p className="text-gray-400">• A 2% marketplace fee is applied to all transactions</p>
            <p className="text-gray-400">• Listings expire after 7 days if not sold or canceled</p>
          </div>
        </div>
      </div>
    </div>
  )
}


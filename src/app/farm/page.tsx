"use client"

import { useEffect, useState } from "react"
import { Droplets, Sun, Box, LineChart, Leaf, Sprout, Tag, User, Factory, Building, Cloud } from "lucide-react"
import Header from "@/components/Header"
import { generateTiles } from "../../../utils/generateTiles"


import {  SEEDTokenContract } from "../contract"
import { GetUserAddress } from "../../../utils/getUserAddress"
import PurchaseModal from "@/components/purchase-modal"
import { useLandContract } from "../../../utils/use-land-contract"
import { balanceOf } from "thirdweb/extensions/erc20"
import ListForSaleModal from "@/components/list-for-sale-modal"
import Image from "next/image"
import PlantCropModal from "@/components/plant-crop-modal"
import BuildFactoryModal from "@/components/build-factory-modal"
import WaterButton from "@/components/water-button"

// Define tile types and data
type TileStatus = "available" | "owned" | "active" | "inactive" | "forSale"
type CropType = "wheat" | "corn" | "potato" | "carrot" | "none"
type BuildingType = "none" | "factory" | "greenhouse" | "warehouse"

interface Tile {
  id: number
  status: TileStatus
  cropType: CropType
  buildingType?: BuildingType
  growthStage?: number
  fertility?: number
  waterLevel?: number
  sunlight?: number
  purchasePrice?: number
  owner?: string
  forSalePrice?: number
}

interface UserStats {
  level: number
  experience: number
  balance: number
  ownedTiles: number
  activeCrops: number
  harvestReady: number
}


const userStats: UserStats = {
  level: 12,
  experience: 3450,
  balance: 2500,
  ownedTiles: 8,
  activeCrops: 6,
  harvestReady: 2,
}

const userNFTs = [
  {
    id: 1,
    name: "Premium Wheat Seeds",
    quantity: 15,
    rarity: "rare",
    icon: Sun,
  },
  {
    id: 2,
    name: "Exotic Corn Seeds",
    quantity: 8,
    rarity: "epic",
    icon: Sprout,
  },
  {
    id: 3,
    name: "Water Booster",
    quantity: 5,
    rarity: "uncommon",
    icon: Droplets,
  },
  {
    id: 4,
    name: "Growth Accelerator",
    quantity: 3,
    rarity: "legendary",
    icon: Leaf,
  },
]

export default function FarmPage() {
    const { approveTokens, purchaseTile, listTile, buildFactory , plantCrop, waterCrop, canWater, fetchWateringTimestamp} = useLandContract()

  const [tiles, setTiles] = useState<Tile[]>([])
 const [selectedTile, setSelectedTile] = useState<Tile | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileStatsOpen, setIsMobileStatsOpen] = useState(false)

  // Modal states
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [isListForSaleModalOpen, setIsListForSaleModalOpen] = useState(false)
  const [isBuildFactoryModalOpen, setIsBuildFactoryModalOpen] = useState(false)
  const [isPlantCropModalOpen, setIsPlantCropModalOpen] = useState(false)
  const [isWaterable,  setIswaterable] = useState(false)


  const fetchTiles = async () => {
  const generatedTiles = await generateTiles(8, 10, address); // Await the async function
  setTiles(generatedTiles); // Update state with the resolved value
  };


  const address = GetUserAddress()

  useEffect(() => {
  const fetchTiles = async () => {
    const generatedTiles = await generateTiles(8, 10, address); // Await the async function
    setTiles(generatedTiles); // Update state with the resolved value
  };

  fetchTiles();
  }, [address]);

  useEffect(() =>  {
    const fetchCanWater = async () => {
      const canWaters = await canWater(address);
      setIswaterable(canWaters)
    }
    
   fetchCanWater()
    }, [address]);
    
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!address) return;

    const updateCountdown = async () => {
      const wateredTimestamp = await fetchWateringTimestamp(address);
      const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds

      if (Number(wateredTimestamp) <= currentTimestamp) {
        setTimeLeft(null);
      } else {
        setTimeLeft(Number(wateredTimestamp) - currentTimestamp);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  });



  const handleApproveTokens = async (): Promise<boolean> => {
      const balance = await balanceOf({
        contract: SEEDTokenContract,
        address: address
      })
    // const tileprice =await readContract({
    //         contract:mainContract,
    //         method: "pricePerTile",
            
    //     });
    if (!selectedTile) return false
    return await approveTokens(balance)
  }

  const handleTileClick = (tile: Tile) => {
    setSelectedTile(tile)
    // On mobile, automatically open the stats panel when a tile is selected
    if (window.innerWidth < 768) {
      setIsMobileStatsOpen(true)
    }
  }

  // Update the handlePurchaseTile function to set the owner to the current user
  const handlePurchaseTile = () => {
   if (selectedTile) {
      setIsPurchaseModalOpen(true)
    }
  }

  const handleCompletePurchase = async (): Promise<boolean> => {
    if (!selectedTile) return false

    
     const success = await purchaseTile(selectedTile.id)
     await fetchTiles()
     if (success === true) {
       await fetchTiles()
     }
    return success
  }

  const handleListForSale = async (price: number): Promise<boolean> => {
      if (!selectedTile) return false

   
      console.log("Received in parent:", price);

      const success = await listTile(selectedTile.id, price)

      await fetchTiles()
      if (success === true) {
        await fetchTiles()
      }
      return success
  }
 

  // Update the handlePlantCrop function to change status to active
  // const handlePlantCrop = (tileId: number, cropType: CropType) => {



  //   setTiles(tiles.map((tile) => (tile.id === tileId ? { ...tile, status: "active", cropType, growthStage: 0 } : tile)))
  //   setSelectedTile((prev) => (prev ? { ...prev, status: "active", cropType, growthStage: 0 } : null))
  // }

  const handleBuildFactory = async (): Promise<boolean> => {
    if (!selectedTile) return false

    const success = await buildFactory(selectedTile.id)

    if (success) {
      // Update the UI after successful factory building
      setTiles(
        tiles.map((tile) =>
          tile.id === selectedTile.id ? { ...tile, buildingType: "factory", cropType: "none" } : tile,
        ),
      )
      setSelectedTile((prev) => (prev ? { ...prev, buildingType: "factory", cropType: "none" } : null))
    }

    return success
  }

  // Function to handle planting a crop
  const handlePlantCrop = async (cropType: number): Promise<boolean> => {
    if (!selectedTile) return false

    try {
     const success = await plantCrop(selectedTile.id, cropType)

      await fetchTiles()
      if (success === true) {
        await fetchTiles()
      }
      return success
    } catch (error) {
      console.error("Error planting crop:", error)
      return false
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1528] text-white">
      <Header />

      {/* Modals */}
      {selectedTile && (
        <>
          <PurchaseModal
            isOpen={isPurchaseModalOpen}
            onClose={() => setIsPurchaseModalOpen(false)}
            tileId={selectedTile.id}
            price={selectedTile.purchasePrice || 0}
            fertility={selectedTile.fertility}
            waterLevel={selectedTile.waterLevel}
            sunlight={selectedTile.sunlight}
            onApprove={handleApproveTokens}
            onPurchase={handleCompletePurchase}
          />

          <ListForSaleModal
            isOpen={isListForSaleModalOpen}
            onClose={() => setIsListForSaleModalOpen(false)}
            tileId={selectedTile.id}
            fertility={selectedTile.fertility}
            waterLevel={selectedTile.waterLevel}
            sunlight={selectedTile.sunlight}
            onListForSale={handleListForSale}
          />

          <BuildFactoryModal
            isOpen={isBuildFactoryModalOpen}
            onClose={() => setIsBuildFactoryModalOpen(false)}
            tileId={selectedTile.id}
            fertility={selectedTile.fertility}
            waterLevel={selectedTile.waterLevel}
            sunlight={selectedTile.sunlight}
            onBuildFactory={handleBuildFactory}
          />

          <PlantCropModal
            isOpen={isPlantCropModalOpen}
            onClose={() => setIsPlantCropModalOpen(false)}
            tileId={selectedTile.id}
            fertility={selectedTile.fertility}
            waterLevel={selectedTile.waterLevel}
            sunlight={selectedTile.sunlight}
            onPlantCrop={handlePlantCrop}
          />
        </>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4 bg-[#2a2339] p-3 rounded-lg">
            <h2 className="font-medium">My Farm</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMobileStatsOpen(!isMobileStatsOpen)}
                className={`p-2 rounded-lg ${isMobileStatsOpen ? "bg-[#4cd6e3] text-black" : "bg-[#1a1528]"}`}
              >
                <span className="sr-only">Toggle stats</span>
                <LineChart className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg ${isMobileMenuOpen ? "bg-[#4cd6e3] text-black" : "bg-[#1a1528]"}`}
              >
                <span className="sr-only">Toggle menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {isMobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 12h16M4 6h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
          {/* Left Sidebar - User Stats */}
          <div className={`${isMobileMenuOpen ? "block" : "hidden"} lg:block lg:col-span-2 space-y-4`}>
            <div className="bg-[#2a2339] rounded-lg p-4 space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#4cd6e3]/10 rounded-full flex items-center justify-center mb-2">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium">CryptoFarmer</h3>
                  <p className="text-xs text-[#4cd6e3]">Level {userStats.level}</p>
                </div>
              </div>

              {/* User Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Balance:</span>
                  <span className="text-[#4cd6e3] font-medium">${userStats.balance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Owned Tiles:</span>
                  <span className="text-[#4cd6e3] font-medium">{userStats.ownedTiles}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Crops:</span>
                  <span className="text-[#4cd6e3] font-medium">{userStats.activeCrops}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ready to Harvest:</span>
                  <span className="text-[#4cd6e3] font-medium">{userStats.harvestReady}</span>
                </div>
              </div>

              {/* Experience Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>Experience</span>
                  <span>{userStats.experience} / 5000</span>
                </div>
                <div className="w-full h-2 bg-[#1a1528] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4cd6e3] to-[#4cd6e3]/70"
                    style={{ width: `${(userStats.experience / 5000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* User NFTs */}
            <div className="bg-[#2a2339] rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">My NFTs</h3>
              <div className="space-y-3">
                {userNFTs.map((nft) => (
                  <div
                    key={nft.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#1a1528]/50 hover:bg-[#1a1528] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          nft.rarity === "legendary"
                            ? "bg-orange-500/20"
                            : nft.rarity === "epic"
                              ? "bg-purple-500/20"
                              : nft.rarity === "rare"
                                ? "bg-blue-500/20"
                                : "bg-gray-500/20"
                        }`}
                      >
                        <nft.icon
                          className={`h-3.5 w-3.5 ${
                            nft.rarity === "legendary"
                              ? "text-orange-500"
                              : nft.rarity === "epic"
                                ? "text-purple-500"
                                : nft.rarity === "rare"
                                  ? "text-blue-500"
                                  : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-medium">{nft.name}</div>
                        <div className="text-[10px] text-gray-400">x{nft.quantity}</div>
                      </div>
                    </div>
                    <div className="text-[10px] capitalize text-gray-400">{nft.rarity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="bg-[#2a2339] rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Weather Forecast</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-[#4cd6e3]" />
                    <span className="text-xs">Sunny</span>
                  </div>
                  <div className="text-xs text-[#4cd6e3]">+15% Growth</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-[#4cd6e3]" />
                    <span className="text-xs">Rain Tomorrow</span>
                  </div>
                  <div className="text-xs text-[#4cd6e3]">+10% Water</div>
                </div>
              </div>
            </div>
          </div>


          {/* Main Content - Farm Grid */}
          <div className="lg:col-span-7">
            <div className="bg-[#2a2339] rounded-lg overflow-hidden">
              {/* Farm Tiles header */}
              <div className="flex flex-row items-center justify-between p-4">
                <h3 className="font-medium">Farm Tiles</h3>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                    <span>Others&apos;</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                    <span>Inactive</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                    <span>Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-400 rounded-sm"></div>
                    <span>For Sale</span>
                  </div>
                </div>
              </div>

              {/* Farm Grid */}
              <div className="p-4">
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
                  {tiles.map((tile) => (
                    <button
                      key={tile.id}
                      onClick={() => handleTileClick(tile)}
                      className={`aspect-square rounded-md flex items-center justify-center relative transition-all ${
                        selectedTile?.id === tile.id ? "ring-2 ring-white scale-105" : ""
                      } ${
                        tile.status === "available"
                          ? "bg-green-400/20 border-2 border-green-400 hover:border-green-300"
                          : tile.status === "owned"
                            ? "bg-yellow-400/20 border-2 border-yellow-400"
                            : tile.status === "inactive"
                              ? "bg-gray-400/20 border-2 border-gray-400 hover:border-gray-300"
                              : tile.status === "active"
                                ? "bg-blue-400/20 border-2 border-blue-400 hover:border-blue-300"
                                : tile.status === "forSale"
                                  ? "bg-purple-400/20 border-2 border-purple-400 hover:border-purple-300"
                                  : "bg-[#4cd6e3]/10 border-2 border-[#4cd6e3]/30 hover:border-[#4cd6e3]"
                      }`}
                    >
                      {tile.status === "active" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sprout className="h-5 w-5 text-blue-400" />
                          <div className="absolute bottom-0.5 text-[8px] font-medium">{tile.growthStage}%</div>
                        </div>
                      )}
                      {tile.status === "inactive" && tile.buildingType === "factory" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Factory className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      {tile.status === "inactive" && !tile.buildingType && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-[10px] text-gray-400 font-medium">Empty</div>
                        </div>
                      )}
                      {tile.status === "forSale" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Tag className="h-5 w-5 text-purple-400" />
                        </div>
                      )}
                      {tile.status === "owned" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <User className="h-5 w-5 text-yellow-400" />
                        </div>
                      )}
                      <span className="absolute bottom-0.5 right-0.5 text-[8px] opacity-70">{tile.id + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Tile Details */}
          <div className={`${isMobileStatsOpen ? "block" : "hidden"} lg:block lg:col-span-3 space-y-4`}>
            {selectedTile ? (
              <div className="bg-[#2a2339] rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Tile #{selectedTile.id + 1}</h3>
                  {/* Mobile close button */}
                  <button
                    className="lg:hidden p-1 rounded-full bg-[#1a1528]"
                    onClick={() => setIsMobileStatsOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-4 bg-[#1a1528] rounded-lg">
                  <div className="text-center mb-3">
                    <div className="text-sm font-medium">Status</div>
                    <div
                      className={`text-xs capitalize ${
                        selectedTile.status === "available"
                          ? "text-green-400"
                          : selectedTile.status === "owned"
                            ? "text-yellow-400"
                            : selectedTile.status === "inactive"
                              ? "text-gray-400"
                              : selectedTile.status === "active"
                                ? "text-blue-400"
                                : selectedTile.status === "forSale"
                                  ? "text-purple-400"
                                  : "text-[#4cd6e3]"
                      }`}
                    >
                      {selectedTile.status}
                      {selectedTile.status === "active" &&
                        selectedTile.growthStage !== undefined &&
                        ` (${selectedTile.growthStage}%)`}
                    </div>
                    {selectedTile.owner && (
                      <div className="text-xs text-gray-400 mt-1">
                        Owner: {selectedTile.owner === "CryptoFarmer" ? "You" : selectedTile.owner}
                      </div>
                    )}
                  </div>

                  {selectedTile.status === "available" ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Purchase Price:</span>
                        <span className="text-[#4cd6e3] font-medium">{selectedTile.purchasePrice} $SEED</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Fertility:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                            <div className="h-full bg-green-400" style={{ width: `${selectedTile.fertility}%` }}></div>
                          </div>
                          <span className="text-xs text-green-400">{selectedTile.fertility}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Water Access:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400" style={{ width: `${selectedTile.waterLevel}%` }}></div>
                          </div>
                          <span className="text-xs text-blue-400">{selectedTile.waterLevel}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Sunlight:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400" style={{ width: `${selectedTile.sunlight}%` }}></div>
                          </div>
                          <span className="text-xs text-yellow-400">{selectedTile.sunlight}%</span>
                        </div>
                      </div>

                      {/* Update the purchase button to open the modal */}
                      <button
                        onClick={handlePurchaseTile}
                        className="w-full mt-4 bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black py-2 rounded-lg font-medium transition-colors"
                      >
                        Purchase Tile
                      </button>
                    </div>
                  ) : selectedTile.status === "inactive" && selectedTile.owner === "CryptoFarmer" ? (
                    <div className="space-y-3">
                      <div className="text-center mb-2">
                        <div className="text-xs text-gray-400">This tile is empty. Plant crops or build a factory.</div>
                      </div>

                      {/* Show tile details */}
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Fertility:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-400"
                                style={{ width: `${selectedTile.fertility}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-green-400">{selectedTile.fertility}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Water Access:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-400"
                                style={{ width: `${selectedTile.waterLevel}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-blue-400">{selectedTile.waterLevel}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Sunlight:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${selectedTile.sunlight}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-yellow-400">{selectedTile.sunlight}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-700 pt-3 mb-3">
                        <h4 className="text-xs font-medium mb-2 text-center">Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setIsPlantCropModalOpen(true)}
                            className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors"
                          >
                            <Sprout className="h-4 w-4 mx-auto mb-1 text-green-400" />
                            Plant Crops
                          </button>
                          <button
                            onClick={() => setIsBuildFactoryModalOpen(true)}
                            className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors"
                          >
                            <Factory className="h-4 w-4 mx-auto mb-1 text-[#4cd6e3]" />
                            Build Factory
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <button
                          onClick={() => setIsListForSaleModalOpen(true)}
                          className="w-full bg-purple-400 hover:bg-purple-500 text-white py-2 rounded-lg font-medium transition-colors"
                        >
                          List For Sale
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {selectedTile.status === "inactive" &&
                  selectedTile.owner === "CryptoFarmer" &&
                  selectedTile.buildingType === "factory" ? (
                    <div className="space-y-3">
                      <div className="text-center mb-2">
                        <div className="text-sm font-medium">Factory</div>
                        <div className="text-xs text-[#4cd6e3]">Processing Facility</div>
                      </div>

                      {/* Show tile details */}
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Fertility:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-400"
                                style={{ width: `${selectedTile.fertility}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-green-400">{selectedTile.fertility}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Water Access:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-400"
                                style={{ width: `${selectedTile.waterLevel}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-blue-400">{selectedTile.waterLevel}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Sunlight:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${selectedTile.sunlight}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-yellow-400">{selectedTile.sunlight}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors">
                          <Building className="h-4 w-4 mx-auto mb-1 text-[#4cd6e3]" />
                          Upgrade
                        </button>
                        <button className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors">
                          <Box className="h-4 w-4 mx-auto mb-1 text-[#4cd6e3]" />
                          Process Crops
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {selectedTile.status === "active" && selectedTile.owner === "CryptoFarmer" ? (
                    <div className="space-y-3">
                      <div className="text-center mb-2">
                        <div className="text-sm font-medium capitalize">{selectedTile.cropType}</div>
                        <div className="text-xs text-gray-400">Growing</div>
                      </div>

                      {/* Show tile details */}
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Fertility:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-400"
                                style={{ width: `${selectedTile.fertility}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-green-400">{selectedTile.fertility}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Water Access:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-400"
                                style={{ width: `${selectedTile.waterLevel}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-blue-400">{selectedTile.waterLevel}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Sunlight:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${selectedTile.sunlight}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-yellow-400">{selectedTile.sunlight}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Growth:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-400"
                                style={{ width: `${selectedTile.growthStage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-blue-400">{selectedTile.growthStage}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Est. Harvest:</span>
                          <span className="text-xs text-[#4cd6e3]">
                            {Math.ceil((100 - (selectedTile.growthStage || 0)) / 10)} days
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Est. Yield:</span>
                          <span className="text-xs text-[#4cd6e3]">
                            {Math.floor(((selectedTile.fertility || 0) / 100) * 150)} units
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                      <WaterButton
                          isWaterable={isWaterable ?? false}
                          timeLeft={timeLeft?? null}
                          onWater={() => waterCrop(selectedTile.id)}
                        />
                        <button className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors">
                          <Leaf className="h-4 w-4 mx-auto mb-1 text-green-400" />
                          Fertilize
                        </button>
                      </div>
                    </div>
                  ) : selectedTile.status === "owned" ? (
                    <div className="space-y-3">
                      <div className="text-center mb-2">
                        <div className="text-sm font-medium">Owned by {selectedTile.owner}</div>
                        {selectedTile.cropType && selectedTile.cropType !== "none" && (
                          <div className="text-xs text-yellow-400 capitalize">Growing {selectedTile.cropType}</div>
                        )}
                      </div>

                      <div className="text-center text-xs text-gray-400 mt-4">
                        This tile belongs to another player and cannot be modified.
                      </div>
                    </div>
                  ) : selectedTile.status === "forSale" ? (
                    <div className="space-y-3">
                      <div className="text-center mb-2">
                        <div className="text-sm font-medium">For Sale</div>
                        <div className="text-xs text-purple-400">Listed by {selectedTile.owner}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs">Asking Price:</span>
                        <span className="text-purple-400 font-medium">${selectedTile.forSalePrice}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs">Fertility:</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
                            <div className="h-full bg-green-400" style={{ width: `${selectedTile.fertility}%` }}></div>
                          </div>
                          <span className="text-xs text-green-400">{selectedTile.fertility}%</span>
                        </div>
                      </div>

                      <button 
                      onClick={handlePurchaseTile}
                            className="w-full mt-4 bg-purple-400 hover:bg-purple-500 text-white py-2 rounded-lg font-medium transition-colors">
                        Buy From Owner
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-sm">Select a tile to view details</div>
                    </div>
                  )}

                  {/* Tile History */}
                  {selectedTile.status !== "available" && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Tile History</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4cd6e3]"></div>
                          <div className="text-gray-400">Purchased on 03/05/2025</div>
                        </div>
                        {selectedTile.status === "active" ||
                        (selectedTile.status === "owned" &&
                          selectedTile.cropType &&
                          selectedTile.cropType !== "none") ? (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#4cd6e3]"></div>
                            <div className="text-gray-400">Planted {selectedTile.cropType} on 03/06/2025</div>
                          </div>
                        ) : null}
                        {selectedTile.buildingType === "factory" && (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#4cd6e3]"></div>
                            <div className="text-gray-400">Built factory on 03/07/2025</div>
                          </div>
                        )}
                        {selectedTile.status === "forSale" && (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#4cd6e3]"></div>
                            <div className="text-gray-400">Listed for sale on 03/07/2025</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#2a2339] rounded-lg p-6 text-center">
                <div className="text-gray-400 mb-2">Select a tile to view details</div>
                <div className="text-xs">
                  Click on any tile in the farm grid to see information and available actions
                </div>
              </div>
            )}

            {/* Market Prices */}
            <div className="bg-[#2a2339] rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Market Prices</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span className="text-xs">Wheat</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#4cd6e3]">$45</span>
                    <span className="text-green-400 ml-1">+5%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-xs">Corn</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#4cd6e3]">$38</span>
                    <span className="text-red-400 ml-1">-2%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brown-400"></div>
                    <span className="text-xs">Potato</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#4cd6e3]">$30</span>
                    <span className="text-green-400 ml-1">+8%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="text-xs">Carrot</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#4cd6e3]">$42</span>
                    <span className="text-green-400 ml-1">+3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



//   return (
//     <div className="min-h-screen bg-[#1a1528] text-white">
//       <Header />

//       {selectedTile && (
//         <PurchaseModal
//           isOpen={isPurchaseModalOpen}
//           onClose={() => setIsPurchaseModalOpen(false)}
//           tileId={selectedTile.id}
//           price={selectedTile.purchasePrice || 0}
//           fertility={selectedTile.fertility}
//           waterLevel={selectedTile.waterLevel}
//           sunlight={selectedTile.sunlight}
//           onApprove={handleApproveTokens}
//           onPurchase={handleCompletePurchase}
//         />
//       )}

      
//       {selectedTile && (
//         <ListForSaleModal
//           isOpen={isListForSaleModalOpen}
//           onClose={() => setIsListForSaleModalOpen(false)}
//           tileId={selectedTile.id}
//           fertility={selectedTile.fertility}
//           waterLevel={selectedTile.waterLevel}
//           sunlight={selectedTile.sunlight}
//           onListForSale={handleListForSale}
//         />
//       )}

//       <div className="container mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           {/* Mobile Navigation Toggle */}
//           <div className="lg:hidden flex justify-between items-center mb-4 bg-[#2a2339] p-3 rounded-lg">
//             <h2 className="font-medium">My Farm</h2>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setIsMobileStatsOpen(!isMobileStatsOpen)}
//                 className={`p-2 rounded-lg ${isMobileStatsOpen ? "bg-[#4cd6e3] text-black" : "bg-[#1a1528]"}`}
//               >
//                 <span className="sr-only">Toggle stats</span>
//                 <LineChart className="h-5 w-5" />
//               </button>
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className={`p-2 rounded-lg ${isMobileMenuOpen ? "bg-[#4cd6e3] text-black" : "bg-[#1a1528]"}`}
//               >
//                 <span className="sr-only">Toggle menu</span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   {isMobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 12h16M4 6h16M4 18h16" />}
//                 </svg>
//               </button>
//             </div>
//           </div>

          // {/* Left Sidebar - User Stats */}
          // <div className={`${isMobileMenuOpen ? "block" : "hidden"} lg:block lg:col-span-2 space-y-4`}>
          //   <div className="bg-[#2a2339] rounded-lg p-4 space-y-6">
          //     <div className="flex flex-col items-center">
          //       <div className="w-16 h-16 bg-[#4cd6e3]/10 rounded-full flex items-center justify-center mb-2">
          //         <Image
          //           src="/placeholder.svg?height=100&width=100"
          //           alt="User Avatar"
          //           width={40}
          //           height={40}
          //           className="rounded-full"
          //         />
          //       </div>
          //       <div className="text-center">
          //         <h3 className="font-medium">CryptoFarmer</h3>
          //         <p className="text-xs text-[#4cd6e3]">Level {userStats.level}</p>
          //       </div>
          //     </div>

          //     {/* User Stats */}
          //     <div className="space-y-3">
          //       <div className="flex justify-between items-center">
          //         <span className="text-sm">Balance:</span>
          //         <span className="text-[#4cd6e3] font-medium">${userStats.balance}</span>
          //       </div>
          //       <div className="flex justify-between items-center">
          //         <span className="text-sm">Owned Tiles:</span>
          //         <span className="text-[#4cd6e3] font-medium">{userStats.ownedTiles}</span>
          //       </div>
          //       <div className="flex justify-between items-center">
          //         <span className="text-sm">Active Crops:</span>
          //         <span className="text-[#4cd6e3] font-medium">{userStats.activeCrops}</span>
          //       </div>
          //       <div className="flex justify-between items-center">
          //         <span className="text-sm">Ready to Harvest:</span>
          //         <span className="text-[#4cd6e3] font-medium">{userStats.harvestReady}</span>
          //       </div>
          //     </div>

          //     {/* Experience Bar */}
          //     <div className="space-y-2">
          //       <div className="flex justify-between items-center text-xs">
          //         <span>Experience</span>
          //         <span>{userStats.experience} / 5000</span>
          //       </div>
          //       <div className="w-full h-2 bg-[#1a1528] rounded-full overflow-hidden">
          //         <div
          //           className="h-full bg-gradient-to-r from-[#4cd6e3] to-[#4cd6e3]/70"
          //           style={{ width: `${(userStats.experience / 5000) * 100}%` }}
          //         ></div>
          //       </div>
          //     </div>
          //   </div>

          //   {/* User NFTs */}
          //   <div className="bg-[#2a2339] rounded-lg p-4">
          //     <h3 className="text-sm font-medium mb-3">My NFTs</h3>
          //     <div className="space-y-3">
          //       {userNFTs.map((nft) => (
          //         <div
          //           key={nft.id}
          //           className="flex items-center justify-between p-2 rounded-lg bg-[#1a1528]/50 hover:bg-[#1a1528] transition-colors"
          //         >
          //           <div className="flex items-center gap-2">
          //             <div
          //               className={`p-1.5 rounded-lg ${
          //                 nft.rarity === "legendary"
          //                   ? "bg-orange-500/20"
          //                   : nft.rarity === "epic"
          //                     ? "bg-purple-500/20"
          //                     : nft.rarity === "rare"
          //                       ? "bg-blue-500/20"
          //                       : "bg-gray-500/20"
          //               }`}
          //             >
          //               <nft.icon
          //                 className={`h-3.5 w-3.5 ${
          //                   nft.rarity === "legendary"
          //                     ? "text-orange-500"
          //                     : nft.rarity === "epic"
          //                       ? "text-purple-500"
          //                       : nft.rarity === "rare"
          //                         ? "text-blue-500"
          //                         : "text-gray-500"
          //                 }`}
          //               />
          //             </div>
          //             <div>
          //               <div className="text-xs font-medium">{nft.name}</div>
          //               <div className="text-[10px] text-gray-400">x{nft.quantity}</div>
          //             </div>
          //           </div>
          //           <div className="text-[10px] capitalize text-gray-400">{nft.rarity}</div>
          //         </div>
          //       ))}
          //     </div>
          //   </div>

          //   {/* Weather Forecast */}
          //   <div className="bg-[#2a2339] rounded-lg p-4">
          //     <h3 className="text-sm font-medium mb-3">Weather Forecast</h3>
          //     <div className="space-y-3">
          //       <div className="flex items-center justify-between">
          //         <div className="flex items-center gap-2">
          //           <Sun className="h-4 w-4 text-[#4cd6e3]" />
          //           <span className="text-xs">Sunny</span>
          //         </div>
          //         <div className="text-xs text-[#4cd6e3]">+15% Growth</div>
          //       </div>
          //       <div className="flex items-center justify-between">
          //         <div className="flex items-center gap-2">
          //           <Cloud className="h-4 w-4 text-[#4cd6e3]" />
          //           <span className="text-xs">Rain Tomorrow</span>
          //         </div>
          //         <div className="text-xs text-[#4cd6e3]">+10% Water</div>
          //       </div>
          //     </div>
          //   </div>
          // </div>

//           {/* Main Content - Farm Grid */}
//           <div className="lg:col-span-7">
//             <div className="bg-[#2a2339] rounded-lg overflow-hidden">
//               {/* Farm Tiles header */}
//               <div className="flex flex-row items-center justify-between p-4">
//                 <h3 className="font-medium">Farm Tiles</h3>
//                 <div className="flex items-center gap-2 text-xs flex-wrap">
//                   <div className="flex items-center gap-1">
//                     <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
//                     <span>Available</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
//                     <span>Others&apos;</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
//                     <span>Inactive</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
//                     <span>Active</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <div className="w-3 h-3 bg-purple-400 rounded-sm"></div>
//                     <span>For Sale</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Farm Grid */}
//               <div className="p-4">
//                 <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
//                   {tiles.map((tile) => (
//                     <button
//                       key={tile.id}
//                       onClick={() => handleTileClick(tile)}
//                       className={`aspect-square rounded-md flex items-center justify-center relative transition-all ${
//                         selectedTile?.id === tile.id ? "ring-2 ring-white scale-105" : ""
//                       } ${
//                         tile.status === "available"
//                           ? "bg-green-400/20 border-2 border-green-400 hover:border-green-300"
//                           : tile.status === "owned"
//                             ? "bg-yellow-400/20 border-2 border-yellow-400"
//                             : tile.status === "inactive"
//                               ? "bg-gray-400/20 border-2 border-gray-400 hover:border-gray-300"
//                               : tile.status === "active"
//                                 ? "bg-blue-400/20 border-2 border-blue-400 hover:border-blue-300"
//                                 : tile.status === "forSale"
//                                   ? "bg-purple-400/20 border-2 border-purple-400 hover:border-purple-300"
//                                   : "bg-[#4cd6e3]/10 border-2 border-[#4cd6e3]/30 hover:border-[#4cd6e3]"
//                       }`}
//                     >
//                       {tile.status === "active" && (
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <Sprout className="h-5 w-5 text-blue-400" />
//                           <div className="absolute bottom-0.5 text-[8px] font-medium">{tile.growthStage}%</div>
//                         </div>
//                       )}
//                       {tile.status === "inactive" && (
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <div className="text-[10px] text-gray-400 font-medium">Empty</div>
//                         </div>
//                       )}
//                       {tile.status === "forSale" && (
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <Tag className="h-5 w-5 text-purple-400" />
//                         </div>
//                       )}
//                       {tile.status === "owned" && (
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <User className="h-5 w-5 text-yellow-400" />
//                         </div>
//                       )}
//                       <span className="absolute bottom-0.5 right-0.5 text-[8px] opacity-70">{tile.id + 1}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Sidebar - Tile Details */}
//           <div className={`${isMobileStatsOpen ? "block" : "hidden"} lg:block lg:col-span-3 space-y-4`}>
//             {selectedTile ? (
//               <div className="bg-[#2a2339] rounded-lg p-4 space-y-4">
//                 <div className="flex justify-between items-start">
//                   <h3 className="font-medium">Tile #{selectedTile.id + 1}</h3>
//                   {/* Mobile close button */}
//                   <button
//                     className="lg:hidden p-1 rounded-full bg-[#1a1528]"
//                     onClick={() => setIsMobileStatsOpen(false)}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M18 6L6 18M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>

//                 <div className="p-4 bg-[#1a1528] rounded-lg">
//                   <div className="text-center mb-3">
//                     <div className="text-sm font-medium">Status</div>
//                     <div
//                       className={`text-xs capitalize ${
//                         selectedTile.status === "available"
//                           ? "text-green-400"
//                           : selectedTile.status === "owned"
//                             ? "text-yellow-400"
//                             : selectedTile.status === "inactive"
//                               ? "text-gray-400"
//                               : selectedTile.status === "active"
//                                 ? "text-blue-400"
//                                 : selectedTile.status === "forSale"
//                                   ? "text-purple-400"
//                                   : "text-[#4cd6e3]"
//                       }`}
//                     >
//                       {selectedTile.status}
//                       {selectedTile.status === "active" &&
//                         selectedTile.growthStage !== undefined &&
//                         ` (${selectedTile.growthStage}%)`}
//                     </div>
//                     {selectedTile.owner && (
//                       <div className="text-xs text-gray-400 mt-1">
//                         Owner: {selectedTile.owner === "CryptoFarmer" ? "You" : selectedTile.owner}
//                       </div>
//                     )}
//                   </div>

//                   {selectedTile.status === "available" ? (
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs">Purchase Price:</span>
//                         <span className="text-[#4cd6e3] font-medium">${selectedTile.purchasePrice}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs">Fertility:</span>
//                         <div className="flex items-center gap-1">
//                           <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
//                             <div className="h-full bg-green-400" style={{ width: `${selectedTile.fertility}%` }}></div>
//                           </div>
//                           <span className="text-xs text-green-400">{selectedTile.fertility}%</span>
//                         </div>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs">Water Access:</span>
//                         <div className="flex items-center gap-1">
//                           <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
//                             <div className="h-full bg-blue-400" style={{ width: `${selectedTile.waterLevel}%` }}></div>
//                           </div>
//                           <span className="text-xs text-blue-400">{selectedTile.waterLevel}%</span>
//                         </div>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs">Sunlight:</span>
//                         <div className="flex items-center gap-1">
//                           <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
//                             <div className="h-full bg-yellow-400" style={{ width: `${selectedTile.sunlight}%` }}></div>
//                           </div>
//                           <span className="text-xs text-yellow-400">{selectedTile.sunlight}%</span>
//                         </div>
//                       </div>

//                       <button
//                        onClick={handlePurchaseTile}
//                         className="w-full mt-4 bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black py-2 rounded-lg font-medium transition-colors"
//                       >
//                         Purchase Tile
//                       </button>
//                     </div>
//                   ) : selectedTile.status === "inactive" && selectedTile.owner === "CryptoFarmer" ? (
//                     <div className="space-y-3">
//                       <div className="text-center mb-2">
//                         <div className="text-xs text-gray-400">This tile is empty. Plant a crop to start growing.</div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-2">
//                         <button
//                           onClick={() => handlePlantCrop(selectedTile.id, "wheat")}
//                           className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors"
//                         >
//                           <Sun className="h-4 w-4 mx-auto mb-1 text-yellow-400" />
//                           Wheat
//                         </button>
//                         <button
//                           onClick={() => handlePlantCrop(selectedTile.id, "corn")}
//                           className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors"
//                         >
//                           <Sprout className="h-4 w-4 mx-auto mb-1 text-green-400" />
//                           Corn
//                         </button>
//                         <button
//                           onClick={() => handlePlantCrop(selectedTile.id, "potato")}
//                           className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors"
//                         >
//                           <Box className="h-4 w-4 mx-auto mb-1 text-brown-400" />
//                           Potato
//                         </button>
//                         <button
//                           onClick={() => handlePlantCrop(selectedTile.id, "carrot")}
//                           className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors"
//                         >
//                           <Droplets className="h-4 w-4 mx-auto mb-1 text-orange-400" />
//                           Carrot
//                         </button>
//                       </div>

//                       <div className="mt-4 pt-4 border-t border-gray-700">
//                        <button
//                           onClick={() => setIsListForSaleModalOpen(true)}
//                           className="w-full bg-purple-400 hover:bg-purple-500 text-white py-2 rounded-lg font-medium transition-colors"
//                         >
//                           List For Sale
//                         </button>
//                       </div>
//                     </div>
//                   ) : selectedTile.status === "active" && selectedTile.owner === "CryptoFarmer" ? (
//                     <div className="space-y-3">
//                       <div className="text-center mb-2">
//                         <div className="text-sm font-medium capitalize">{selectedTile.cropType}</div>
//                         <div className="text-xs text-gray-400">Growing</div>
//                       </div>

//                       <div className="space-y-2">
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs">Growth:</span>
//                           <div className="flex items-center gap-1">
//                             <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
//                               <div
//                                 className="h-full bg-blue-400"
//                                 style={{ width: `${selectedTile.growthStage}%` }}
//                               ></div>
//                             </div>
//                             <span className="text-xs text-blue-400">{selectedTile.growthStage}%</span>
//                           </div>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs">Est. Harvest:</span>
//                           <span className="text-xs text-[#4cd6e3]">
//                             {Math.ceil((100 - (selectedTile.growthStage || 0)) / 10)} days
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs">Est. Yield:</span>
//                           <span className="text-xs text-[#4cd6e3]">
//                             {Math.floor(((selectedTile.fertility || 0) / 100) * 150)} units
//                           </span>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-2 mt-4">
//                         <button className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors">
//                           <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-400" />
//                           Water
//                         </button>
//                         <button className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors">
//                           <Leaf className="h-4 w-4 mx-auto mb-1 text-green-400" />
//                           Fertilize
//                         </button>
//                       </div>
//                     </div>
//                   ) : selectedTile.status === "owned" ? (
//                     <div className="space-y-3">
//                       <div className="text-center mb-2">
//                         <div className="text-sm font-medium">Owned by {selectedTile.owner}</div>
//                         {selectedTile.cropType && selectedTile.cropType !== "none" && (
//                           <div className="text-xs text-yellow-400 capitalize">Growing {selectedTile.cropType}</div>
//                         )}
//                       </div>

//                       <div className="text-center text-xs text-gray-400 mt-4">
//                         This tile belongs to another player and cannot be modified.
//                       </div>
//                     </div>
//                   ) : selectedTile.status === "forSale" ? (
//                     <div className="space-y-3">
//                       <div className="text-center mb-2">
//                         <div className="text-sm font-medium">For Sale</div>
//                         <div className="text-xs text-purple-400">Listed by {selectedTile.owner}</div>
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <span className="text-xs">Asking Price:</span>
//                         <span className="text-purple-400 font-medium">${selectedTile.forSalePrice}</span>
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <span className="text-xs">Fertility:</span>
//                         <div className="flex items-center gap-1">
//                           <div className="w-16 h-1.5 bg-[#1a1528] rounded-full overflow-hidden">
//                             <div className="h-full bg-green-400" style={{ width: `${selectedTile.fertility}%` }}></div>
//                           </div>
//                           <span className="text-xs text-green-400">{selectedTile.fertility}%</span>
//                         </div>
//                       </div>

//                       <button
//                       onClick={handlePurchaseTile}
//                                 className="w-full mt-4 bg-purple-400 hover:bg-purple-500 text-white py-2 rounded-lg font-medium transition-colors">
//                         Buy From Owner
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="text-center">
//                       <div className="text-sm">Select a tile to view details</div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Tile History */}
//                 {selectedTile.status !== "available" && (
//                   <div>
//                     <h4 className="text-sm font-medium mb-2">Tile History</h4>
//                     <div className="space-y-2 text-xs">
//                       <div className="flex items-center gap-2">
//                         <div className="w-1.5 h-1.5 rounded-full bg-[#4cd6e3]"></div>
//                         <div className="text-gray-400">Purchased on 03/05/2025</div>
//                       </div>
//                       {selectedTile.status === "active" ||
//                       (selectedTile.status === "owned" && selectedTile.cropType && selectedTile.cropType !== "none") ? (
//                         <div className="flex items-center gap-2">
//                           <div className="w-1.5 h-1.5 rounded-full bg-[#4cd6e3]"></div>
//                           <div className="text-gray-400">Planted {selectedTile.cropType} on 03/06/2025</div>
//                         </div>
//                       ) : null}
//                       {selectedTile.status === "forSale" && (
//                         <div className="flex items-center gap-2">
//                           <div className="w-1.5 h-1.5 rounded-full bg-[#4cd6e3]"></div>
//                           <div className="text-gray-400">Listed for sale on 03/07/2025</div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="bg-[#2a2339] rounded-lg p-6 text-center">
//                 <div className="text-gray-400 mb-2">Select a tile to view details</div>
//                 <div className="text-xs">
//                   Click on any tile in the farm grid to see information and available actions
//                 </div>
//               </div>
//             )}

//             {/* Market Prices */}
//             <div className="bg-[#2a2339] rounded-lg p-4">
//               <h3 className="text-sm font-medium mb-3">Market Prices</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
//                     <span className="text-xs">Wheat</span>
//                   </div>
//                   <div className="text-xs">
//                     <span className="text-[#4cd6e3]">$45</span>
//                     <span className="text-green-400 ml-1">+5%</span>
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-green-400"></div>
//                     <span className="text-xs">Corn</span>
//                   </div>
//                   <div className="text-xs">
//                     <span className="text-[#4cd6e3]">$38</span>
//                     <span className="text-red-400 ml-1">-2%</span>
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-brown-400"></div>
//                     <span className="text-xs">Potato</span>
//                   </div>
//                   <div className="text-xs">
//                     <span className="text-[#4cd6e3]">$30</span>
//                     <span className="text-green-400 ml-1">+8%</span>
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full bg-orange-400"></div>
//                     <span className="text-xs">Carrot</span>
//                   </div>
//                   <div className="text-xs">
//                     <span className="text-[#4cd6e3]">$42</span>
//                     <span className="text-green-400 ml-1">+3%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


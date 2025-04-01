"use client"

import { useEffect, useState } from "react"
import {  Sun,  LineChart, Sprout, Tag, User, Factory, Building, Cloud } from "lucide-react"
import Header from "@/components/Header"
import { generateTiles } from "../../../utils/generateTiles"
import {getUserDetails} from "../../../utils/getUserDetails"
import {  getResourceImage } from "../../../utils/types/marketplace"


import {  mainContract, SEEDTokenContract } from "../contract"
import { GetUserAddress } from "../../../utils/getUserAddress"
import PurchaseModal from "@/components/purchase-modal"
import { useLandContract } from "../../../utils/use-land-contract"
import { balanceOf } from "thirdweb/extensions/erc20"
import ListForSaleModal from "@/components/list-for-sale-modal"
import Image from "next/image"
import PlantCropModal from "@/components/plant-crop-modal"
import BuildFactoryModal from "@/components/build-factory-modal"
import WaterButton from "@/components/water-button"
import { readContract } from "thirdweb"
import FertilizeButton from "@/components/fertilize-button"
import HarvestButton from "@/components/harvest-button"
import ProduceFromFactoryModal from "@/components/produce-from-factory-modal"

// Define tile types and data
type TileStatus = "available" | "owned" | "active" | "inactive" | "forSale"
type CropType = "wheat" | "corn" | "potato" | "carrot" | "none"
type FactoryType = "FoodFactory" | "EnergyFactory" | "Bakery" | "JuiceFactory" | "BioFuelFactory" | "None"

interface Tile {
  id: number
  status: TileStatus
  cropType: CropType
  factoryType: FactoryType
  growthStage?: number
  fertility?: number
  waterLevel?: number
  sunlight?: number
  purchasePrice?: number
  isCrop: boolean
  owner?: string
  forSalePrice?: number
}

interface UserDetails{
  userAddress:string;
  totalTilesOwned:number;
  tilesUnderUse:number
  userExperience:number
  exists:boolean
  balance:number
  level:number
}

const defaultUserDetails: UserDetails = {
  userAddress: "",
  totalTilesOwned: 0,
  tilesUnderUse: 0,
  userExperience: 0,
  exists: false,
  balance: 0,
  level: 0,
};





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


// Add this helper function to get resource color by name instead of enum
const getResourceColorByName = (resourceType: string): string => {
  switch (resourceType) {
    case "Wheat":
      return "text-yellow-400 bg-yellow-400/20"
    case "Corn":
      return "text-green-400 bg-green-400/20"
    case "Potato":
      return "text-amber-700 bg-amber-700/20"
    case "Carrot":
      return "text-orange-400 bg-orange-400/20"
    case "Food":
      return "text-red-400 bg-red-400/20"
    case "Energy":
      return "text-blue-400 bg-blue-400/20"
    case "Factory Goods":
      return "text-purple-400 bg-purple-400/20"
    case "Fertilizer":
      return "text-emerald-400 bg-emerald-400/20"
    default:
      return "text-gray-400 bg-gray-400/20"
  }
}

export default function FarmPage() {
    const { approveTokens, purchaseTile, listTile, buildFactory , plantCrop, waterCrop, canWater, fetchWateringTimestamp,fertilizeCrop,harvestCrop, produceFromFactory} = useLandContract()

  const [tiles, setTiles] = useState<Tile[]>([])
 const [selectedTile, setSelectedTile] = useState<Tile | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileStatsOpen, setIsMobileStatsOpen] = useState(false)
    const [userInventory, setInventory] = useState<{ type: string; amount: number }[]>([]);
    const [userDetail, setUserDetail] = useState<UserDetails | null>(null);
  // Modal states
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [isListForSaleModalOpen, setIsListForSaleModalOpen] = useState(false)
  // const [isBuildFactoryModalOpen, setIsBuildFactoryModalOpen] = useState(false)
  const [isPlantCropModalOpen, setIsPlantCropModalOpen] = useState(false)
  const [modalStates, setModalStates] = useState({
    isPurchaseModalOpen: false,
    isListForSaleModalOpen: false,
    isBuildFactoryModalOpen: false,
    isPlantCropModalOpen: false,
    isProduceModalOpen: false,
  })

  // Helper function to open a specific modal
  const openModal = (modalName: keyof typeof modalStates) => {
    setModalStates({
      ...modalStates,
      [modalName]: true,
    })
  }

  const closeModal = (modalName: keyof typeof modalStates) => {
    setModalStates({
      ...modalStates,
      [modalName]: false,
    })
  }

  // Watering state
  const [isWaterable, setIsWaterable] = useState(false)
  const [nextWateringTime, setNextWateringTime] = useState<number | null>(null) 


  const fetchTiles = async () => {
  const generatedTiles = await generateTiles(8, 10, address); 
  setTiles(generatedTiles); 
  };


  const address = GetUserAddress()

    useEffect(() => {
      if (!address) return; 
  
      // setInventoryLoading(true);
      fetchUserInventory(address)
        .then(setInventory)
        // .finally(() => setInventoryLoading(false));
    }, [address]);

    useEffect(() => {
      if (!address) {
        console.warn("Skipping fetchUserDetail: address is missing");
        return;
      }
      const fetchUserDetail = async () => {
        try {
          const userData = await getUserDetails(address);
          setUserDetail(userData ?? defaultUserDetails); // Use default if null
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          setUserDetail(defaultUserDetails);
        }
    }     

      fetchUserDetail()
    }, [address])

  useEffect(() => {
  const fetchTiles = async () => {
    const generatedTiles = await generateTiles(8, 10, address); // Await the async function
    setTiles(generatedTiles); // Update state with the resolved value
  };

  fetchTiles();
  }, [address]);

  useEffect(() => {
    const fetchWateringStatus = async () => {
      console.log("Fetching watering status for tile:", selectedTile?.id)

      if (!selectedTile ) {
        // console.log("Tile not eligible for watering:", {
        //   tileId: selectedTile?.id,
        //   status: selectedTile?.status,
        //   owner: selectedTile?.owner,
        // })
        setIsWaterable(false)
        setNextWateringTime(null)
        return
      }

      try {
        // Check if the tile can be watered
        console.log("Checking if tile can be watered...")
        const canWaterTile = await canWater(selectedTile.id)
        console.log("Can water tile result:", canWaterTile)
        setIsWaterable(canWaterTile)

        // If it can't be watered, get the next watering time
        if (!canWaterTile) {
          console.log("Tile cannot be watered, getting next watering time...")
          const nextTime = await fetchWateringTimestamp(selectedTile.id)
          const currentTime = BigInt(Math.floor(Date.now() / 1000));
          const timeLeft = nextTime - currentTime
          console.log("Next watering time data:", { nextTime, currentTime, timeLeft })

          if (timeLeft > 0) {
            console.log("Setting next watering time:", timeLeft)
            setNextWateringTime(Number(timeLeft))
          } else {
            console.log("No time left or negative time, setting to null")
            setNextWateringTime(null)
          }
        } else {
          console.log("Tile can be watered, setting next watering time to null")
          setNextWateringTime(null)
        }
      } catch (error) {
        console.error("Error fetching watering status:", error)
        setIsWaterable(false)
        setNextWateringTime(null)
      }
    }

    fetchWateringStatus()
  }, [selectedTile, address])


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
    console.log(`Clicked on tile with ID: ${tile.id}, factoryType:`, tile.factoryType)

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

  const handleBuildFactory = async (factoryType: number): Promise<boolean> => {
    if (!selectedTile) return false

    try {
     const success = await buildFactory(selectedTile.id,factoryType)

      // await fetchTiles()
      if (success === true) {
        await fetchTiles()
      }
      return success
    } catch (error) {
      console.error("Error planting crop:", error)
      return false
    }
  }


  const handleProduceFromFactory = async (): Promise<boolean> => {
    if (!selectedTile) {
      console.warn("tile not available")
      return false
    } 

    try {
      const success = await produceFromFactory(selectedTile.id)
 
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


  const handleHarvestCrop = async (): Promise<boolean> => {
    if (!selectedTile) {
      console.log("Cannot harvest: no tile selected")
      return false
    }

    // Check if the crop is fully grown
    if ((selectedTile.growthStage || 0) < 100) {
      console.log("Cannot harvest: crop not fully grown")
      return false
    }

    try {
      console.log(`Harvesting crop on tile ${selectedTile.id}`)
      if (!selectedTile) return false

   
     

      const success = await harvestCrop(selectedTile.id)

      await fetchTiles()
      if (success === true) {
        await fetchTiles()
      }
      return success
     
    } catch (error) {
      console.error(`Error harvesting crop:`, error)
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
            isOpen={modalStates.isBuildFactoryModalOpen}
            onClose={() => closeModal("isBuildFactoryModalOpen")}
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

      {selectedTile.factoryType && !selectedTile.isCrop && selectedTile.factoryType !== "None" && (
            <ProduceFromFactoryModal
              isOpen={modalStates.isProduceModalOpen}
              onClose={() => closeModal("isProduceModalOpen")}
              tileId={selectedTile.id}
              factoryType={selectedTile.factoryType}
              userInventory={userInventory}
              onProduce={handleProduceFromFactory}
            />
          )}
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
                  <p className="text-xs text-[#4cd6e3]">Level {userDetail?.level}</p>
                </div>
              </div>

              {/* User Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Balance:</span>
                  <span className="text-[#4cd6e3] font-medium">${userDetail?.balance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Owned Tiles:</span>
                  <span className="text-[#4cd6e3] font-medium">{userDetail?.totalTilesOwned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Tiles:</span>
                  <span className="text-[#4cd6e3] font-medium">{userDetail?.tilesUnderUse}</span>
                </div>
                {/* <div className="flex justify-between items-center">
                  <span className="text-sm">Ready to Harvest:</span>
                  <span className="text-[#4cd6e3] font-medium">{userDetails.}</span>
                </div> */}
              </div>

              {/* Experience Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>Experience</span>
                  <span>{userDetail?.userExperience} / 5000</span>
                </div>
                <div className="w-full h-2 bg-[#1a1528] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4cd6e3] to-[#4cd6e3]/70"
                    style={{ width: `${((userDetail?.userExperience ?? 0) / 5000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

                        {/* User Inventory - Using marketplace.ts approach */}
                        <div className="bg-[#2a2339] rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Inventory</h3>
              <div className="space-y-3">
                {userInventory.map((item) => (
                  <div
                    key={item.type}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#1a1528]/50 hover:bg-[#1a1528] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 relative flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={getResourceImage(item.type) || "/placeholder.svg"}
                          alt={item.type}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-medium">{item.type}</div>
                        <div className={`text-[10px] ${getResourceColorByName(item.type).split(" ")[0]}`}>
                          {item.amount} units
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-[10px] ${getResourceColorByName(item.type)}`}>
                      {item.amount > 100 ? "High" : item.amount > 50 ? "Medium" : "Low"}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-700">
                <button className="w-full py-1.5 text-xs bg-[#1a1528] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-[#4cd6e3] transition-colors">
                  View All Resources
                </button>
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
                      {tile.status === "active" && tile.isCrop && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sprout className="h-5 w-5 text-blue-400" />
                          <div className="absolute bottom-0.5 text-[8px] font-medium">{tile.growthStage}%</div>
                        </div>
                      )}
                      {tile.status === "active" && !tile.isCrop && tile.factoryType !== "None" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Factory className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      {tile.status === "inactive" && !tile.factoryType && (
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
                            // onClick={() => setIsBuildFactoryModalOpen(true)}
                            onClick={() => openModal("isBuildFactoryModalOpen")}
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

                  {selectedTile.isCrop == false &&
                 
                    selectedTile.factoryType !== "None" &&
                    selectedTile.owner === "CryptoFarmer" ? (
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
                        <button 
                        onClick={() => openModal("isProduceModalOpen")}
                        className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors">
                          <Building className="h-4 w-4 mx-auto mb-1 text-[#4cd6e3]" />
                          Produce
                        </button>
                        {/* <button className="p-2 bg-[#2a2339] hover:bg-[#4cd6e3]/10 border border-[#4cd6e3]/30 rounded-lg text-center text-xs transition-colors">
                          <Box className="h-4 w-4 mx-auto mb-1 text-[#4cd6e3]" />
                          produce
                        </button> */}
                      </div>
                    </div>
                  ) : null}

                  {selectedTile.status === "active" && selectedTile.owner === "CryptoFarmer" && selectedTile.cropType && selectedTile.isCrop == true?  (
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
                      {(selectedTile?.growthStage || 0) >= 100? <div className="relative col-span-2 mt-2">
                            <HarvestButton
                              canHarvest={true} // This would come from your contract check
                              growthStage={selectedTile?.growthStage || 0}
                              onHarvest={handleHarvestCrop}
                            />
                          </div>:<>
                      <div className="relative">
                      <WaterButton
                          isWaterable={isWaterable}
                          timeLeft={nextWateringTime}
                          onWater={() => waterCrop(selectedTile.id)}
                        />
                        </div>
                        <div className="relative">
                          <FertilizeButton
                            canFertilize={true} 
                            fertilizerAmount={userInventory.find(item => item.type === "Fertilizer")?.amount || 0}
                            tileHasCrop={selectedTile?.status === "active"}
                            currentFertility={selectedTile?.fertility || 0}
                            onFertilize={()=>fertilizeCrop(selectedTile.id)}
                          />
                        </div></>
                        }
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
                        {/* {selectedTile.buildingType === "factory" && (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#4cd6e3]"></div>
                            <div className="text-gray-400">Built factory on 03/07/2025</div>
                          </div>
                        )} */}
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


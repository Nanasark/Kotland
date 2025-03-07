"use client"

import { useState } from "react"
import Image from "next/image"
import { Cloud, Droplets, Sun, Wind, Wallet, Box, Map, LineChart, MoreVertical } from "lucide-react"
import Header from "@/components/Header"
import Link from "next/link"

const marketData = [
  {
    name: "Week 1",
    value: 400,
  },
  {
    name: "Week 2",
    value: 300,
  },
  {
    name: "Week 3",
    value: 520,
  },
  {
    name: "Week 4",
    value: 380,
  },
  {
    name: "Week 5",
    value: 430,
  },
  {
    name: "Week 6",
    value: 650,
  },
  {
    name: "Week 7",
    value: 470,
  },
  {
    name: "Week 8",
    value: 710,
  },
]

const assetItems = [
  {
    id: 1,
    name: "Sun Seeds",
    quantity: 250,
    icon: Sun,
    rarity: "common",
  },
  {
    id: 2,
    name: "Moon Seeds",
    quantity: 100,
    icon: Cloud,
    rarity: "rare",
  },
  {
    id: 3,
    name: "Star Seeds",
    quantity: 75,
    icon: Droplets,
    rarity: "epic",
  },
  {
    id: 4,
    name: "Nova Seeds",
    quantity: 25,
    icon: Wind,
    rarity: "legendary",
  },
]

export default function MarketplacePage() {
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#1a1528] text-white">
      <Header />

      <div className="container mx-auto py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-2 space-y-4">
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
                  <p className="text-xs text-[#4cd6e3]">Premium Member</p>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/marketplace/p2p"
                  className="w-full flex items-center gap-3 p-2 rounded-lg bg-[#4cd6e3]/10 text-[#4cd6e3]"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm">P2P Market</span>
                </Link>
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#4cd6e3]/10 text-gray-400 hover:text-[#4cd6e3] transition-colors">
                  <Box className="h-4 w-4" />
                  <span className="text-sm">Inventory</span>
                </button>
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#4cd6e3]/10 text-gray-400 hover:text-[#4cd6e3] transition-colors">
                  <LineChart className="h-4 w-4" />
                  <span className="text-sm">Analytics</span>
                </button>
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#4cd6e3]/10 text-gray-400 hover:text-[#4cd6e3] transition-colors">
                  <Map className="h-4 w-4" />
                  <span className="text-sm">World Map</span>
                </button>
              </div>
            </div>

            <div className="bg-[#2a2339] rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Weather Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-[#4cd6e3]" />
                    <span className="text-xs">Sunlight</span>
                  </div>
                  <div className="text-xs text-[#4cd6e3]">+15%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-[#4cd6e3]" />
                    <span className="text-xs">Rainfall</span>
                  </div>
                  <div className="text-xs text-[#4cd6e3]">+8%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-[#4cd6e3]" />
                    <span className="text-xs">Wind</span>
                  </div>
                  <div className="text-xs text-red-400">-5%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-7 space-y-6">
            {/* Farm Visualization */}
            <div className="bg-[#2a2339] rounded-lg overflow-hidden">
              <div className="flex flex-row items-center justify-between p-4">
                <h3 className="font-medium">My Farm</h3>
                <button className="p-2 hover:bg-[#1a1528] rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4 text-[#4cd6e3]" />
                </button>
              </div>
              <div className="p-4">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/placeholder.svg?height=600&width=800&text=Isometric+Farm+View"
                    alt="Farm Visualization"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg"
                  />

                  {/* Plot Indicators */}
                  <div className="absolute top-1/4 left-1/4 bg-[#4cd6e3]/20 p-3 rounded-lg backdrop-blur-sm border border-[#4cd6e3]">
                    <div className="text-sm font-medium">Plot A</div>
                    <div className="text-xs text-[#4cd6e3]">Wheat • Growing</div>
                  </div>

                  <div className="absolute bottom-1/4 right-1/4 bg-[#4cd6e3]/20 p-3 rounded-lg backdrop-blur-sm border border-[#4cd6e3]">
                    <div className="text-sm font-medium">Plot B</div>
                    <div className="text-xs text-[#4cd6e3]">Corn • Ready</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Trends */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#2a2339] rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-2">Market Trends</h3>
                  <div className="bg-transparent">
                    <div>Price History</div>
                    <div className="h-32 flex items-center justify-center text-gray-400">Chart Placeholder</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2339] rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-2">Trading Volume</h3>
                  <div className="bg-transparent">
                    <div>24h Volume</div>
                    <div className="h-32 flex items-center justify-center text-gray-400">Chart Placeholder</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-6">
            <div className="bg-[#2a2339] rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-sm font-medium mb-3">My Assets</h3>
                <div className="space-y-3">
                  {assetItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedAsset(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedAsset === item.id
                          ? "bg-[#4cd6e3]/10 border border-[#4cd6e3]"
                          : "hover:bg-[#1a1528] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            item.rarity === "legendary"
                              ? "bg-orange-500/20"
                              : item.rarity === "epic"
                                ? "bg-purple-500/20"
                                : item.rarity === "rare"
                                  ? "bg-blue-500/20"
                                  : "bg-gray-500/20"
                          }`}
                        >
                          <item.icon
                            className={`h-4 w-4 ${
                              item.rarity === "legendary"
                                ? "text-orange-500"
                                : item.rarity === "epic"
                                  ? "text-purple-500"
                                  : item.rarity === "rare"
                                    ? "text-blue-500"
                                    : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium">{item.name}</div>
                          <div className="text-xs text-gray-400">Quantity: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-xs text-[#4cd6e3] capitalize">{item.rarity}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#2a2339] rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-sm font-medium mb-3">Global Activity</h3>
                <div className="relative w-full aspect-square">
                  <Image
                    src="/placeholder.svg?height=400&width=400&text=World+Map"
                    alt="World Map"
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />

                  {/* Activity Indicators */}
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#4cd6e3] rounded-full">
                    <div className="absolute inset-0 bg-[#4cd6e3] rounded-full animate-ping"></div>
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-[#4cd6e3] rounded-full">
                    <div className="absolute inset-0 bg-[#4cd6e3] rounded-full animate-ping"></div>
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


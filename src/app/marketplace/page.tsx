"use client"

import { useState } from "react"
import Image from "next/image"
import { Cloud, Droplets, Sun, Wind, Wallet, Box, Map, LineChart, MoreVertical } from 'lucide-react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#1a1528] text-white">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4 bg-[#2a2339] p-3 rounded-lg">
            <h2 className="font-medium">Marketplace</h2>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-[#1a1528] rounded-lg"
            >
              <span className="sr-only">Toggle menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4cd6e3]">
                {isMobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 12h16M4 6h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Sidebar - Hidden on mobile unless toggled */}
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block lg:col-span-2 space-y-4`}>
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
          <div className="lg:col-span-7 space-y-6">
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

                  {/* Plot Indicators - Hidden on very small screens */}
                  <div className="hidden sm:block absolute top-1/4 left-1/4 bg-[#4cd6e3]/20 p-2 sm:p-3 rounded-lg backdrop-blur-sm border border-[#4cd6e3]">
                    <div className="text-xs sm:text-sm font-medium">Plot A</div>
                    <div className="text-[10px] sm:text-xs text-[#4cd6e3]">Wheat • Growing</div>
                  </div>

                  <div className="hidden sm:block absolute bottom-1/4 right-1/4 bg-[#4cd6e3]/20 p-2 sm:p-3 rounded-lg backdrop-blur-sm border border-[#4cd6e3]">
                    <div className="text-xs sm:text-sm font-medium">Plot B</div>
                    <div className="text-[10px] sm:text-xs text-[#4cd6e3]">Corn • Ready</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#2a2339] rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-2">Market Trends</h3>
                  <div className="bg-transparent">
                    <div className="flex justify-between items-center">
                      <div>Price History</div>
                      <div className="text-xs text-[#4cd6e3]">
                        Max: ${Math.max(...marketData.map(d => d.value))}
                      </div>
                    </div>
                    
                    {/* Bar Chart */}
                    <div className="h-32 relative mt-4">
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 flex flex-col justify-between text-[8px] sm:text-[10px] text-gray-400 py-1">
                        <div>${Math.max(...marketData.map(d => d.value))}</div>
                        <div>${Math.max(...marketData.map(d => d.value)) / 2}</div>
                        <div>$0</div>
                      </div>
                      
                      {/* Chart area */}
                      <div className="absolute left-6 sm:left-8 right-0 top-0 bottom-0">
                        {/* Grid lines */}
                        <div className="absolute left-0 right-0 top-0 h-px bg-gray-700/30"></div>
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-700/30"></div>
                        <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-700/30"></div>
                        
                        {/* Bars */}
                        <div className="flex items-end justify-between h-full pt-4 pb-6 relative">
                          {marketData.map((item, index) => {
                            // Calculate height percentage based on max value
                            const maxValue = Math.max(...marketData.map(d => d.value));
                            const heightPercent = (item.value / maxValue) * 100;
                            
                            return (
                              <div key={index} className="flex flex-col items-center group relative">
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1a1528] text-[#4cd6e3] text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                  ${item.value}
                                </div>
                                <div 
                                  className="w-3 sm:w-5 bg-gradient-to-t from-[#4cd6e3]/80 to-[#4cd6e3] rounded-t transition-all group-hover:w-4 sm:group-hover:w-6 group-hover:bg-[#4cd6e3]"
                                  style={{ height: `${heightPercent}%` }}
                                ></div>
                                <span className="text-[8px] sm:text-[10px] text-gray-400 mt-1 absolute -bottom-5 transform -translate-x-1/2 left-1/2 whitespace-nowrap">
                                  {/* On small screens, just show the week number */}
                                  <span className="sm:hidden">{item.name.split(' ')[1]}</span>
                                  <span className="hidden sm:inline">{item.name}</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2339] rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-2">Trading Volume</h3>
                  <div className="bg-transparent">
                    <div className="flex justify-between items-center">
                      <div>24h Volume</div>
                      <div className="text-xs text-[#4cd6e3]">
                        Avg: ${Math.round(marketData.reduce((acc, item) => acc + item.value, 0) / marketData.length)}
                      </div>
                    </div>
                    
                    {/* Line Chart */}
                    <div className="h-32 relative mt-4">
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 flex flex-col justify-between text-[8px] sm:text-[10px] text-gray-400 py-1">
                        <div>${Math.max(...marketData.map(d => d.value))}</div>
                        <div>${Math.max(...marketData.map(d => d.value)) / 2}</div>
                        <div>$0</div>
                      </div>
                      
                      {/* Chart area */}
                      <div className="absolute left-6 sm:left-8 right-0 top-0 bottom-0">
                        {/* Grid lines */}
                        <div className="absolute left-0 right-0 top-0 h-px bg-gray-700/30"></div>
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-700/30"></div>
                        <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-700/30"></div>
                        
                        {/* Line chart */}
                        <svg className="w-full h-full" viewBox={`0 0 ${marketData.length - 1} 100`} preserveAspectRatio="none">
                          {/* Area under the line */}
                          <defs>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#4cd6e3" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#4cd6e3" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>
                          
                          <path 
                            d={`
                              M0,${100 - (marketData[0].value / Math.max(...marketData.map(d => d.value)) * 100)}
                              ${marketData.slice(1).map((item, i) => {
                                const x = i + 1;
                                const y = 100 - (item.value / Math.max(...marketData.map(d => d.value)) * 100);
                                return `L${x},${y}`;
                              }).join(' ')}
                              V100 H0 Z
                            `}
                            fill="url(#areaGradient)"
                          />
                          
                          {/* Line */}
                          <path 
                            d={`
                              M0,${100 - (marketData[0].value / Math.max(...marketData.map(d => d.value)) * 100)}
                              ${marketData.slice(1).map((item, i) => {
                                const x = i + 1;
                                const y = 100 - (item.value / Math.max(...marketData.map(d => d.value)) * 100);
                                return `L${x},${y}`;
                              }).join(' ')}
                            `}
                            stroke="#4cd6e3"
                            strokeWidth="1.5"
                            fill="none"
                          />
                          
                          {/* Data points */}
                          {marketData.map((item, i) => {
                            const x = i;
                            const y = 100 - (item.value / Math.max(...marketData.map(d => d.value)) * 100);
                            return (
                              <g key={i} className="group">
                                <circle 
                                  cx={x} 
                                  cy={y} 
                                  r="2" 
                                  fill="#4cd6e3" 
                                  className="group-hover:r-3 transition-all"
                                />
                                <circle 
                                  cx={x} 
                                  cy={y} 
                                  r="4" 
                                  fill="#4cd6e3" 
                                  fillOpacity="0.3"
                                  className="group-hover:r-6 transition-all"
                                />
                                
                                {/* Tooltip */}
                                <foreignObject x={x - 20} y={y - 30} width="40" height="25" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="bg-[#1a1528] text-[#4cd6e3] text-xs py-1 px-2 rounded text-center">
                                    ${item.value}
                                  </div>
                                </foreignObject>
                              </g>
                            );
                          })}
                        </svg>
                        
                        {/* X-axis labels */}
                        <div className="absolute left-0 right-0 bottom-0 flex justify-between">
                          {marketData.map((item, i) => (
                            <div key={i} className="text-[8px] sm:text-[10px] text-gray-400 transform -translate-x-1/2" style={{left: `${(i / (marketData.length - 1)) * 100}%`}}>
                              {item.name.split(' ')[1]}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
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
                    src="/globe.jpeg"
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

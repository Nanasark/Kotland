"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Filter, ArrowUpDown, ChevronLeft } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import { NFTCard } from "@/components/nft-card"
import type { NFTItem, NFTCategory } from "@/app/types/marketplace"

// Sample NFT data
const nftItems: NFTItem[] = [
  {
    id: "seed-001",
    name: "Premium Wheat Seeds",
    description: "High-yield wheat seeds with frost resistance. Perfect for winter farming.",
    price: 120,
    currency: "SEED",
    seller: "FarmKing",
    category: "seeds",
    rarity: "rare",
    imageUrl: "/wheat1.jpeg",
    attributes: [
      { trait: "Growth Rate", value: "+15%" },
      { trait: "Frost Resistance", value: "High" },
      { trait: "Yield", value: "A+" },
    ],
    listedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "seed-002",
    name: "Exotic Corn Seeds",
    description: "Rare corn variety with enhanced growth speed and higher market value.",
    price: 250,
    currency: "SEED",
    seller: "SeedMaster",
    category: "seeds",
    rarity: "epic",
    imageUrl: "/corn1.jpeg",
    attributes: [
      { trait: "Growth Rate", value: "+25%" },
      { trait: "Drought Resistance", value: "Medium" },
      { trait: "Yield", value: "A" },
    ],
    listedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "land-001",
    name: "Fertile Valley Plot",
    description: "Prime farming land with natural irrigation and rich soil. 10 acres.",
    price: 1500,
    currency: "SEED",
    seller: "LandBaron",
    category: "land",
    rarity: "rare",
    imageUrl: "/wheatfield.jpeg",
    attributes: [
      { trait: "Size", value: "10 acres" },
      { trait: "Fertility", value: "A+" },
      { trait: "Water Access", value: "Natural Spring" },
    ],
    listedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "land-002",
    name: "Riverside Property",
    description: "Strategic location with river access for efficient water management. 15 acres.",
    price: 2200,
    currency: "SEED",
    seller: "EcoFarms",
    category: "land",
    rarity: "epic",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Riverside+Property",
    attributes: [
      { trait: "Size", value: "15 acres" },
      { trait: "Fertility", value: "A" },
      { trait: "Water Access", value: "River" },
    ],
    listedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "crop-001",
    name: "Golden Wheat Harvest",
    description: "Ready-to-sell wheat harvest with premium quality rating.",
    price: 380,
    currency: "SEED",
    seller: "HarvestPro",
    category: "crops",
    rarity: "common",
    imageUrl: "/wheat4.jpeg",
    attributes: [
      { trait: "Quantity", value: "500 units" },
      { trait: "Quality", value: "Premium" },
      { trait: "Harvest Date", value: "Recent" },
    ],
    listedAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "crop-002",
    name: "Organic Tomatoes Harvest",
    description: "Certified organic tomatoes, freshly harvested and ready for market or processing.",
    price: 420,
    currency: "SEED",
    seller: "OrganicGrower",
    category: "crops",
    rarity: "rare",
    imageUrl: "/tomato4.jpeg",
    attributes: [
      { trait: "Quantity", value: "300 units" },
      { trait: "Quality", value: "Organic" },
      { trait: "Harvest Date", value: "Recent" },
    ],
    listedAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: "tool-001",
    name: "Advanced Irrigation System",
    description: "Smart irrigation system that optimizes water usage based on soil conditions.",
    price: 850,
    currency: "SEED",
    seller: "TechFarm",
    category: "tools",
    rarity: "epic",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Irrigation+System",
    attributes: [
      { trait: "Efficiency", value: "+30%" },
      { trait: "Coverage", value: "5 acres" },
      { trait: "Smart Features", value: "Yes" },
    ],
    listedAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: "tool-002",
    name: "Harvester Drone",
    description: "Autonomous drone that assists in harvesting crops with precision and speed.",
    price: 1200,
    currency: "SEED",
    seller: "DroneTech",
    category: "tools",
    rarity: "legendary",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Harvester+Drone",
    attributes: [
      { trait: "Speed", value: "+50%" },
      { trait: "Battery Life", value: "8 hours" },
      { trait: "AI Capabilities", value: "Advanced" },
    ],
    listedAt: new Date(Date.now() - 691200000).toISOString(),
  },
]

const categories: NFTCategory[] = [
  { id: "all", name: "All Items", icon: "🌐" },
  { id: "seeds", name: "Seeds", icon: "🌱" },
  { id: "land", name: "Land", icon: "🏞️" },
  { id: "crops", name: "Crops", icon: "🌽" },
  { id: "tools", name: "Tools", icon: "🔧" },
]

export default function P2PMarketplace() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortOption, setSortOption] = useState<string>("recent")

  // Filter NFTs based on category and search query
  const filteredNFTs = nftItems.filter((nft) => {
    const matchesCategory = activeCategory === "all" || nft.category === activeCategory
    const matchesSearch =
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Sort NFTs based on selected option
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "recent":
      default:
        return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-[#1a1528] text-white">
      <Header />

      <div className="container mx-auto py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-[#4cd6e3] hover:text-[#4cd6e3]/80 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Marketplace</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">P2P Marketplace</h1>
            <p className="text-gray-400">Buy and sell NFTs directly from other players</p>
          </div>
          <button className="mt-4 md:mt-0 bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black py-2 px-4 rounded-lg font-medium transition-colors">
            List Your NFT
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-[#2a2339] rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search NFTs..."
                className="w-full pl-10 py-2 px-3 bg-[#1a1528] border border-[#4cd6e3]/20 focus:border-[#4cd6e3] rounded-lg text-white outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="appearance-none bg-[#1a1528] border border-[#4cd6e3]/20 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-[#4cd6e3]"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="recent">Recently Listed</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <button className="flex items-center gap-2 border border-[#4cd6e3]/20 hover:bg-[#1a1528] hover:text-[#4cd6e3] px-3 py-2 rounded-lg transition-colors">
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="bg-[#2a2339] p-1 rounded-lg inline-flex">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeCategory === category.id ? "bg-[#4cd6e3] text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {sortedNFTs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            ) : (
              <div className="bg-[#2a2339] rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">No NFTs found matching your criteria</p>
                <button
                  className="border border-[#4cd6e3] text-[#4cd6e3] hover:bg-[#4cd6e3]/10 px-4 py-2 rounded-lg transition-colors"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("all")
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Featured Collections */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Collection Cards */}
            <div className="bg-[#2a2339] border border-[#4cd6e3]/20 rounded-lg overflow-hidden group">
              <div className="relative h-40">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Rare+Seeds+Collection"
                  alt="Rare Seeds Collection"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1528] to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Rare Seeds Collection</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-4">
                  Exclusive collection of rare and exotic seeds with unique properties
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-400">Floor: </span>
                    <span className="text-[#4cd6e3] font-medium">120 $SEED</span>
                  </div>
                  <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">8 items</span>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button className="w-full bg-[#1a1528] hover:bg-[#4cd6e3]/10 text-[#4cd6e3] border border-[#4cd6e3]/30 py-2 rounded-lg transition-colors">
                  View Collection
                </button>
              </div>
            </div>

            <div className="bg-[#2a2339] border border-[#4cd6e3]/20 rounded-lg overflow-hidden group">
              <div className="relative h-40">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Premium+Land+Plots"
                  alt="Premium Land Plots"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1528] to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Premium Land Plots</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-4">
                  High-value land with special bonuses and strategic locations
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-400">Floor: </span>
                    <span className="text-[#4cd6e3] font-medium">1,500 $SEED</span>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">5 items</span>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button className="w-full bg-[#1a1528] hover:bg-[#4cd6e3]/10 text-[#4cd6e3] border border-[#4cd6e3]/30 py-2 rounded-lg transition-colors">
                  View Collection
                </button>
              </div>
            </div>

            <div className="bg-[#2a2339] border border-[#4cd6e3]/20 rounded-lg overflow-hidden group">
              <div className="relative h-40">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Advanced+Farming+Tools"
                  alt="Advanced Farming Tools"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1528] to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Advanced Farming Tools</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-4">
                  Cutting-edge tools and equipment to maximize your farm&apos;s efficiency
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-400">Floor: </span>
                    <span className="text-[#4cd6e3] font-medium">850 $SEED</span>
                  </div>
                  <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full">12 items</span>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button className="w-full bg-[#1a1528] hover:bg-[#4cd6e3]/10 text-[#4cd6e3] border border-[#4cd6e3]/30 py-2 rounded-lg transition-colors">
                  View Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


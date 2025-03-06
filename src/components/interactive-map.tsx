"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Maximize2, ChevronLeft } from "lucide-react"

type MapRegion = {
  id: string
  name: string
  description: string
  coordinates: { x: number; y: number }
  seasonalBonus: string
  resourceType: string
}

export default function InteractiveMap() {
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const regions: MapRegion[] = [
    {
      id: "northern-plains",
      name: "Northern Plains",
      description: "Vast open fields ideal for wheat and corn farming. Cold winters affect crop yields.",
      coordinates: { x: 25, y: 20 },
      seasonalBonus: "Summer: +20% Wheat Yield",
      resourceType: "Agricultural",
    },
    {
      id: "eastern-forest",
      name: "Eastern Forest",
      description: "Dense forests with valuable timber and fruit orchards. Protected from harsh weather.",
      coordinates: { x: 70, y: 30 },
      seasonalBonus: "Fall: +15% Apple Production",
      resourceType: "Forestry",
    },
    {
      id: "southern-valley",
      name: "Southern Valley",
      description: "Fertile valley with diverse crop potential and natural irrigation from the river.",
      coordinates: { x: 40, y: 65 },
      seasonalBonus: "Spring: +25% Vegetable Growth",
      resourceType: "Mixed Farming",
    },
    {
      id: "western-mountains",
      name: "Western Mountains",
      description: "Mineral-rich mountains with mining opportunities and highland pastures.",
      coordinates: { x: 15, y: 45 },
      seasonalBonus: "Winter: +10% Mining Efficiency",
      resourceType: "Mining",
    },
    {
      id: "central-lake",
      name: "Central Lake",
      description: "Freshwater lake supporting fishing operations and water-intensive crops.",
      coordinates: { x: 50, y: 40 },
      seasonalBonus: "Summer: +30% Fishing Yield",
      resourceType: "Aquaculture",
    },
  ]

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleRegionClick = (region: MapRegion) => {
    setSelectedRegion(region)
  }

  const closeRegionView = () => {
    setSelectedRegion(null)
  }

  return (
    <div
      className={`bg-[#2a2339] rounded-lg overflow-hidden transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      <div className="p-4 flex justify-between items-center border-b border-[#4cd6e3]/20">
        <h3 className="text-xl font-semibold">Interactive World Map</h3>
        <button onClick={toggleFullscreen} className="p-2 rounded-full hover:bg-[#1a1528] transition-colors">
          <Maximize2 className="h-5 w-5 text-[#4cd6e3]" />
        </button>
      </div>

      <div className="relative">
        {selectedRegion ? (
          <div className="animate-fadeIn">
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={closeRegionView}
                className="flex items-center gap-2 bg-[#1a1528]/80 backdrop-blur-sm p-2 rounded-lg text-[#4cd6e3] hover:bg-[#1a1528] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to World Map
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-[#4cd6e3]">
                    <Image
                      src={`/placeholder.svg?height=500&width=500&text=${selectedRegion.name}`}
                      alt={selectedRegion.name}
                      width={500}
                      height={500}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#4cd6e3] mb-2">{selectedRegion.name}</h2>
                    <p className="text-gray-300 mb-4">{selectedRegion.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#1a1528] p-4 rounded-lg">
                        <h4 className="text-sm text-gray-400 mb-1">Seasonal Bonus</h4>
                        <p className="text-[#4cd6e3] font-medium">{selectedRegion.seasonalBonus}</p>
                      </div>
                      <div className="bg-[#1a1528] p-4 rounded-lg">
                        <h4 className="text-sm text-gray-400 mb-1">Resource Type</h4>
                        <p className="text-[#4cd6e3] font-medium">{selectedRegion.resourceType}</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3">Available Properties</h3>
                    <div className="space-y-2">
                      <div className="bg-[#1a1528] p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="font-medium">Farm Plot #1428</div>
                          <div className="text-sm text-gray-400">10 acres - Grade A Soil</div>
                        </div>
                        <div className="text-[#4cd6e3] font-medium">1,200 $SEED</div>
                      </div>
                      <div className="bg-[#1a1528] p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="font-medium">Processing Facility</div>
                          <div className="text-sm text-gray-400">Level 2 - 80% Efficiency</div>
                        </div>
                        <div className="text-[#4cd6e3] font-medium">2,800 $SEED</div>
                      </div>
                      <div className="bg-[#1a1528] p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="font-medium">Logistics Hub</div>
                          <div className="text-sm text-gray-400">Connected to 3 regions</div>
                        </div>
                        <div className="text-[#4cd6e3] font-medium">1,950 $SEED</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="w-full bg-[#4cd6e3] hover:bg-[#3ac0cd] text-black py-3 rounded-lg font-medium transition-colors">
                      View All Properties in {selectedRegion.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="aspect-[16/9] relative">
              <Image
                src="/placeholder.svg?height=800&width=1200&text=World+Map"
                alt="World Map"
                width={1200}
                height={800}
                className="w-full h-auto"
              />

              {regions.map((region) => (
                <button
                  key={region.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `${region.coordinates.x}%`,
                    top: `${region.coordinates.y}%`,
                  }}
                  onClick={() => handleRegionClick(region)}
                >
                  <div className="relative">
                    <MapPin className="h-8 w-8 text-[#4cd6e3] drop-shadow-glow" />
                    <div className="absolute h-3 w-3 bg-[#4cd6e3] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping" />
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#1a1528]/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg whitespace-nowrap transition-opacity duration-200">
                      {region.name}
                    </div>
                  </div>
                </button>
              ))}

              <div className="absolute bottom-4 right-4 bg-[#1a1528]/80 backdrop-blur-sm p-3 rounded-lg max-w-xs">
                <h4 className="text-sm font-medium text-[#4cd6e3] mb-1">Map Navigation</h4>
                <p className="text-xs text-gray-300">
                  Click on any pin to explore the region, view available properties, and see seasonal bonuses.
                </p>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
              {regions.map((region) => (
                <button
                  key={region.id}
                  className="bg-[#1a1528] p-2 rounded-lg text-left hover:bg-[#1a1528]/80 transition-colors"
                  onClick={() => handleRegionClick(region)}
                >
                  <div className="text-sm font-medium">{region.name}</div>
                  <div className="text-xs text-[#4cd6e3]">{region.resourceType}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


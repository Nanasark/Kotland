// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { ChevronLeft } from "lucide-react"
// import Link from "next/link"
// import Header from "@/components/Header"
// import dynamic from "next/dynamic"

// // Dynamically import the map component to avoid SSR issues with Leaflet
// const MapPageComponent = dynamic(() => import("@/components/screens/MapPageComponent"), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-[#1a1528]">
//       <div className="text-[#4cd6e3] text-xl">Loading map...</div>
//     </div>
//   ),
// })

// // Define map metadata
// const mapData = {
//   toronto: {
//     name: "Toronto",
//     description:
//       "Explore the vibrant city of Toronto with detailed building information and property claiming features.",
//   },
//   "new-york": {
//     name: "New York",
//     description: "Navigate through the bustling streets of New York City with comprehensive building data.",
//   },
//   london: {
//     name: "London",
//     description: "Discover London's historic architecture and modern developments with our detailed map.",
//   },
//   tokyo: {
//     name: "Tokyo",
//     description: "Explore Tokyo's dense urban landscape with property information and claiming capabilities.",
//   },
//   paris: {
//     name: "Paris",
//     description: "Navigate the romantic streets of Paris with detailed building and property data.",
//   },
//   sydney: {
//     name: "Sydney",
//     description: "Discover Sydney's iconic landmarks and properties with our interactive map.",
//   },
// }

// export default function MapDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const mapId = params.id as string
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     // Validate if the map exists
//     if (mapId && !mapData[mapId as keyof typeof mapData]) {
//       router.push("/maps")
//     } else {
//       setIsLoading(false)
//     }
//   }, [mapId, router])

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#1a1528] text-white">
//         <Header />
//         <div className="container mx-auto py-8">
//           <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
//             <div className="text-[#4cd6e3] text-xl">Loading map data...</div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const currentMap = mapData[mapId as keyof typeof mapData]

//   return (
//     <div className="min-h-screen bg-[#1a1528] text-white">
//       <Header />

//       <div className="container mx-auto py-4">
//         <div className="flex items-center gap-2 mb-2">
//           <Link
//             href="/maps"
//             className="flex items-center gap-2 text-[#4cd6e3] hover:text-[#4cd6e3]/80 transition-colors"
//           >
//             <ChevronLeft className="h-5 w-5" />
//             <span>Back to Maps</span>
//           </Link>
//         </div>

//         <h1 className="text-2xl font-bold mb-1">{currentMap.name} Map</h1>
//         <p className="text-gray-300 text-sm mb-4">{currentMap.description}</p>
//       </div>

//       <div className="w-full h-[calc(100vh-180px)]">
//         <MapPageComponent />
//       </div>
//     </div>
//   )
// }


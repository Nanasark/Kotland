// "use client"
// import Link from "next/link"
// import { ChevronLeft } from "lucide-react"
// import MapCard from "@/components/map-card"
// import Header from "@/components/Header"

// // Define the map data
// const maps = [
//   {
//     id: "toronto",
//     name: "Toronto",
//     description:
//       "Explore the vibrant city of Toronto with detailed building information and property claiming features.",
//     imageUrl: "/placeholder.svg?height=400&width=600&text=Toronto+Map",
//   },
//   {
//     id: "new-york",
//     name: "New York",
//     description: "Navigate through the bustling streets of New York City with comprehensive building data.",
//     imageUrl: "/placeholder.svg?height=400&width=600&text=New+York+Map",
//   },
//   {
//     id: "london",
//     name: "London",
//     description: "Discover London's historic architecture and modern developments with our detailed map.",
//     imageUrl: "/placeholder.svg?height=400&width=600&text=London+Map",
//   },
//   {
//     id: "tokyo",
//     name: "Tokyo",
//     description: "Explore Tokyo's dense urban landscape with property information and claiming capabilities.",
//     imageUrl: "/placeholder.svg?height=400&width=600&text=Tokyo+Map",
//   },
//   {
//     id: "paris",
//     name: "Paris",
//     description: "Navigate the romantic streets of Paris with detailed building and property data.",
//     imageUrl: "/placeholder.svg?height=400&width=600&text=Paris+Map",
//   },
//   {
//     id: "sydney",
//     name: "Sydney",
//     description: "Discover Sydney's iconic landmarks and properties with our interactive map.",
//     imageUrl: "/placeholder.svg?height=400&width=600&text=Sydney+Map",
//   },
// ]

// export default function MapsPage() {
//   return (
//     <div className="min-h-screen bg-[#1a1528] text-white">
//       <Header />

//       <div className="container mx-auto py-8">
//         <div className="flex items-center gap-2 mb-6">
//           <Link href="/" className="flex items-center gap-2 text-[#4cd6e3] hover:text-[#4cd6e3]/80 transition-colors">
//             <ChevronLeft className="h-5 w-5" />
//             <span>Back to Home</span>
//           </Link>
//         </div>

//         <h1 className="text-3xl md:text-4xl font-bold mb-2">Available Maps</h1>
//         <p className="text-gray-300 mb-8">Select a map to explore properties and claim your territory</p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {maps.map((map) => (
//             <MapCard
//               key={map.id}
//               id={map.id}
//               name={map.name}
//               description={map.description}
//               imageUrl={map.imageUrl}
//               href={`/maps/${map.id}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }


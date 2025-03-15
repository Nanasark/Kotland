// import Image from "next/image"
// import Link from "next/link"
// import { MapPin } from "lucide-react"

// interface MapCardProps {
//   id: string
//   name: string
//   description: string
//   imageUrl: string
//   onClick?: () => void
//   href?: string
// }

// export default function MapCard({ id, name, description, imageUrl, onClick, href }: MapCardProps) {
//   const CardContent = () => (
//     <div className="group relative overflow-hidden rounded-lg border border-[#4cd6e3]/30 bg-[#2a2339] transition-all hover:border-[#4cd6e3] hover:shadow-[0_0_15px_rgba(76,214,227,0.3)]">
//       <div className="aspect-[16/9] relative overflow-hidden">
//         <Image
//           src={imageUrl || `/placeholder.svg?height=400&width=600&text=${name}`}
//           alt={name}
//           width={600}
//           height={400}
//           className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#1a1528]/80 to-transparent" />
//         <div className="absolute top-3 right-3 bg-[#1a1528]/80 backdrop-blur-sm p-2 rounded-full">
//           <MapPin className="h-5 w-5 text-[#4cd6e3]" />
//         </div>
//       </div>
//       <div className="p-4">
//         <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
//         <p className="text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
//         <button className="w-full bg-[#1a1528] hover:bg-[#4cd6e3]/10 text-[#4cd6e3] py-2 rounded-lg transition-colors text-sm font-medium">
//           Explore Map
//         </button>
//       </div>
//     </div>
//   )

//   if (href) {
//     return (
//       <Link href={href} className="block">
//         <CardContent />
//       </Link>
//     )
//   }

//   return (
//     <div onClick={onClick} className="cursor-pointer">
//       <CardContent />
//     </div>
//   )
// }


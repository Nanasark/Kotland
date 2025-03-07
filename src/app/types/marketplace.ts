// NFT Item Interface
export interface NFTItem {
  id: string
  name: string
  description: string
  price: number
  currency: string
  seller: string
  category: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  imageUrl: string
  attributes: NFTAttribute[]
  listedAt: string
}

// NFT Attribute Interface
export interface NFTAttribute {
  trait: string
  value: string
}

// NFT Category Interface
export interface NFTCategory {
  id: string
  name: string
  icon: string
}

// NFT Collection Interface
export interface NFTCollection {
  id: string
  name: string
  description: string
  imageUrl: string
  floorPrice: number
  currency: string
  itemCount: number
}

// NFT Transaction Interface
export interface NFTTransaction {
  id: string
  nftId: string
  seller: string
  buyer: string
  price: number
  currency: string
  timestamp: string
}

// User Profile Interface
export interface UserProfile {
  id: string
  username: string
  avatarUrl: string
  walletAddress: string
  joinedDate: string
  itemsOwned: number
  itemsListed: number
  totalSales: number
}

// Filter Options Interface
export interface FilterOptions {
  category: string
  minPrice?: number
  maxPrice?: number
  rarity?: string[]
  sortBy: "recent" | "price-low" | "price-high"
}


// Resource type definitions
export enum ResourceType {
    None = 0,
    Wheat = 1,
    Corn = 2,
    Potato = 3,
    Carrot = 4,
    Food = 5,
    Energy = 6,
    FactoryGoods = 7,
    Fertilizer = 8,
  }
  
  // Market listing interface
  export interface MarketListing {
    id: number
    seller: string
    resourceType: string
    amount: number
    pricePerUnit: number
  }
  
  // Resource mapping utilities
  export const resourceTypeMap: Record<string, number> = {
    None: 0,
    Wheat: 1,
    Corn: 2,
    Potato: 3,
    Carrot: 4,
    Food: 5,
    Energy: 6,
    "Factory Goods": 7,
    Fertilizer: 8,
  }
  
  export const getResourceTypeNumber = (resourceName: string): number => {
    return resourceTypeMap[resourceName] ?? -1 // Returns -1 if the resource name is not found
  }
  
  export const getResourceTypeName = (resourceType: number): string => {
    const resourceNames = ["None", "Wheat", "Corn", "Potato", "Carrot", "Food", "Energy", "Factory Goods", "Fertilizer"]
  
    return resourceNames[resourceType] || "Unknown"
  }
  
  // Resource image mapping
  export const getResourceImage = (resourceType: string): string => {
    switch (resourceType) {
      case "Wheat":
        return "/resources/wheat.jpeg"
      case "Corn":
        return "/resources/corn.jpeg"
      case "Potato":
        return "/resources/potato.jpeg"
      case "Carrot":
        return "/resources/carrot.jpeg"
      case "Food":
        return "/resources/food.jpeg"
      case "Energy":
        return "/resources/energy.jpeg"
      case "Factory Goods":
        return "/resources/factorygood.jpeg"
      case "Fertilizer":
        return "/resources/fertilizer.jpeg"
      default:
        return "/placeholder.svg?height=80&width=80"
    }
  }
  
  
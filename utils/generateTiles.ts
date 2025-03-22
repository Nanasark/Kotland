// import { mainContract } from "@/app/contract";
// import { readContract } from "thirdweb";
// import { getTileDetails } from "./getTileDetails";
// import { toEther } from "thirdweb";

// type TileStatus = "available" | "owned" | "active" | "inactive" | "forSale"
// type CropType = "wheat" | "corn" | "potato" | "carrot" | "none"
// interface Tile {
//   id: number
//   status: TileStatus
//   cropType: CropType
//   growthStage?: number
//   fertility?: number
//   waterLevel?: number
//   sunlight?: number
//   purchasePrice?: number
//   owner?: string
//   forSalePrice?: number
// }


// export const generateTiles = async (rows: number, columns: number, userAddress: string): Promise<Tile[]> => {
//   console.log("Generating tiles...");

//   const tiles: Tile[] = [];
//   const currentUser = "CryptoFarmer";

//   for (let i = 0; i < rows * columns; i++) {
//     try {
//       console.log(`Checking if tile ${i} exists...`);

//       const tileExists = Boolean(await readContract({
//         contract: mainContract,
//         method: "tileExists",
//         params: [Number(i)],
//       }));

//       console.log(`Tile ${i} exists:`, tileExists);

//       let tileDetails = null;

//       if (tileExists) {
//         try {
//           tileDetails = await getTileDetails(Number(i));
          
//         } catch (error) {
//           console.error(`Error fetching details for tile ${i}:`, error);
//           continue; // Skip this tile and move to the next one
//         }
//       }
//        const tileprice =await readContract({
//             contract:mainContract,
//             method: "pricePerTile",
            
//         });

//         const tilePrice = toEther(tileprice)

//       const tileOwner = tileDetails?.owner || "";
//       const tileFertility = tileDetails?.fertility || "0"
//       const tileWaterLevel = tileDetails?.waterLevel || "0"
//       const isForSale = tileDetails?.forSale || false
//       const listedPrice = tileDetails?.price || BigInt(0)
//       const isBeingUsed = tileDetails?.isBeingUsed || false;
//       const crop = tileDetails?.cropType || 0
//       const tileCrop = crop == 1? "wheat" : crop ==2? "corn": crop ==3?"potato":crop == 4 ? "carrot" : "none"
//       const forSale = tileDetails?.forSale || false;

//       console.log(`Tile ${i} - Exists: ${tileExists}, Owner: ${tileOwner}, For Sale: ${forSale}, Active: ${isBeingUsed}`);

//       if (!tileExists) {
//         tiles.push({
//           id: i,
//           status: "available",
//           cropType: "none",
//            fertility: Number(tileFertility) ,
//             waterLevel: Number(tileWaterLevel),
//             sunlight: 50 + Math.floor(Math.random() * 50),
//           purchasePrice: Number(tilePrice),
//         });
//       } else {
//         if (tileOwner !== userAddress && !forSale) {
//           tiles.push({
//             id: i,
//             status: "owned",
//             owner: tileOwner,
//             cropType: tileCrop,
//             fertility: Number(tileFertility) ,
//             waterLevel: Number(tileWaterLevel),
//             sunlight: 50 + Math.floor(Math.random() * 50),
            
//           });
//         } else if (tileOwner === userAddress && !isBeingUsed && !isForSale ) {
//           tiles.push({
//             id: i,
//             status: "inactive",
//             owner: currentUser,
//             cropType: "none",
//             fertility: Number(tileFertility) ,
//             waterLevel: Number(tileWaterLevel),
//             sunlight: 50 + Math.floor(Math.random() * 50),
//           });
//         } else if (tileOwner === userAddress && isBeingUsed) {
//           tiles.push({
//             id: i,
//             status: "active",
//             owner: currentUser,
//             cropType:tileCrop,
//             fertility: Number(tileFertility),
//             waterLevel: Number(tileWaterLevel),
//             sunlight: 50 + Math.floor(Math.random() * 50),
//           });
//         } else {
         
//           tiles.push({
//             id: i,
//             status: "forSale",
//             owner: tileOwner,
//             cropType: "none",
//              fertility: Number(tileFertility) ,
//             waterLevel: Number(tileWaterLevel),
//             sunlight: 50 + Math.floor(Math.random() * 50),
//             purchasePrice: Number(toEther(listedPrice))
//           });
//         }
//       }
//     } catch (error) {
//       console.error(`Unexpected error processing tile ${i}:`, error);
//     }
//   }

//   console.log("Generated Tiles:", tiles);
//   return tiles;
// };


import { mainContract } from "@/app/contract";
import { readContract } from "thirdweb";
import { getTileDetails } from "./getTileDetails";
import { toEther } from "thirdweb";

type TileStatus = "available" | "owned" | "active" | "inactive" | "forSale";
type CropType = "wheat" | "corn" | "potato" | "carrot" | "none";

interface Tile {
  id: number;
  status: TileStatus;
  cropType: CropType;
  growthStage?: number;
  fertility?: number;
  waterLevel?: number;
  sunlight?: number;
  purchasePrice?: number;
  owner?: string;
  forSalePrice?: number;
}

const cropTypes: Record<number, CropType> = {
  1: "wheat",
  2: "corn",
  3: "potato",
  4: "carrot",
};

export const generateTiles = async (
  rows: number,
  columns: number,
  userAddress: string
): Promise<Tile[]> => {
  console.log("Generating tiles...");
  const currentUser = "CryptoFarmer";

  // Fetch price per tile once instead of calling it for each tile
  const tileprice = await readContract({
    contract: mainContract,
    method: "pricePerTile",
  });
  const tilePrice = toEther(tileprice);

  const tilePromises = Array.from({ length: rows * columns }, async (_, i) => {
    try {
      console.log(`Checking if tile ${i} exists...`);
      
      const tileExists = Boolean(
        await readContract({
          contract: mainContract,
          method: "tileExists",
          params: [Number(i)],
        })
      );
      
      console.log(`Tile ${i} exists:`, tileExists);
      
      if (!tileExists) {
        return {
          id: i,
          status: "available",
          cropType: "none",
          fertility: 0,
          waterLevel: 0,
          sunlight: 50 + Math.floor(Math.random() * 50),
          purchasePrice: Number(tilePrice),
        };
      }
      
      let tileDetails;
      try {
        tileDetails = await getTileDetails(Number(i));
      } catch (error) {
        console.error(`Error fetching details for tile ${i}:`, error);
        return null; // Skip this tile
      }

      const {
        owner = "",
        fertility = "0",
        waterLevel = "0",
        forSale = false,
        price = BigInt(0),
        isBeingUsed = false,
        cropType = 0,
      } = tileDetails || {};

      const tileCrop = cropTypes[cropType] || "none";
      console.log(
        `Tile ${i} - Exists: ${tileExists}, Owner: ${owner}, For Sale: ${forSale}, Active: ${isBeingUsed}`
      );

      if (owner !== userAddress && !forSale) {
        return {
          id: i,
          status: "owned",
          owner,
          cropType: tileCrop,
          fertility: Number(fertility),
          waterLevel: Number(waterLevel),
          sunlight: 50 + Math.floor(Math.random() * 50),
        };
      } else if (owner === userAddress && !isBeingUsed && !forSale) {
        return {
          id: i,
          status: "inactive",
          owner: currentUser,
          cropType: "none",
          fertility: Number(fertility),
          waterLevel: Number(waterLevel),
          sunlight: 50 + Math.floor(Math.random() * 50),
        };
      } else if (owner === userAddress && isBeingUsed) {
        return {
          id: i,
          status: "active",
          owner: currentUser,
          cropType: tileCrop,
          fertility: Number(fertility),
          waterLevel: Number(waterLevel),
          sunlight: 50 + Math.floor(Math.random() * 50),
        };
      } else {
        return {
          id: i,
          status: "forSale",
          owner,
          cropType: "none",
          fertility: Number(fertility),
          waterLevel: Number(waterLevel),
          sunlight: 50 + Math.floor(Math.random() * 50),
          purchasePrice: Number(toEther(price)),
        };
      }
    } catch (error) {
      console.error(`Unexpected error processing tile ${i}:`, error);
      return null;
    }
  });

  const resolvedTiles = await Promise.all(tilePromises);
  return resolvedTiles.filter((tile) => tile !== null) as Tile[];
};

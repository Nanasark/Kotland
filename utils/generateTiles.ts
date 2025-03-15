import { mainContract } from "@/app/contract";
import { readContract } from "thirdweb";
import { getTileDetails } from "./getTileDetails";
import { toEther } from "thirdweb";

type TileStatus = "available" | "owned" | "active" | "inactive" | "forSale"
type CropType = "wheat" | "corn" | "potato" | "carrot" | "none"
interface Tile {
  id: number
  status: TileStatus
  cropType: CropType
  growthStage?: number
  fertility?: number
  waterLevel?: number
  sunlight?: number
  purchasePrice?: number
  owner?: string
  forSalePrice?: number
}


export const generateTiles = async (rows: number, columns: number, userAddress: string): Promise<Tile[]> => {
  console.log("Generating tiles...");

  const tiles: Tile[] = [];
  const currentUser = "CryptoFarmer";

  for (let i = 0; i < rows * columns; i++) {
    try {
      console.log(`Checking if tile ${i} exists...`);

      const tileExists = Boolean(await readContract({
        contract: mainContract,
        method: "tileExists",
        params: [Number(i)],
      }));

      console.log(`Tile ${i} exists:`, tileExists);

      let tileDetails = null;

      if (tileExists) {
        try {
          tileDetails = await getTileDetails(Number(i));
          
        } catch (error) {
          console.error(`Error fetching details for tile ${i}:`, error);
          continue; // Skip this tile and move to the next one
        }
      }
       const tileprice =await readContract({
            contract:mainContract,
            method: "pricePerTile",
            
        });

        const tilePrice = toEther(tileprice)

      const tileOwner = tileDetails?.owner || "";
      const tileFertility = tileDetails?.fertility || "0"
      const tileWaterLevel = tileDetails?.waterLevel || "0"
      const isForSale = tileDetails?.forSale || false
      // const listedPrice = tileDetails?.price || "0"
      const isBeingUsed = tileDetails?.isBeingUsed || false;
      const forSale = tileDetails?.forSale || false;

      console.log(`Tile ${i} - Exists: ${tileExists}, Owner: ${tileOwner}, For Sale: ${forSale}, Active: ${isBeingUsed}`);

      if (!tileExists) {
        tiles.push({
          id: i,
          status: "available",
          cropType: "none",
           fertility: Number(tileFertility) ,
            waterLevel: Number(tileWaterLevel),
            sunlight: 50 + Math.floor(Math.random() * 50),
          purchasePrice: Number(tilePrice),
        });
      } else {
        if (tileOwner !== userAddress && !forSale) {
          tiles.push({
            id: i,
            status: "owned",
            owner: tileOwner,
            cropType: "none",
            fertility: Number(tileFertility) ,
            waterLevel: Number(tileWaterLevel),
            sunlight: 50 + Math.floor(Math.random() * 50),
          });
        } else if (tileOwner === userAddress && !isBeingUsed && !isForSale ) {
          tiles.push({
            id: i,
            status: "inactive",
            owner: currentUser,
            cropType: "none",
            fertility: Number(tileFertility) ,
            waterLevel: Number(tileWaterLevel),
            sunlight: 50 + Math.floor(Math.random() * 50),
          });
        } else if (tileOwner === userAddress && isBeingUsed) {
          tiles.push({
            id: i,
            status: "active",
            owner: currentUser,
            cropType: "none",
             fertility: Number(tileFertility) ,
            waterLevel: Number(tileWaterLevel),
            sunlight: 50 + Math.floor(Math.random() * 50),
          });
        } else {
         
          tiles.push({
            id: i,
            status: "forSale",
            owner: tileOwner,
            cropType: "none",
             fertility: Number(tileFertility) ,
            waterLevel: Number(tileWaterLevel),
            sunlight: 50 + Math.floor(Math.random() * 50),
          });
        }
      }
    } catch (error) {
      console.error(`Unexpected error processing tile ${i}:`, error);
    }
  }

  console.log("Generated Tiles:", tiles);
  return tiles;
};

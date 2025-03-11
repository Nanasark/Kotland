import { readContract } from "thirdweb";
import { mainContract } from "@/app/contract";

export const getTileDetails = async ( tileId: bigint) => {
    try {
        const tileData = await readContract({
            contract:mainContract,
            method: "getTileData",
            params: [tileId]
        });

        if (tileData !== null) {
            const [id, owner, isBeingUsed, nftBeingUsed, nftIdBeingStaked, forSale,] = tileData;

            return {
                id,
                owner,
                isBeingUsed,
                nftBeingUsed,
                nftIdBeingStaked,
                forSale
            };
        } else {
            console.log("Tile data is null");
            return null;
        }
    } catch (error) {
        console.error("Error fetching tile data:", error);
        return null;
    }
};

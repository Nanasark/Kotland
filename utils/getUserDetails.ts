import { readContract, toEther } from "thirdweb";
import { mainContract, SEEDTokenContract } from "@/app/contract";
import { balanceOf } from "thirdweb/extensions/erc20";

export const getUserDetails = async (address: string) =>{


    try {
        const userDetails = await readContract({
             contract:mainContract,
             method: "getUserData",
             params:[address]
        })
            const userBalance = await balanceOf({
                contract: SEEDTokenContract,
                address: address
              })

              const balance = Number(toEther(userBalance))


              

        if (userDetails !== null){
            const [userAddress,totalTilesOwned,tilesUnderUse,userExperience,exists] = userDetails
            const level = Math.round(userExperience/200)

            return{
                userAddress,totalTilesOwned,tilesUnderUse,userExperience,exists,balance,level
            }
        }
    
        else {
            console.log("User DETAILS is null");
            return null;
        }
    } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
    }
}
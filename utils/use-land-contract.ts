"use client"
import { prepareContractCall, PreparedTransaction, toWei } from "thirdweb"
import { useSendTransaction } from "thirdweb/react"
import { approve } from "thirdweb/extensions/erc20"
import { SEEDTokenContract } from "@/app/contract"
import { mainContract } from "@/app/contract"

export function useLandContract() {




  const {mutateAsync:approval,isError:isApprovalError, isSuccess:isApprovalSuccess ,status: approvalStatus} = useSendTransaction()
  const approveTokens = async ( amount:bigint): Promise<boolean> => {
    try {
        
        const transaction = approve({
            amountWei: amount,
            contract: SEEDTokenContract,
            spender:mainContract.address
        })

        const approved = await approval(transaction)
        console.log(approve)
        // await new Promise(resolve => setTimeout(resolve, 3000));
        // if ((approvalStatus === "success" || isApprovalSuccess) && !isApprovalError) {
        //     return true
        // }
        // else{
        // return false
        // }
        // return !!approved;
         return !!approved.transactionHash;
       

    } catch (error) {
      console.error("Failed to approve tokens:", error)
      return false
    }
    }
    
  const {mutateAsync: sendPurchase,isError:isPurchaseError, isSuccess:isPurchaseSuccess ,status: purchaseStatus} = useSendTransaction()

  const purchaseTile = async (tileId: number): Promise<boolean> => {
   try {
          const transaction =  prepareContractCall({
         contract: mainContract,
         method: "buyNewTile",
         params:[Number(tileId)]
   
       }) as PreparedTransaction;
       
       await sendPurchase(transaction)
       
       if ((purchaseStatus === "success" || isPurchaseSuccess) && !isPurchaseError)

       
        {
    
           return true
       }
       else{
        return false
       }
         
       
       } catch (error) {
       console.log(error)
       return false
       }
   
  }

    const {mutateAsync: listTileForSale,isError:isListingTileError, isSuccess:isListingTileSuccess ,status: listingStatus} = useSendTransaction()

  const listTile = async (tileId: number, price: number): Promise<boolean> => {
    console.log(price)
    if (price < 3) {
      throw new Error("Price not here")
    }
   try {
          const transaction =  prepareContractCall({
         contract: mainContract,
         method: "listTileForSale",
         params:[Number(tileId), toWei(`${price}`)]
   
       }) as PreparedTransaction;
        await listTileForSale(transaction)
       
       if ((listingStatus=== "success" || isListingTileSuccess) && !isListingTileError)

       
        {
    
           return true
       }
       else{
        return false
       }
         
       
       } catch (error) {
       console.log(error)
       return false
       }
   
  }

  return {
    approveTokens,
    purchaseTile,
    listTile
  }
}


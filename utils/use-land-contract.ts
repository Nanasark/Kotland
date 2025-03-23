"use client"
import { prepareContractCall, PreparedTransaction, toWei } from "thirdweb"
import { useSendTransaction } from "thirdweb/react"
import { approve } from "thirdweb/extensions/erc20"
import { SEEDTokenContract } from "@/app/contract"
import { mainContract } from "@/app/contract"
import { getTileDetails } from "./getTileDetails"

export function useLandContract() {



// isError:isApprovalError, isSuccess:isApprovalSuccess ,status: approvalStatus
  const {mutateAsync:approval,} = useSendTransaction()
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

      const tileDetails = await getTileDetails(tileId)
     
        const method = tileDetails?.forSale ? "buyListedTile" : "buyNewTile"
        const transaction =  prepareContractCall({
         contract: mainContract,
         method: method,
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
    if (price < 0) {
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


  const {mutateAsync: plant,isError:isPlantError, isSuccess:isPlantSuccess ,status: plantStatus} = useSendTransaction()

   const plantCrop = async (tileId: number, crop: number): Promise<boolean> => {

    try {
        
        const transaction =  prepareContractCall({
         contract: mainContract,
         method: "plantCrop",
         params:[Number(tileId),crop]
   
       }) as PreparedTransaction;
       
       await plant(transaction)
       
       if ((plantStatus === "success" || isPlantSuccess) && !isPlantError)

       
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
  const buildFactory = async (tileId: number): Promise<boolean> => {
    try {
      // In a real app, you would call the land contract's buildFactory function
      console.log(`Building factory on tile ID: ${tileId}`)

      // Simulate a delay for the building transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return true
    } catch (error) {
      console.error("Failed to build factory:", error)
      return false
    }
  }

  const {mutateAsync: sendBuyResource,isError:isBuyResourceError, isSuccess:isBuyResourceSuccess ,status: BuyResourceStatus} = useSendTransaction()

  const buyResource = async (listingId: number, quantity:number): Promise<boolean> => {

    try {

     
        const transaction =  prepareContractCall({
         contract: mainContract,
         method: "buyListedResource",
         params:[BigInt(listingId),BigInt(quantity)]
   
       }) as PreparedTransaction;
       
       await sendBuyResource(transaction)
       
       if ((BuyResourceStatus === "success" || isBuyResourceSuccess) && !isBuyResourceError){
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

  const {mutateAsync: listResourceForSale,isError:isListingResourceError, isSuccess:isListingResourceSuccess ,status: listingResourceStatus} = useSendTransaction()

  const listResource = async (resourceType: number,amount:number, price: number): Promise<boolean> => {
    console.log(price)
    if (price < 0) {
      throw new Error("Price not here")
    }
   try {
          const transaction =  prepareContractCall({
         contract: mainContract,
         method: "listResourceForSale",
         params:[resourceType,amount, toWei(`${price}`)]
   
       }) as PreparedTransaction;
        await listResourceForSale(transaction)
       
       if ((listingResourceStatus=== "success" || isListingResourceSuccess) && !isListingResourceError)
       
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
    listTile,
    buildFactory,
    plantCrop,
    buyResource,
    listResource
  }
}


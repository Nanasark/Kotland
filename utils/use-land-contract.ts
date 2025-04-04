"use client"
import { prepareContractCall, PreparedTransaction, toWei } from "thirdweb"
import { useSendTransaction } from "thirdweb/react"
import { approve } from "thirdweb/extensions/erc20"
import { SEEDTokenContract } from "@/app/contract"
import { mainContract ,utilsContract} from "@/app/contract"
import { getTileDetails } from "./getTileDetails"
import { readContract } from "thirdweb"

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

  const {mutateAsync: harvest,isError:isHarvestError, isSuccess:isHarvestSuccess ,status: harvestStatus} = useSendTransaction()

   const harvestCrop = async (tileId: number): Promise<boolean> => {

    try {
        
        const transaction =  prepareContractCall({
         contract: mainContract,
         method: "harvestCrop",
         params:[Number(tileId)]
   
       }) as PreparedTransaction;
       
       await harvest(transaction)
       
       if (( harvestStatus === "success" || isHarvestSuccess) && !isHarvestError)

       
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

  const {mutateAsync: water,isError:isWaterError, isSuccess:isWaterSuccess ,status: waterStatus} = useSendTransaction()

  const waterCrop = async (tileId: number): Promise<boolean> => {

   try {
       
       const transaction =  prepareContractCall({
        contract: mainContract,
        method: "waterCrop",
        params:[Number(tileId)]
  
      }) as PreparedTransaction;
      
      await water(transaction)
      
      if ((waterStatus === "success" || isWaterSuccess) && !isWaterError)

      
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

 const {mutateAsync: fertilize,isError:isFertilizeError, isSuccess:isFertilizeSuccess ,status: fertilizeStatus} = useSendTransaction()

  const fertilizeCrop = async (tileId: number): Promise<boolean> => {

   try {
       
       const transaction =  prepareContractCall({
        contract: mainContract,
        method: "fertilizeCrop",
        params:[Number(tileId)]
  
      }) as PreparedTransaction;
      
      await fertilize(transaction)
      
      if ((fertilizeStatus === "success" || isFertilizeSuccess) && !isFertilizeError)

      
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

 const canWater = async (tileId: number): Promise<boolean>=> {
  try {
    const wateredTimestamp =  await readContract({
      contract: mainContract,
      method: "lastWateredTime",
      params: [tileId],
    });

    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000)); // Convert current time to seconds (Unix timestamp)
    const oneDay = BigInt(86400); 
    console.log("wateredTimestamp ", wateredTimestamp)
    console.log("currentTimestamp ", currentTimestamp)
    return currentTimestamp >= wateredTimestamp + oneDay
  } catch (error) {
    console.error("Error fetching last watered time:", error);
    return false; // Default to false if there's an error
  }
};

const fetchWateringTimestamp = async (tileId: number): Promise<bigint> => {
  try {
    const  times=await readContract({
      contract: mainContract,
      method: "lastWateredTime",
      params: [tileId],
    });
    const oneDay = BigInt(86400); 
    const nextTime = times+oneDay
    return nextTime
  } catch (error) {
    console.error("Error fetching last watered time:", error);
    return BigInt(0); // Default to 0 on error
  }
};


const {mutateAsync: build,isError:isBuildError, isSuccess:isBuildSuccess ,status: buildStatus} = useSendTransaction()

   const buildFactory = async (tileId: number, factory: number): Promise<boolean> => {

    try {
        
        const transaction =  prepareContractCall({
         contract: mainContract,
         method: "buildFactory",
         params:[Number(tileId),factory]
   
       }) as PreparedTransaction;
       
       await build(transaction)
       
       if ((buildStatus === "success" || isBuildSuccess) && !isBuildError)

       
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


  const {mutateAsync: produceFactory,isError:isProduceFactoryError, isSuccess:isProduceFactorySuccess ,status: produceStatus,error:produceError} = useSendTransaction()

  const produceFromFactory = async (tileId: number): Promise<boolean> => {

   try {
       
       const transaction =  prepareContractCall({
        contract: utilsContract,
        method: "produceFromFactory",
        params:[BigInt(tileId)]
        

  
      }) as PreparedTransaction;
      
      await produceFactory(transaction)
      
      if ((produceStatus === "success" || isProduceFactorySuccess) && !isProduceFactoryError)

      
       {
   
          return true
      }
      else{
        console.log("produce error:", produceError)
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
    listResource,
    waterCrop,
    fertilizeCrop,
    canWater,
    fetchWateringTimestamp,
    harvestCrop,
    produceFromFactory
  }
}


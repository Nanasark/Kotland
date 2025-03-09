import { getContract } from "thirdweb";
import { chain } from "./chain";
import { client } from "./clients";
import { MainABI } from "./abi";
import { SEEDTokenABI } from "./abi";
import { EvolvingTomatoNFTABI } from "./abi";
export const mainContract = getContract({
    address: "0x7ba664E765c439763b213264Df2FB0A8E639DB94",
    chain: chain,
    client:client,
    abi:MainABI
})


export const SEEDTokenContract = getContract({
    address: "0x865c71F0CEdF774d850CaAF48c87423C9D7120ad",
    chain: chain,
    client: client,
    abi: SEEDTokenABI
})



export const EvolvingTomatoNFT = getContract({
    address: "0xA3a2E757986E8e43f10833e112E212Dbad755F51",
    chain: chain,
    client: client,
    abi: EvolvingTomatoNFTABI
})
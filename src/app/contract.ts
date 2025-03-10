import { getContract } from "thirdweb";
import { chain } from "./chain";
import { client } from "./clients";
import { MainABI } from "./abi";
import { SEEDTokenABI } from "./abi";
import { EvolvingTomatoNFTABI } from "./abi";
export const mainContract = getContract({
    address: "0xd51a290A31495c2317a44a9945887875e1C19230",
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
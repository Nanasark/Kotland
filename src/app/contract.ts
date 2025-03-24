import { getContract } from "thirdweb";
import { chain } from "./chain";
import { client } from "./clients";
import { MainABI } from "./abi";
import { SEEDTokenABI } from "./abi";
import { UtilsABI } from "./abi";
export const mainContract = getContract({
    address: "0xB8B8B2f742CA59058D315595c3dfc85d4E195813",
    chain: chain,
    client:client,
    abi:MainABI
})

export const utilsContract = getContract({
    address: "0xB8B8B2f742CA59058D315595c3dfc85d4E195813",
    chain: chain,
    client: client,
    abi: UtilsABI
})


export const SEEDTokenContract = getContract({
    address: "0x865c71F0CEdF774d850CaAF48c87423C9D7120ad",
    chain: chain,
    client: client,
    abi: SEEDTokenABI
})



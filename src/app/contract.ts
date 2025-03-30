import { getContract } from "thirdweb";
import { chain } from "./chain";
import { client } from "./clients";
import { MainABI } from "./abi";
import { SEEDTokenABI } from "./abi";
import { UtilsABI } from "./abi";
export const mainContract = getContract({
    address: "0x7c0D6C71aC131185084d9878Ef5948e8c1d7a800",
    chain: chain,
    client:client,
    abi:MainABI
})

export const utilsContract = getContract({
    address: "0x33c7d610a8970F71207fAddf728F4c52d827029E",
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



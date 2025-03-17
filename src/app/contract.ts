import { getContract } from "thirdweb";
import { chain } from "./chain";
import { client } from "./clients";
import { MainABI } from "./abi";
import { SEEDTokenABI } from "./abi";
import { UtilsABI } from "./abi";
export const mainContract = getContract({
    address: "0x9898f55E4F73E527D00D16881aeE014aD988934d",
    chain: chain,
    client:client,
    abi:MainABI
})

export const utilsContract = getContract({
    address: "0x75c95D066DAFBA8692044eF100C073ABfaAd9C29",
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



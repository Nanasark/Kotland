import { getContract } from "thirdweb";
import { chain } from "./chain";
import { client } from "./clients";
import { MainABI } from "./abi";
import { SEEDTokenABI } from "./abi";
import { UtilsABI } from "./abi";
export const mainContract = getContract({
    address: "0xFB7833940261F412AB8cB9e3346AE70E95Ff9295",
    chain: chain,
    client:client,
    abi:MainABI
})

export const utilsContract = getContract({
    address: "0xB1046CF11EB36CBdB4222ddfef98E45DE53F7aC6",
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



import { getContract } from "thirdweb";
import { chain } from "./chain";
import { client } from "./clients";
import { MainABI } from "./abi";

export const mainContract = getContract({
    address: "0xc47147F21220E576fE5EBDe0053655CE91FA66fD",
    chain: chain,
    client:client,
    abi:MainABI
})


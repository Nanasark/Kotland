import { getContract } from "thirdweb";
import { chain } from "./chain";
import { client } from "./clients";
export const mainContract = getContract({
    address: "",
    chain: chain,
    client
})
import { useActiveAccount } from "thirdweb/react";

export function GetUserAddress (){
  const account = useActiveAccount();
  return account ? account.address : "";
};

"use client"
import { ConnectButton } from "thirdweb/react"
import { createWallet } from "thirdweb/wallets"
import { client } from "@/app/clients"
import { chain } from "@/app/chain"

export default function SignIn() {
    const wallets = [
        createWallet("io.metamask"),
        createWallet("embedded")
        
    ]
    return (
        <>
         <ConnectButton
            client={client}
            chain={chain}
            supportedTokens={{
              56: [
                {
                  name: "Kotland",
                  address: "0x170b47f039d006396929F7734228fFc53Ab155b2",
                  symbol: "KTL",
                },
              ],
                }}
                
            theme={"dark"}
            wallets={wallets}
            showAllWallets={false}
            connectButton={{
              className: "connect",
              label: "Sign in",
                }}
        
          />
        </>
    )
}
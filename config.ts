import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { alchemy, arbitrumSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";
import { Connection } from "@solana/web3.js";

const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY is not set");
}

const SPONSORSHIP_POLICY_ID = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID;
if (!SPONSORSHIP_POLICY_ID) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_POLICY_ID is not set");
}

import { configForExternalWallets } from "@account-kit/react";

export const externalWallets = configForExternalWallets({
  wallets: ["wallet_connect", "coinbase wallet", "metamask"],
  chainType: ["svm", "evm"],
  walletConnectProjectId: "30e7ffaff99063e68cc9870c105d905b",
  hideMoreButton: false,
  numFeaturedWallets: 2,
});

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [
        {
          type: "external_wallets",
          ...externalWallets.uiConfig,
        },
      ],
      [
        { type: "passkey" },
        { type: "social", authProviderId: "google", mode: "popup" },
        { type: "social", authProviderId: "facebook", mode: "popup" },
      ],
    ],
    addPasskeyOnSignup: false,
  },
};

export const config = createConfig(
  {
    transport: alchemy({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
    // Note: This quickstart is configured for Arbitrum Sepolia.
    chain: arbitrumSepolia,
    ssr: true, // more about ssr: https://www.alchemy.com/docs/wallets/react/ssr
    storage: cookieStorage, // more about persisting state with cookies: https://www.alchemy.com/docs/wallets/react/ssr#persisting-the-account-state
    enablePopupOauth: true, // must be set to "true" if you plan on using popup rather than redirect in the social login flow
    policyId: SPONSORSHIP_POLICY_ID,
    connectors: externalWallets.connectors,
    solana: {
      connection: new Connection(
        `https://solana-devnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        {
          wsEndpoint: "wss://api.devnet.solana.com",
          commitment: "confirmed",
        }
      ),
      adapters: externalWallets.adapters, // 👈 new
      // gas sponsor (optional)
      policyId: process.env.NEXT_PUBLIC_SOLANA_POLICY_ID,
    },
  },
  uiConfig
);

export const queryClient = new QueryClient();

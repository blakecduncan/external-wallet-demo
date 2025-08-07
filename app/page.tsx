"use client";

import { useUser } from "@account-kit/react";
import UserInfoCard from "./components/user-info-card";
import NftMintCard from "./components/nft-mint-card";
import LoginCard from "./components/login-card";
import Header from "./components/header";
import LearnMore from "./components/learn-more";
import SolanaActionsCard from "./components/solana-actions-card";

export default function Home() {
  const user = useUser();
  const isExternalSolanaWallet = user?.type === "eoa" && user?.solanaAddress;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <div className="bg-bg-main bg-cover bg-center bg-no-repeat h-[calc(100vh-4rem)]">
        <main className="container mx-auto px-4 py-8 h-full">
          {user ? (
            <div
              className={`grid gap-8 ${
                isExternalSolanaWallet
                  ? "md:grid-cols-1"
                  : "md:grid-cols-[1fr_2fr]"
              }`}
            >
              <div className="flex flex-col gap-8">
                <UserInfoCard />
                <SolanaActionsCard />
                <LearnMore />
              </div>
              {!isExternalSolanaWallet && <NftMintCard />}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full pb-[4rem]">
              <LoginCard />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

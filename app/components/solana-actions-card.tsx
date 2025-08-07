"use client";

import {
  useSolanaSignMessage,
  useSolanaTransaction,
  useUser,
} from "@account-kit/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useToast } from "../hooks/useToast";
import { Toast } from "@/components/ui/toast";
import { Wallet, MessageSquare } from "lucide-react";

export default function SolanaActionsCard() {
  const solTx = useSolanaTransaction({
    policyId: process.env.NEXT_PUBLIC_SOLANA_POLICY_ID,
  });
  const solMsg = useSolanaSignMessage({});
  const user = useUser();
  const { toast, setToast, hideToast } = useToast();

  // Only show this component if user is connected with an external Solana wallet
  if (!user || user.type !== "eoa" || !user.solanaAddress) return null;

  const solanaAddress = user.solanaAddress;

  const handleSendTransaction = async () => {
    try {
      const tx = await solTx.sendTransactionAsync({
        instructions: [
          SystemProgram.transfer({
            fromPubkey: new PublicKey(solanaAddress),
            toPubkey: new PublicKey(solanaAddress),
            lamports: 0, // transferring 0 lamports to self
          }),
        ],
      });
      console.log("Transaction sent! Hash:", tx.hash);
      setToast({
        text: `Transaction sent! Hash: ${tx.hash.slice(0, 8)}...`,
        type: "success",
        open: true,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      setToast({
        text: "Failed to send transaction. Please try again.",
        type: "error",
        open: true,
      });
    }
  };

  const handleSignMessage = async () => {
    try {
      const signature = await solMsg.signMessageAsync({
        message: "Hello from Solana dApp!",
      });

      setToast({
        text: `Message signed! Signature: ${signature.slice(0, 8)}...`,
        type: "success",
        open: true,
      });
    } catch (error) {
      console.error("Sign message error:", error);
      setToast({
        text: "Failed to sign message. Please try again.",
        type: "error",
        open: true,
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Solana Actions
          </CardTitle>
          <CardDescription>
            Sign messages and send sponsored transactions with your external
            Solana wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Button
              onClick={handleSignMessage}
              disabled={solMsg.isPending}
              variant="outline"
              className="w-full"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {solMsg.isPending ? "Signing..." : "Sign Message"}
            </Button>

            <Button
              onClick={handleSendTransaction}
              disabled={solTx.isPending}
              className="w-full"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {solTx.isPending ? "Sending..." : "Send Sponsored Transaction"}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>
              • Message signing is used for authentication and off-chain proofs
            </p>
            <p>• Sponsored transactions are gasless (0 lamports to self)</p>
            <p>
              • Connected with external Solana wallet:{" "}
              {solanaAddress.slice(0, 8)}...
            </p>
          </div>
        </CardContent>
      </Card>

      <Toast
        open={toast.open}
        text={toast.text}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
}

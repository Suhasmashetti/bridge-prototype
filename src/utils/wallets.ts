import { wormhole } from "@wormhole-foundation/sdk";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";
import { Connection, Keypair } from "@solana/web3.js";
import { Wallet, JsonRpcProvider } from "ethers";

export async function getSigners() {

  // 1. Solana signer
  const solSecret = Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY!));
  const solKeypair = Keypair.fromSecretKey(solSecret);
  const solConnection = new Connection(process.env.SOLANA_RPC!);

  // Wormhole instance for Testnet with Solana & EVM platforms
  const wh = await wormhole("Testnet", [solana, evm]);

  // Correct Solana signer (SDK typing workaround)
  const solanaPlatform = wh.getPlatform("Solana") as any;
  const sourceSigner = await solanaPlatform.getSigner(solConnection, solKeypair);


  // 2. EVM signer
  const evmProvider = new JsonRpcProvider(process.env.EVM_RPC!);
  const evmWallet = new Wallet(process.env.EVM_PRIVATE_KEY!, evmProvider);

  // Correct EVM signer (SDK typing workaround)
  const evmPlatform = wh.getPlatform("Evm") as any;
  const destinationSigner = await evmPlatform.getSigner(evmWallet);

  return { sourceSigner, destinationSigner };
}

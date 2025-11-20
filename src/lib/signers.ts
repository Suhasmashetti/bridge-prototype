import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";
import { Connection, Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import bs58 from "bs58";
import type { WalletSigners } from "../types/index.js";

/**
 * Creates and returns configured signers for both Solana and Ethereum
 */
export async function createSigners(): Promise<WalletSigners> {
    console.log("Setting up signers...");

    // -----------------------------
    //  SOLANA SETUP
    // -----------------------------
    const solSecret = Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY!));
    const solKeypair = Keypair.fromSecretKey(solSecret);
    const solConnection = new Connection(process.env.SOLANA_RPC!);

    // Convert to base58 for Wormhole signer
    const solSecretBase58 = bs58.encode(solKeypair.secretKey);

    // -----------------------------
    //  EVM SETUP (ethers v6)
    // -----------------------------
    const evmProvider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC!);

    // IMPORTANT: Use ethers.Wallet from v6
    const evmWallet = new ethers.Wallet(process.env.EVM_PRIVATE_KEY!, evmProvider);

    console.log("Getting platform modules...");
    const solanaModule = await solana();
    const evmModule = await evm();

    console.log("Creating signers...");

    // -----------------------------
    //  WORMHOLE SIGNER SETUP
    // -----------------------------

    // Solana Wormhole signer (requires base58 secret)
    const sourceSigner = await solanaModule.getSigner(solConnection, solSecretBase58);

    // EVM Wormhole signer (requires provider + private key)
    const destinationSigner = await evmModule.getSigner(evmProvider, process.env.EVM_PRIVATE_KEY!);

    console.log("Signers obtained successfully");
    console.log("Source signer address:", sourceSigner.address());
    console.log("Destination signer address:", await evmWallet.getAddress());

    return {
        sourceSigner,
        destinationSigner,
    };
}

/**
 * Get the Solana keypair for extra operations
 */
export function getSolanaKeypair(): Keypair {
    const solSecret = Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY!));
    return Keypair.fromSecretKey(solSecret);
}

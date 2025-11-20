import { wormhole } from "@wormhole-foundation/sdk";
import solana from "@wormhole-foundation/sdk/solana";
import evm from "@wormhole-foundation/sdk/evm";
import type { Config } from "../types/index.js";

/**
 * Creates a Wormhole instance with proper configuration
 */
export async function createWormholeInstance(config: Config) {
    console.log('Creating Wormhole instance...');
    
    const wh = await wormhole("Testnet", [solana, evm], {
        chains: {
            Solana: {
                rpc: config.rpc.solana
            },
            Ethereum: {
                rpc: config.rpc.evm
            }
        }
    });
    
    const srcChain = wh.getChain(config.chains.source as any);
    const dstChain = wh.getChain(config.chains.destination as any);
    
    console.log('Wormhole instance created successfully');
    
    return { wh, srcChain, dstChain };
}
import { Wormhole } from "@wormhole-foundation/sdk";

/**
 * Checks if a token is already wrapped on the destination chain
 */
export async function checkWrappedAsset(dstTb: any, token: any) {
    console.log('Checking for existing wrapped asset...');
    
    let wrapped;
    try {
        wrapped = await dstTb.getWrappedAsset(token);
        console.log('Wrapped asset check result:', wrapped);
    } catch (error: any) {
        // If we get a "could not decode result data" error with value "0x", it means no wrapped asset exists
        if (error.message?.includes('could not decode result data') && error.value === '0x') {
            console.log('✅ Token is not yet wrapped - proceeding with attestation');
            wrapped = null;
        } else {
            throw error; // Re-throw if it's a different error
        }
    }
    
    return wrapped;
}

/**
 * Creates a token ID from chain and mint address
 */
export function createTokenId(chain: any, tokenMint: string) {
    return Wormhole.tokenId(chain.chain, tokenMint);
}
import dotenv from 'dotenv';
import { CONFIG } from "../config/constants.ts";

// Load environment variables
dotenv.config();
import { createWormholeInstance } from "../lib/wormhole.ts";
import { createSigners } from "../lib/signers.ts";
import { createTokenId, checkWrappedAsset } from "../lib/token-utils.ts";
import { 
    createAttestation, 
    getVAA, 
    createWrappedToken, 
    verifyWrappedToken 
} from "../lib/attestation.ts";

async function attest() {
    try {
        console.log('🚀 Starting attestation process...');
        console.log('Token mint:', CONFIG.tokens.sourceMint);
        console.log('Source chain:', CONFIG.chains.source);
        console.log('Destination chain:', CONFIG.chains.destination);
        
        // Step 1: Create Wormhole instance and get chains
        const { wh, srcChain, dstChain } = await createWormholeInstance(CONFIG);
        console.log("srcChain info:", srcChain);

        // Step 2: Create signers
        const { sourceSigner, destinationSigner } = await createSigners();
        
        // Step 3: Create token ID and get token bridges
        const tokenMint = CONFIG.tokens.sourceMint;
        const token = createTokenId(srcChain, tokenMint);
        console.log(`Attesting token: ${tokenMint}...`);
        
        console.log('Getting token bridges...');
        const srcTb = await srcChain.getTokenBridge();
        const dstTb = await dstChain.getTokenBridge();
        console.log('Token bridges obtained');
        
        // Step 4: Check if token is already wrapped
        const wrapped = await checkWrappedAsset(dstTb, token);
        
        if (wrapped) {
            console.log(`✅ Token is already attested on ${dstChain.chain}. Address: ${wrapped}`);
            return;
        }
                console.log("helllodfljdshfj")        
        // Step 5: Create attestation on source chain
        const firstTxId = await createAttestation(srcChain, srcTb, token, sourceSigner);

        // Step 6: Get VAA from guardians
        const vaa = await getVAA(wh, firstTxId);
        
        // Step 7: Create wrapped token on destination
        await createWrappedToken(dstChain, dstTb, vaa, destinationSigner);
        
        // Step 8: Verify wrapped token creation
        const finalWrapped = await verifyWrappedToken(dstTb, token);
        
        console.log('🎉 Attestation process completed successfully!');
        console.log('🏆 Wrapped token address:', finalWrapped);
        
    } catch (error) {
        console.error('❌ Error during attestation process:', error);
        throw error;
    }
}

// Execute the attestation
attest().catch(console.error);
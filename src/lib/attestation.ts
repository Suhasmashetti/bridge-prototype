import { signSendWait } from "@wormhole-foundation/sdk";


export async function createAttestation(srcChain: any, srcTb: any, token: any, sourceSigner: any) {
    console.log("Creating attestation on source chain...");

    // Correct v2 API
    const attestTx = await srcTb.createAttestation(token, {
        payer: sourceSigner.address
    });

    console.log(`Attestation transaction created, signing...: ${attestTx}`);
    
    const txids = await signSendWait(srcChain, attestTx, sourceSigner);

    console.log("Source tx ids:", txids);

    if (!txids || !txids[0]) {
        throw new Error("No transaction id returned from attestation");
    }

    return txids[0];
}


/**
 * Waits for and retrieves the VAA (Verifiable Action Approval)
 */
export async function getVAA(wh: any, txId: any) {
    console.log("Waiting for VAA approved by the guardians...");
    console.log('Transaction ID:', txId.txid);
    
    const vaa = await wh.getVaa(txId.txid, "TokenBridge:AttestMeta", 60_000);
    
    if (!vaa) {
        throw new Error("VAA not found after attestation");
    }
    
    console.log('VAA retrieved successfully');
    return vaa;
}

/**
 * Creates the wrapped token on the destination chain
 */
export async function createWrappedToken(dstChain: any, dstTb: any, vaa: any, destinationSigner: any) {
    console.log('Creating wrapped token on destination...');
    
    const createWrappedTx = await dstTb.submitAttestation(vaa);
    console.log('Wrapped token transaction created, signing and sending...');
    
    const dstTxIds = await signSendWait(dstChain, createWrappedTx, destinationSigner);
    console.log('Destination transaction IDs:', dstTxIds);
    
    console.log('✅ Wrapped token created on destination!');
    
    return dstTxIds;
}

/**
 * Verifies the wrapped token was created successfully
 */
export async function verifyWrappedToken(dstTb: any, token: any) {
    console.log('Verifying wrapped token creation...');
    
    const finalWrapped = await dstTb.getWrappedAsset(token);
    console.log('Final wrapped token address:', finalWrapped);
    
    return finalWrapped;
}
import dotenv from 'dotenv';

dotenv.config();

export const CONFIG =  {
    chains: {
        source: "Solana",
        destination: "Ethereum"
    },
    rpc: {
        solana: process.env.SOLANA_RPC || "https://api.devnet.solana.com",
        evm: process.env.ETHEReum_RPC || "https://rpc.ankr.com/eth_sepoliad",
    },

    tokens: {
        sourceMint: process.env.SPL_TOKEN_MINT!,
    }
}
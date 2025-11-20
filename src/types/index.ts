export interface ChainConfig {
  source: string;
  destination: string;
}

export interface RpcConfig {
  solana: string;
  evm: string;
}

export interface TokenConfig {
  sourceMint: string;
}

export interface Config {
  chains: ChainConfig;
  rpc: RpcConfig;
  tokens: TokenConfig;
}

export interface WalletSigners {
  sourceSigner: any;
  destinationSigner: any;
}
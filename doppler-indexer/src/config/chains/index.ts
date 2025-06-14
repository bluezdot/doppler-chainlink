import { IndexerConfigs } from "./types";
import { mainnetConfig } from "./mainnet";
import { baseSepoliaConfig } from "./base";

export * from "./types";
export * from "./constants";

// Combined configuration object
export const chainConfigs: IndexerConfigs = {
    mainnet: mainnetConfig,
    baseSepolia: baseSepoliaConfig,
};

// Utility functions
export const getChainConfig = (network: keyof IndexerConfigs) => chainConfigs[network];

export const getChainById = (chainId: number) =>
    Object.values(chainConfigs).find(config => config.id === chainId);

export const getAllChainIds = () =>
    Object.values(chainConfigs).map(config => config.id);

export const getActiveChains = () =>
    Object.values(chainConfigs).filter(config =>
        config.addresses.shared.airlock !== "0x0000000000000000000000000000000000000000"
    );
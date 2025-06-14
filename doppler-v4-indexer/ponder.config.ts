import { createConfig, factory } from "ponder";
import { getAbiItem, http } from "viem";

import { airlockAbi, derc20Abi, poolManagerAbi } from "@app/abis";
import { addresses } from "@app/types";

const chainId = 84532;
const startingBlock = 11399810;

export default createConfig({
    database: {
        kind: 'postgres',
        connectionString: process.env.DATABASE_URL,
    },
    networks: {
        baseSepolia: {
            chainId: chainId,
            transport: http(process.env.RPC_BASE_SEPOLIA),
        },
    },
    contracts: {
        PoolManager: {
            abi: poolManagerAbi,
            network: "baseSepolia",
            address: factory({
                address: addresses.poolManager,
                event: getAbiItem({ abi: airlockAbi, name: "Create" }),
                parameter: "poolOrHook",
            }),
            startBlock: startingBlock,
        },
        DERC20: {
            abi: derc20Abi,
            network: "baseSepolia",
            address: factory({
                address: addresses.airlock,
                event: getAbiItem({ abi: airlockAbi, name: "Create" }),
                parameter: "asset",
            }),
            startBlock: startingBlock,
        },
        Airlock: {
            abi: airlockAbi,
            network: "baseSepolia",
            address: addresses.airlock,
            startBlock: startingBlock,
        },
    },
});

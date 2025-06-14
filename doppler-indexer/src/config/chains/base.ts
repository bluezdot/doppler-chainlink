import { Address } from "viem";
import { ChainConfig } from "./types";
import {
    CHAIN_IDS,
    START_BLOCKS,
    V4_START_BLOCKS,
    ORACLE_ADDRESSES,
    COMMON_ADDRESSES,
    RPC_ENV_VARS
} from "./constants";

export const baseSepoliaConfig: ChainConfig = {
    id: CHAIN_IDS.baseSepolia,
    name: "baseSepolia",
    startBlock: START_BLOCKS.baseSepolia,
    v4StartBlock: V4_START_BLOCKS.baseSepolia,
    oracleStartBlock: START_BLOCKS.mainnet,
    rpcEnvVar: RPC_ENV_VARS.baseSepolia,
    addresses: {
        v2: {
            factory: "0x7Ae58f10f7849cA6F5fB71b7f45CB416c9204b1e" as Address,
        },
        v3: {
            v3Initializer: "0xEB6E6Cd5858a87908B2914AE9CC7bbBE91e70067" as Address,
        },
        v4: {
            poolManager: "0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408" as Address,
            dopplerDeployer: "0x7980Be665C8011A413c598F82fa6f95feACa2e1e" as Address,
            v4Initializer2: COMMON_ADDRESSES.ZERO_ADDRESS,
            dopplerLens: "0x2f36392BfB0A9082b624Ed65f6059E586fB4C530" as Address,
            stateView: "0x571291b572ed32ce6751a2cb2486ebee8defb9b4" as Address,
            v4Initializer: "0x511b44b4cC8Cb80223F203E400309b010fEbFAec" as Address,
        },
        shared: {
            airlock: "0x7E6cF695a8BeA4b2bF94FbB5434a7da3f39A2f8D" as Address,
            tokenFactory: "0xAd62fc9eEbbDC2880c0d4499B0660928d13405cE" as Address,
            universalRouter: "0x95273d871c8156636e114b63797d78D7E1720d81" as Address,
            governanceFactory: "0xff02a43A90c25941f8c5f4917eaD79EB33C3011C" as Address,
            migrator: "0x8f4814999D2758ffA69689A37B0ce225C1eEcBFf" as Address,
            weth: COMMON_ADDRESSES.WETH_BASE,
        },
        oracle: ORACLE_ADDRESSES,
    },
};

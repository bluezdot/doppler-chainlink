import { Address, zeroAddress } from "viem";

export type Network =
    | "mainnet"
    | "baseSepolia";

export const CHAIN_IDS = {
    mainnet: 1,
    baseSepolia: 84532,
} as const;

const mainnetStartBlock = 21638492;

const baseSepoliaStartBlock = 27059000;
const v4BaseSepoliaStartBlock = 27059000;

export type IndexerConfigs = Record<Network, DopplerConfig>;

export type DopplerConfig = {
    v2: V2Addresses;
    v3: V3Addresses;
    v4: V4Addresses;
    shared: SharedAddresses;
    oracle: OracleAddresses;
    startBlock: number;
    v4StartBlock?: number;
    oracleStartBlock: number;
};

export type SharedAddresses = {
    airlock: Address;
    tokenFactory: Address;
    universalRouter: Address;
    governanceFactory: Address;
    migrator: Address;
    weth: Address;
};

export type V4Addresses = {
    dopplerDeployer: Address;
    stateView: Address;
    poolManager: Address;
    dopplerLens: Address;
    v4Initializer: Address;
    v4Initializer2: Address;
};

export type V3Addresses = {
    v3Initializer: Address;
};

export type V2Addresses = {
    factory: Address;
};

export type OracleAddresses = {
    mainnetEthUsdc: Address;
    weth: Address;
    usdc: Address;
    chainlinkEth: Address;
};

export const oracleAddresses: OracleAddresses = {
    mainnetEthUsdc: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640" as Address,
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address,
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address,
    chainlinkEth: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419" as Address,
};

export const configs: IndexerConfigs = {
    mainnet: {
        v2: {
            factory: zeroAddress as Address,
        },
        v3: {
            v3Initializer: zeroAddress as Address,
        },
        v4: {
            poolManager: zeroAddress as Address,
            dopplerDeployer: zeroAddress as Address,
            v4Initializer: zeroAddress as Address,
            stateView: zeroAddress as Address,
            dopplerLens: zeroAddress,
            v4Initializer2: zeroAddress,
        },
        shared: {
            airlock: zeroAddress as Address,
            tokenFactory: zeroAddress as Address,
            universalRouter: zeroAddress as Address,
            governanceFactory: zeroAddress as Address,
            migrator: zeroAddress as Address,
            weth: zeroAddress as Address,
        },
        oracle: oracleAddresses,
        startBlock: mainnetStartBlock,
        oracleStartBlock: mainnetStartBlock,
    },
    baseSepolia: {
        v2: {
            factory: "0x7Ae58f10f7849cA6F5fB71b7f45CB416c9204b1e" as Address,
        },
        v3: {
            v3Initializer: "0xEB6E6Cd5858a87908B2914AE9CC7bbBE91e70067" as Address,
        },
        v4: {
            poolManager: "0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408" as Address,
            dopplerDeployer: "0x7980Be665C8011A413c598F82fa6f95feACa2e1e" as Address,
            v4Initializer: zeroAddress,
            dopplerLens: "0x2f36392BfB0A9082b624Ed65f6059E586fB4C530" as Address,
            stateView: "0x571291b572ed32ce6751a2cb2486ebee8defb9b4" as Address,
            v4Initializer2: "0x511b44b4cC8Cb80223F203E400309b010fEbFAec" as Address,
        },
        shared: {
            airlock: "0x7E6cF695a8BeA4b2bF94FbB5434a7da3f39A2f8D" as Address,
            tokenFactory: "0xAd62fc9eEbbDC2880c0d4499B0660928d13405cE" as Address,
            universalRouter: "0x95273d871c8156636e114b63797d78D7E1720d81" as Address,
            governanceFactory:
                "0xff02a43A90c25941f8c5f4917eaD79EB33C3011C" as Address,
            migrator: "0x8f4814999D2758ffA69689A37B0ce225C1eEcBFf" as Address,
            weth: "0x4200000000000000000000000000000000000006" as Address,
        },
        oracle: oracleAddresses,
        startBlock: baseSepoliaStartBlock,
        v4StartBlock: v4BaseSepoliaStartBlock,
        oracleStartBlock: mainnetStartBlock,
    },
};

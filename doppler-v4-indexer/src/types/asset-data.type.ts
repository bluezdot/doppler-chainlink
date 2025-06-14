import {Hex} from "viem";

export interface AssetData {
    numeraire: Hex;
    timelock: Hex;
    governance: Hex;
    liquidityMigrator: Hex;
    poolInitializer: Hex;
    pool: Hex;
    migrationPool: Hex;
    numTokensToSell: bigint;
    totalSupply: bigint;
    integrator: Hex;
}

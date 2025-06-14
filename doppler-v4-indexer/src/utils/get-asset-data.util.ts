import {Address, Hex} from "viem";
import {Context} from "ponder:registry";
import {airlockAbi} from "@app/abis";

export interface AssetData {
    numeraire: Address;
    timelock: Address;
    governance: Address;
    liquidityMigrator: Address;
    poolInitializer: Address;
    pool: Address;
    migrationPool: Address;
    numTokensToSell: bigint;
    totalSupply: bigint;
    integrator: Address;
}

export const getAssetData = async (assetTokenAddr: Hex, context: Context): Promise<AssetData | null> => {
    try {
        const assetData = await context.client.readContract({
            abi: airlockAbi,
            address: context.contracts.Airlock.address,
            functionName: "getAssetData",
            args: [assetTokenAddr],
        });
        if (!assetData || assetData.length !== 10) {
            console.error(`Error reading asset data for ${assetTokenAddr}`);
            return null;
        }

        return {
            numeraire: assetData[0],
            timelock: assetData[1],
            governance: assetData[2],
            liquidityMigrator: assetData[3],
            poolInitializer: assetData[4],
            pool: assetData[5],
            migrationPool: assetData[6],
            numTokensToSell: BigInt(assetData[7]),
            totalSupply: BigInt(assetData[8]),
            integrator: assetData[9],
        }
    } catch(e){
        console.error(e);
        return null;
    }
}

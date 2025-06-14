import {encodePacked, Hex, keccak256} from "viem";
import {Context} from "ponder:registry";
import {dopplerAbi} from "@app/abis";

export const getPoolID = async (hookAddr: Hex, context: Context): Promise<Hex | null> => {
    try {
        const poolKey = await context.client.readContract({
            abi: dopplerAbi,
            address: hookAddr,
            functionName: "poolKey",
            args: [],
        });
        const tokenA = poolKey[0].toLowerCase() > poolKey[1].toLowerCase() ? poolKey[1] : poolKey[0];
        const tokenB = poolKey[0].toLowerCase() > poolKey[1].toLowerCase() ? poolKey[0] : poolKey[1];

        return keccak256(
            encodePacked(
                ['address', 'address', 'uint24', 'uint24', 'address'],
                [tokenA, tokenB, poolKey[2], poolKey[3], poolKey[4]]
            )
        );
    } catch(e){
        console.error(e);
        return null;
    }
}

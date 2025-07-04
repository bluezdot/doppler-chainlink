import { ponder } from "ponder:registry";
import { refreshActivePoolsBlob } from "./shared/scheduledJobs";
import { configs } from "addresses";
import { ChainlinkOracleABI } from "@app/abis/ChainlinkOracleABI";
import { ethPrice } from "ponder.schema";
import { refreshCheckpointBlob } from "./shared/entities/v4-entities/v4CheckpointBlob";


// Handler for baseSepolia network
ponder.on("MetricRefresherBaseSepolia:block", async ({ event, context }) => {
    const startTime = Date.now();

    try {
        // Execute optimized combined refresh job
        await refreshActivePoolsBlob({
            context,
            timestamp: Number(event.block.timestamp),
        });

        const duration = (Date.now() - startTime) / 1000;
    } catch (error) {
        console.error(`Error in baseSepolia refresh job: ${error}`);
        // Log error but don't throw to prevent handler from failing completely
    }
});

ponder.on("ChainlinkEthPriceFeed:block", async ({ event, context }) => {
    const { db, client, chain } = context;
    const { timestamp } = event.block;

    const latestAnswer = await client.readContract({
        abi: ChainlinkOracleABI,
        address: configs[chain?.name as keyof typeof configs].oracle.chainlinkEth,
        functionName: "latestAnswer",
    });

    const price = latestAnswer;

    const roundedTimestamp = BigInt(Math.floor(Number(timestamp) / 300) * 300);
    const adjustedTimestamp = roundedTimestamp + 300n;

    await db
        .insert(ethPrice)
        .values({
            timestamp: adjustedTimestamp,
            price,
        })
        .onConflictDoNothing();
});

ponder.on("BaseSepoliaV4PoolCheckpoints:block", async ({ event, context }) => {
    await refreshCheckpointBlob({
        context,
        timestamp: Number(event.block.timestamp),
    });
});

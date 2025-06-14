import { onchainTable, primaryKey, relations } from "ponder";

// TABLES
export const asset = onchainTable("assets", (t) => ({
    address: t.hex().primaryKey(),
    pool_address: t.hex().notNull(),
    pool_id: t.hex().notNull(),
    numeraire: t.hex().notNull(),
    num_tokens_to_sell: t.bigint().notNull(),
    timelock_address: t.hex().notNull(),
    governance_address: t.hex().notNull(),
    liquidity_migrator_address: t.hex().notNull(),
    pool_initializer_address: t.hex().notNull(),
    migration_pool_address: t.hex().notNull(),
    integrator_address: t.hex().notNull(),
    created_at: t.bigint().notNull(),
    migrated_at: t.bigint(),
}));

export const hourBucket = onchainTable("hour_buckets", (t) => ({
    id: t.text().primaryKey(),
    open: t.bigint().notNull(),
    close: t.bigint().notNull(),
    low: t.bigint().notNull(),
    high: t.bigint().notNull(),
    average: t.bigint().notNull(),
    count: t.integer().notNull(),
}));

export const module = onchainTable("modules", (t) => ({
    address: t.text().primaryKey(),
    state: t.integer().notNull(),
    last_updated_at: t.bigint().notNull(),
}));

export const pool = onchainTable("pools", (t) => ({
    address: t.hex().primaryKey(),
    tick: t.integer().notNull(),
    sqrt_price: t.bigint().notNull(),
    liquidity: t.bigint().notNull(),
    created_at: t.bigint().notNull(),
    asset: t.hex().notNull(),
    base_token: t.hex().notNull(),
    quote_token: t.hex().notNull(),
    price: t.bigint().notNull(),
    initializer: t.hex(),
}));

export const position = onchainTable("positions", (t) => ({
    id: t.text().primaryKey(),
    owner: t.text().notNull(),
    pool: t.hex().notNull(),
    tick_lower: t.integer().notNull(),
    tick_upper: t.integer().notNull(),
    liquidity: t.bigint().notNull(),
    created_at: t.bigint().notNull(),
}));

export const token = onchainTable("tokens", (t) => ({
    address: t.hex().primaryKey(),
    chain_id: t.bigint().notNull(),
    name: t.text().notNull(),
    symbol: t.text().notNull(),
    decimals: t.integer().notNull(),
    total_supply: t.bigint().notNull(),
    is_derc_20: t.boolean().notNull(),
    first_seen_at: t.bigint().notNull(),
}));

export const user = onchainTable("users", (t) => ({
    address: t.hex().primaryKey(),
    created_at: t.bigint().notNull(),
}));

export const userAsset = onchainTable(
    "user_assets",
    (t) => ({
        user_id: t.text().notNull(),
        asset_id: t.text().notNull(),
    }),
    (table) => ({
        pk: primaryKey({ columns: [table.user_id, table.asset_id] }),
    })
);

// RELATIONS

// Asset has one pool
export const assetRelations = relations(asset, ({ one, many }) => ({
    pool: one(pool, { fields: [asset.pool_address], references: [pool.address] }),
    userAssets: many(userAsset),
}));

// Pool have many positions
export const poolRelations = relations(pool, ({ one, many }) => ({
    positions: many(position),
    baseToken: one(token, {
        fields: [pool.base_token],
        references: [token.address],
    }),
    quoteToken: one(token, {
        fields: [pool.quote_token],
        references: [token.address],
    }),
    asset: one(asset, {
        fields: [pool.asset],
        references: [asset.address],
    }),
}));

// Position have one pool
export const positionRelations = relations(position, ({ one }) => ({
    pool: one(pool, { fields: [position.pool], references: [pool.address] }),
}));

// users have many assets and positions
export const userRelations = relations(user, ({ many }) => ({
    userAssets: many(userAsset),
}));

export const userAssetRelations = relations(userAsset, ({ one }) => ({
    user: one(user, { fields: [userAsset.user_id], references: [user.address] }),
    asset: one(asset, {
        fields: [userAsset.asset_id],
        references: [asset.address],
    }),
}));

# Doppler Router Utilities

Router implementation and permit signing utilities for Doppler protocol interactions.

## Installation

```bash
npm install doppler-router
```

## Usage

```typescript
import { CommandBuilder, getPermitSignature } from "doppler-router";

// Example permit signing
const permit = {
  details: {
    token: "0x...",
    amount: 100n,
    expiration: 3600n,
    nonce: 0n,
  },
  spender: "0x...",
  sigDeadline: Date.now() + 3600,
};

const signature = await getPermitSignature(
  permit,
  chainId,
  permit2Address,
  publicClient,
  walletClient
);
```

This project was created using `bun init` in bun v1.1.36. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

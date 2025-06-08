import { Address, Hex } from "viem";

const FEE_SIZE = 3;

const DEFAULT_FEE_TIER = "10000";

const FEE_TIER_MAP = {
  "3000": 3000,
  "10000": 10000,
};

export class SwapRouter02Encoder {
  encodePath(path: Address[], feeTier?: number): Hex {
    let encoded = "0x";
    for (let i = 0; i < path.length - 1; i++) {
      encoded += path[i].slice(2);
      const feeKey = (feeTier?.toString() ??
        DEFAULT_FEE_TIER) as keyof typeof FEE_TIER_MAP;
      encoded += FEE_TIER_MAP[feeKey].toString(16).padStart(2 * FEE_SIZE, "0");
    }
    encoded += path[path.length - 1].slice(2);

    return encoded.toLowerCase() as Hex;
  }

  encodePathExactInput(tokens: Address[]): Hex {
    return this.encodePath(tokens);
  }

  encodePathExactOutput(tokens: Address[]): Hex {
    return this.encodePath(tokens.slice().reverse());
  }
}

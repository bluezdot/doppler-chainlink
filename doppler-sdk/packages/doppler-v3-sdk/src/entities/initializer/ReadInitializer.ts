import {
  ReadContract,
  ReadAdapter,
  Drift,
  createDrift,
  FunctionReturn,
} from "@delvtech/drift";
import { Address } from "viem";
import { uniswapV3InitializerAbi } from "../../abis";

export type UniswapV3InitializerABI = typeof uniswapV3InitializerAbi;

export class ReadUniswapV3Initializer {
  initializer: ReadContract<UniswapV3InitializerABI>;

  constructor(address: Address, drift: Drift<ReadAdapter> = createDrift()) {
    this.initializer = drift.contract({
      abi: uniswapV3InitializerAbi,
      address,
    });
  }

  async getState(
    pool: Address
  ): Promise<FunctionReturn<UniswapV3InitializerABI, "getState">> {
    return this.initializer.read("getState", { pool });
  }
}

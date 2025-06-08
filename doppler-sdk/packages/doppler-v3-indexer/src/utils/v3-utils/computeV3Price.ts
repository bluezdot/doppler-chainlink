import { Q192 } from "@app/utils/constants";

export const computeV3Price = ({
  sqrtPriceX96,
  isToken0,
  decimals,
}: {
  sqrtPriceX96: bigint;
  isToken0: boolean;
  decimals: number;
}) => {
  const ratioX192 = sqrtPriceX96 * sqrtPriceX96;

  const baseTokenDecimalScale = 10 ** decimals;

  const price = isToken0
    ? (ratioX192 * BigInt(baseTokenDecimalScale)) / Q192
    : (Q192 * BigInt(baseTokenDecimalScale)) / ratioX192;

  return price;
};

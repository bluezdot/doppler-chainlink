export const formatBigIntToUsd = (value: bigint | string) => {
  return (Number(value) / 10 ** 18).toFixed(10);
};

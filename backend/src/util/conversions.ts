import { BigNumber } from "alchemy-sdk";

export function convertWeiToEth(wei: BigNumber | string | number) {
  return convertWithDecimals(Number(wei), 18);
}

export function convertWithDecimals(
  num: BigNumber | string | number | null,
  decimals: BigNumber | string | number | null
) {
  if (num == null || decimals == null) {
    return 0;
  }
  return Number(num) / Math.pow(10, Number(decimals));
}

import { BigNumber } from "alchemy-sdk";
import { convertWeiToEth, convertWithDecimals } from "./conversions";

describe("convertWeiToEth", () => {
  it("should correctly convert Wei to ETH", () => {
    expect(convertWeiToEth("1000000000000000000")).toBe(1);
    expect(convertWeiToEth(5000000000000000000)).toBe(5);
    expect(convertWeiToEth(BigNumber.from("2000000000000000000"))).toBe(2);
  });

  it("should return 0 for invalid inputs", () => {
    expect(convertWeiToEth(0)).toBe(0);
    expect(convertWeiToEth("0")).toBe(0);
  });
});

describe("convertWithDecimals", () => {
  it("should correctly convert with different decimals", () => {
    expect(convertWithDecimals("1000000", "6")).toBe(1);
    expect(convertWithDecimals(500000, 5)).toBe(5);
    expect(
      convertWithDecimals(BigNumber.from("200000000"), BigNumber.from(8))
    ).toBe(2);
  });

  it("should return 0 if num or decimals is null", () => {
    expect(convertWithDecimals(null, 6)).toBe(0);
    expect(convertWithDecimals("1000000", null)).toBe(0);
    expect(convertWithDecimals(null, null)).toBe(0);
  });

  it("should handle zero values correctly", () => {
    expect(convertWithDecimals(0, 18)).toBe(0);
    expect(convertWithDecimals("0", "6")).toBe(0);
  });
});

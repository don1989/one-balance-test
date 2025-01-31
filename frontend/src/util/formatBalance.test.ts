import { formatBalance } from "./formatBalance";

describe("formatBalance", () => {
  it("should format to 4 sig digits", () => {
    expect(formatBalance(123456.789876)).toEqual("123,456.7898");
    expect(formatBalance(0.0123456)).toEqual("0.01234");
    expect(formatBalance(0.0000123456)).toEqual("0.00001234");
  });
});

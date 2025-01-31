import { validateEthereumAddress } from "./validateEthereumAddress";

describe("validateEthereumAddress", () => {
  it("should return true for valid Ethereum addresses", () => {
    expect(
      validateEthereumAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
    ).toBe(true);
  });

  test("should return false for invalid Ethereum addresses", () => {
    expect(
      validateEthereumAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44")
    ).toBe(false); // Too short
    expect(
      validateEthereumAddress("742d35Cc6634C0532925a3b844Bc454e4438f44e")
    ).toBe(false); // Missing '0x'
    expect(
      validateEthereumAddress("0xG42d35Cc6634C0532925a3b844Bc454e4438f44e")
    ).toBe(false); // Invalid character 'G'
    expect(
      validateEthereumAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44eeee")
    ).toBe(false); // Too long
    expect(validateEthereumAddress("random-string")).toBe(false); // Random invalid string
  });
});

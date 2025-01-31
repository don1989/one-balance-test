export type Address = string; // 0xABC..., 0x123...
export type Token = string; // USDC, ETH, LINK

export type AddressTokenMap = Record<Address, Token>; // { 0xABC = USDC, 0x123 = LINK }
export type TokenBalanceMap = Record<string, number>; // { UDSC = 123.456, LINK = 567.890 }

const URL = process.env.BASE_URL || "http://localhost:3001";
const BALANCE_PATH = "api/balance";

const mockBalances = {
  ETH: 0.45,
  USDC: 7821.23,
  LINK: 1273,
};

export async function getBalance(
  address: string
): Promise<Record<string, string | number>> {
  // const url = `${URL}/${BALANCE_PATH}/${address}`;

  // const result = await (await fetch(url)).json();
  // return result;
  return mockBalances;
}

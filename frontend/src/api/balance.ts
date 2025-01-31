const URL = process.env.BASE_URL || "http://localhost:3001";
const BALANCE_PATH = "api/balance";

export async function getBalance(
  address: string
): Promise<Record<string, string | number>> {
  const url = `${URL}/${BALANCE_PATH}/${address}`;

  const response = await fetch(url);

  const data = await response.json();
  if (!response.ok) {
    throw data.error;
  } else {
    return data;
  }
}

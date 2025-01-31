"use client";

import { getBalance } from "@/api/balance";
import { ChangeEvent, FormEvent, useState } from "react";

/*
  - does api request to /api/balance
  - format the balances
*/

function validateEthereumAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const [balances, setBalances] = useState<Record<
    string,
    string | number
  > | null>(null);
  const [error, setError] = useState<string>();

  const handleAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setError("");
    setBalances(null);
    e.preventDefault();
    console.log("handle submit");

    if (!validateEthereumAddress(address)) {
      setError("Invalid Ethereum Address!");
      return;
    }

    getBalance(address)
      .then((data) => {
        setBalances(data);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const renderBalances = () => {
    if (!balances) {
      return null;
    }
    return Object.entries(balances).map(([key, value]) => (
      <div key={key} className="flex flex-row gap-8">
        <div className="w-12">{key}</div>
        <div>{value}</div>
      </div>
    ));
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-1/2">
        <div className="flex gap-4 items-center flex-col sm:flex-row w-full">
          <form className="w-full space-y-8" onSubmit={handleSubmit}>
            <div>
              <label className="mr-4" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                className="text-black w-full"
                type="text"
                value={address}
                onChange={handleAddress}
              />
            </div>
            <button
              className="border rounded-md p-2 hover:bg-blue-500"
              type="submit"
            >
              Submit
            </button>
            <div className="text-red-500">{error}</div>
            {balances && (
              <div>
                <div>Balances</div>
                {renderBalances()}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

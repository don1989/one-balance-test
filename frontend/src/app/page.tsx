"use client";

import { getBalance } from "@/api/balance";
import { BalanceList } from "@/components/BalanceList";
import { BalanceMap } from "@/util/types";
import { validateEthereumAddress } from "@/util/validateEthereumAddress";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const [balances, setBalances] = useState<BalanceMap | null>(null);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setError("");
    setBalances(null);
    e.preventDefault();

    if (!validateEthereumAddress(address)) {
      setError("Invalid Ethereum Address");
      return;
    }

    setLoading(true);
    getBalance(address)
      .then((data) => {
        setBalances(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text);
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  const handleClear = () => {
    setAddress("");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-1/2 border rounded-md p-8">
        <h1 className="text-2xl text-orange-500">Display your balances</h1>
        <div className="flex gap-4 items-center flex-col sm:flex-row w-full">
          <form className="w-full space-y-8" onSubmit={handleSubmit}>
            <div>
              <label className="mr-4 text-xl my-2" htmlFor="address">
                Address
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="address"
                  className="text-black w-full rounded-md py-2 px-2"
                  type="text"
                  value={address}
                  onChange={handleAddress}
                  placeholder="Enter a valid Ethereum address"
                />
                <button
                  type="button"
                  className="border rounded-md p-1.5 hover:bg-orange-500"
                  onClick={handlePaste}
                >
                  📋
                </button>
              </div>
              <div className="space-x-2">
                <button
                  className="border rounded-md p-2 mt-4 hover:bg-orange-500 w-32"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
                <button
                  className="border rounded-md p-2 mt-4 hover:bg-orange-500 w-32"
                  type="button"
                  disabled={loading}
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="text-red-500">{error}</div>
            {balances && <BalanceList balances={balances} />}
          </form>
        </div>
      </main>
    </div>
  );
}

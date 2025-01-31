import React from "react";

function BalanceCard({
  amount,
  name,
}: {
  amount: number | string;
  name: string;
}) {
  return (
    <div className="border-red-100 border rounded-md p-4 flex flex-col">
      <div>{name}</div>
      <div>{amount}</div>
    </div>
  );
}

export function BalanceList({
  balances,
}: {
  balances: Record<string, string | number>;
}) {
  return (
    <div>
      <div className="text-xl my-2">Balances</div>
      <div className="flex flex-col gap-8">
        {Object.entries(balances).map(([key, value]) => (
          <BalanceCard key={key} name={key} amount={value} />
        ))}
      </div>
    </div>
  );
}

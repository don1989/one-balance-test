import { formatBalance } from "@/util/formatBalance";
import { BalanceMap } from "@/util/types";
import React from "react";

interface BalanceCardProps {
  amount: number;
  name: string;
}
function BalanceCard({ amount, name }: BalanceCardProps) {
  return (
    <div className="border-red-100 border rounded-md p-4 flex flex-col">
      <div>{name}</div>
      <div>{formatBalance(amount)}</div>
    </div>
  );
}

interface BalanceListProps {
  balances: BalanceMap;
}
export function BalanceList({ balances }: BalanceListProps) {
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

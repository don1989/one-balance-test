import {
  Alchemy,
  Network,
  TokenBalance,
  TokenMetadataResponse,
} from "alchemy-sdk";
import { Address, Balances } from "../types";
import {
  NO_BALANCES_FOR_ADDRESS,
  RPC_ERROR,
  ALCHEMY_API_KEY_NOT_SET,
} from "../errors";

export class AlchemyService {
  alchemy: Alchemy;

  constructor(network: Network) {
    if (!process.env.ALCHEMY_API_KEY) {
      throw new Error(ALCHEMY_API_KEY_NOT_SET);
    }

    this.alchemy = new Alchemy({
      apiKey: process.env.ALCHEMY_API_KEY,
      network,
    });
  }

  public async fetchBalances(
    address: Address,
    tokenAddressMap: Record<string, string>
  ): Promise<Balances> {
    const tokenBalances = await this.fetchTokenBalances(
      address,
      tokenAddressMap
    );
    const metadata = await this.fetchTokenMetadata(tokenBalances);
    const balances = this.getBalancesFromTokenData(
      tokenBalances,
      metadata,
      tokenAddressMap
    );
    return balances;
  }

  private async fetchTokenBalances(
    address: Address,
    tokenAddressMap: Record<string, string>
  ): Promise<TokenBalance[]> {
    let resp;
    try {
      resp = await this.alchemy.core.getTokenBalances(
        address,
        Object.values(tokenAddressMap)
      );
    } catch (err) {
      console.error(err);
      throw new Error(RPC_ERROR);
    }

    if (resp.tokenBalances.length === 0) {
      throw new Error(NO_BALANCES_FOR_ADDRESS);
    }

    // Filter out any with errors
    const tokenBalances = resp.tokenBalances.filter(
      (b) => !b.error && b.tokenBalance && Number(b.tokenBalance) !== 0
    );

    if (tokenBalances.length === 0) {
      throw new Error(NO_BALANCES_FOR_ADDRESS);
    }

    return tokenBalances;
  }

  private async fetchTokenMetadata(tokenBalances: TokenBalance[]) {
    const metadata = await Promise.all(
      tokenBalances.map((b) => {
        return this.alchemy.core.getTokenMetadata(b.contractAddress);
      })
    );
    return metadata;
  }

  private getBalancesFromTokenData(
    tokenBalances: TokenBalance[],
    metadata: TokenMetadataResponse[],
    tokenAddressMap: Record<string, string>
  ) {
    const balances: Record<string, number> = {};
    for (let i = 0; i < tokenBalances.length; ++i) {
      const associatedMetadata = metadata[i];
      const value =
        Number(tokenBalances[i].tokenBalance) /
        Math.pow(10, Number(associatedMetadata.decimals));
      const key = Object.keys(tokenAddressMap).find((key: string) => {
        const typekey = key as keyof typeof tokenAddressMap;
        if (
          tokenAddressMap[typekey] ===
          tokenBalances[i].contractAddress.toLowerCase()
        ) {
          return key;
        }
      });

      if (!key) {
        continue;
      }
      balances[key] = value;
    }

    return balances;
  }
}

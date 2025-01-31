import {
  Alchemy,
  Network,
  TokenBalance,
  TokenMetadataResponse,
} from "alchemy-sdk";
import { Address, AddressTokenMap, TokenBalanceMap } from "../util/types";
import { RPC_ERROR, ALCHEMY_API_KEY_NOT_SET } from "../util/errors";

export class AlchemyService {
  private alchemy: Alchemy;

  constructor(apiKey: string | undefined, network: Network) {
    if (!apiKey) {
      throw new Error(ALCHEMY_API_KEY_NOT_SET);
    }

    this.alchemy = new Alchemy({
      apiKey,
      network,
    });
  }

  public async fetchBalances(
    address: Address,
    addressTokenMap: AddressTokenMap
  ): Promise<TokenBalanceMap> {
    const tokenBalances = await this.fetchTokenBalances(
      address,
      addressTokenMap
    );

    const metadata = await this.fetchTokenMetadata(tokenBalances);
    const balances = this.getBalancesFromTokenData(
      tokenBalances,
      metadata,
      addressTokenMap
    );
    return balances;
  }

  private async fetchTokenBalances(
    address: Address,
    addressTokenMap: AddressTokenMap
  ): Promise<TokenBalance[]> {
    let resp;
    try {
      resp = await this.alchemy.core.getTokenBalances(
        address,
        Object.keys(addressTokenMap)
      );
    } catch (err) {
      console.error(err);
      throw new Error(RPC_ERROR);
    }

    // Filter out any with errors
    const tokenBalances = resp.tokenBalances.filter(
      (b) => !b.error && b.tokenBalance && Number(b.tokenBalance) !== 0
    );

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
    addressTokenMap: AddressTokenMap
  ) {
    const balances: TokenBalanceMap = {};

    for (let i = 0; i < tokenBalances.length; ++i) {
      const tokenMetadata = metadata[i];
      const contractAddress = tokenBalances[i].contractAddress.toLowerCase();
      const key = addressTokenMap[contractAddress];
      if (key) {
        balances[key] =
          Number(tokenBalances[i].tokenBalance) /
          Math.pow(10, Number(tokenMetadata.decimals));
      }
    }

    return balances;
  }
}

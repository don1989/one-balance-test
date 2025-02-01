import {
  Alchemy,
  Network,
  TokenBalance,
  TokenMetadataResponse,
} from "alchemy-sdk";
import { Address, AddressTokenMap, TokenBalanceMap } from "../util/types";
import { RPC_ERROR, ALCHEMY_API_KEY_NOT_SET } from "../util/errors";
import { convertWeiToEth, convertWithDecimals } from "../util/conversions";

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
    const balances: TokenBalanceMap = {};

    // ETH balance
    const ethBalance = await this.fetchETHBalance(address);
    if (ethBalance) {
      balances["ETH"] = ethBalance;
    }

    // ERC20 token balances
    const tokenBalances = await this.fetchTokenBalances(
      address,
      addressTokenMap
    );

    return Object.assign(balances, tokenBalances);
  }

  private async fetchETHBalance(address: Address) {
    try {
      const ethBalance = await this.alchemy.core.getBalance(address);
      return convertWeiToEth(ethBalance);
    } catch (err) {
      console.error("Error fetching ETH balance:", err);
      throw new Error(RPC_ERROR);
    }
  }

  private async fetchTokenBalances(
    address: Address,
    addressTokenMap: AddressTokenMap
  ): Promise<TokenBalanceMap> {
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

    const metadata = await this.fetchTokenMetadata(tokenBalances);

    const finalBalances = this.computeTokenData(
      tokenBalances,
      metadata,
      addressTokenMap
    );

    return finalBalances;
  }

  private async fetchTokenMetadata(tokenBalances: TokenBalance[]) {
    const metadata = await Promise.all(
      tokenBalances.map((b) => {
        return this.alchemy.core.getTokenMetadata(b.contractAddress);
      })
    );
    return metadata;
  }

  private computeTokenData(
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
        balances[key] = convertWithDecimals(
          tokenBalances[i].tokenBalance,
          tokenMetadata.decimals
        );
      }
    }

    return balances;
  }
}

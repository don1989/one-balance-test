import { Network } from "alchemy-sdk";
import { INVALID_ETHEREUM_ADDRESS, NO_BALANCES_FOR_ADDRESS } from "./errors";
import { AlchemyService } from "./external/alchemyService";
import { Address, Balances } from "./types";

const tokenAddressMap = {
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  ETH: "0xc27bfee8e6a2937ef138f1170cdc1c337e2d7453",
  LINK: "0x514910771af9ca656af840dff83e8264ecf986ca",
};

const CACHE_EXPIRY = 60 * 1000;

export class BalanceService {
  cache: Map<Address, Balances>;
  alchemyService: AlchemyService;

  constructor() {
    this.cache = new Map();
    this.alchemyService = new AlchemyService(Network.ETH_MAINNET);
  }

  public async getBalances(address: Address) {
    if (!this.validateEthereumAddress(address)) {
      throw new Error(INVALID_ETHEREUM_ADDRESS);
    }

    let balances = undefined;
    if (address in this.cache) {
      balances = this.retrieveFromCache(address);
    }

    if (this.hasBalances(balances)) {
      return balances;
    }

    balances = await this.requestFromRPC(address);

    if (this.hasBalances(balances)) {
      this.storeInCache(address, balances);
      return balances;
    }

    throw new Error(NO_BALANCES_FOR_ADDRESS);
  }

  private async requestFromRPC(
    address: Address
  ): Promise<Balances | undefined> {
    const balances = await this.alchemyService.fetchBalances(
      address,
      tokenAddressMap
    );
    return balances;
  }

  private storeInCache(address: Address, balances: Balances | undefined) {
    if (!balances) {
      throw new Error(NO_BALANCES_FOR_ADDRESS);
    }

    this.cache.set(address, {
      ...balances,
      timestamp: Date.now(),
    });
  }

  private retrieveFromCache(address: Address): Balances | undefined {
    const cachedBalancesForAddress: Balances | undefined =
      this.cache.get(address);
    if (!cachedBalancesForAddress) {
      return undefined;
    }

    const timestamp = Number(cachedBalancesForAddress["timestamp"]);
    let balances: Balances = {};

    if (Date.now() < timestamp + CACHE_EXPIRY) {
      // Use the cached data
      const {
        timestamp, // Exclude the timestamp
        ...cachedBalances
      } = cachedBalancesForAddress;
      balances = cachedBalances;
    }

    return balances;
  }

  private hasBalances(balance: Balances | undefined) {
    if (!balance) {
      return false;
    }
    return Object.keys(balance).length > 0;
  }

  private validateEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}

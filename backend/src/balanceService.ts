import { Network } from "alchemy-sdk";
import {
  INVALID_ETHEREUM_ADDRESS,
  NO_BALANCES_FOR_ADDRESS,
} from "./util/errors";
import { AlchemyService } from "./external/alchemyService";
import { Address, TokenBalanceMap } from "./util/types";
import { Cache } from "./cache/cache";
import { ethAddressTokenMap } from "./util/addressTokenMap";
import { validateEthereumAddress } from "./util/validateEthereumAddress";

export class BalanceService {
  private cache: Cache<Address, TokenBalanceMap>;
  private alchemyService: AlchemyService;

  constructor() {
    this.cache = new Cache();
    this.alchemyService = new AlchemyService(
      process.env.ALCHEMY_API_KEY,
      Network.ETH_MAINNET
    );
  }

  public async getBalances(address: Address): Promise<TokenBalanceMap> {
    if (!validateEthereumAddress(address)) {
      throw new Error(INVALID_ETHEREUM_ADDRESS);
    }

    let balances = this.cache.retrieve(address);

    if (balances && this.hasBalances(balances)) {
      return balances;
    }

    balances = await this.requestFromRPC(address);

    if (balances && this.hasBalances(balances)) {
      this.cache.store(address, balances);
      return balances;
    }

    throw new Error(NO_BALANCES_FOR_ADDRESS);
  }

  private async requestFromRPC(
    address: Address
  ): Promise<TokenBalanceMap | undefined> {
    const balances = await this.alchemyService.fetchBalances(
      address,
      ethAddressTokenMap
    );
    return balances;
  }

  private hasBalances(balance: TokenBalanceMap | undefined): boolean {
    if (!balance) {
      return false;
    }
    return Object.keys(balance).length > 0;
  }
}

import { Network } from "alchemy-sdk";
import { BalanceService } from "./balanceService";
import { AlchemyService } from "./external/alchemyService";
import { Cache } from "./cache/cache";
import {
  INVALID_ETHEREUM_ADDRESS,
  NO_BALANCES_FOR_ADDRESS,
} from "./util/errors";

jest.mock("./external/alchemyService");
jest.mock("./cache/cache");

describe("Balance service", () => {
  let balanceService: BalanceService;
  let mockAlchemy: jest.Mocked<AlchemyService>;
  let mockCache: jest.Mocked<Cache<string, any>>;

  beforeEach(() => {
    balanceService = new BalanceService();
    mockAlchemy = new AlchemyService(
      "key",
      Network.ETH_MAINNET
    ) as jest.Mocked<AlchemyService>;
    mockCache = new Cache() as jest.Mocked<Cache<string, any>>;

    balanceService = new BalanceService();
    (balanceService as any).alchemyService = mockAlchemy;
    (balanceService as any).cache = mockCache;
  });

  it("should return balances from cache if available", async () => {
    const mockBalances = { USDC: 100 };
    mockCache.retrieve.mockReturnValue(mockBalances);

    const balances = await balanceService.getBalances(
      "0x1234567890abcdef1234567890abcdef12345678"
    );

    expect(balances).toEqual(mockBalances);
    expect(mockCache.retrieve).toHaveBeenCalledWith(
      "0x1234567890abcdef1234567890abcdef12345678"
    );
    expect(mockAlchemy.fetchBalances).not.toHaveBeenCalled();
  });

  it("should fetch balances from Alchemy if cache is empty", async () => {
    mockCache.retrieve.mockReturnValue(undefined);
    mockAlchemy.fetchBalances.mockResolvedValue({ USDC: 200 });

    const balances = await balanceService.getBalances(
      "0x1234567890abcdef1234567890abcdef12345678"
    );

    expect(balances).toEqual({ USDC: 200 });
    expect(mockCache.store).toHaveBeenCalledWith(
      "0x1234567890abcdef1234567890abcdef12345678",
      { USDC: 200 }
    );
  });

  it("should throw error for invalid Ethereum address", async () => {
    await expect(balanceService.getBalances("invalid-address")).rejects.toThrow(
      INVALID_ETHEREUM_ADDRESS
    );
  });

  it("should throw error when no balances are found", async () => {
    mockCache.retrieve.mockReturnValue(undefined);
    mockAlchemy.fetchBalances.mockResolvedValue({});

    await expect(
      balanceService.getBalances("0x1234567890abcdef1234567890abcdef12345678")
    ).rejects.toThrow(NO_BALANCES_FOR_ADDRESS);
  });
});

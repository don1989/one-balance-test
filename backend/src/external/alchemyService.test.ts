import { AlchemyService } from "./alchemyService";
import { Network, Alchemy } from "alchemy-sdk";

jest.mock("alchemy-sdk", () => {
  const mockAlchemyInstance = {
    core: {
      getTokenBalances: jest.fn(),
      getTokenMetadata: jest.fn(),
    },
  };

  return {
    Alchemy: jest.fn(() => mockAlchemyInstance),
    Network: {
      ETH_MAINNET: "eth-mainnet",
    },
  };
});

describe("Alchemy service", () => {
  let alchemyService: AlchemyService;
  let mockAlchemy: jest.MockedObjectDeep<Alchemy>;

  beforeEach(() => {
    alchemyService = new AlchemyService("fake-api-key", Network.ETH_MAINNET);
    mockAlchemy = (alchemyService as any)
      .alchemy as jest.MockedObjectDeep<Alchemy>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return balances successfully", async () => {
    const userAddress = "0x001";
    const tokenAddress = "0xdac";

    mockAlchemy.core.getTokenBalances.mockResolvedValue({
      address: userAddress,
      tokenBalances: [
        {
          contractAddress: tokenAddress,
          tokenBalance: "1000000000000000000", // 1 token (18 decimals)
          error: null,
        },
      ],
    });

    mockAlchemy.core.getTokenMetadata.mockResolvedValue({
      name: "name",
      symbol: "symbol",
      logo: "logo",
      decimals: 18,
    });

    const balances = await alchemyService.fetchBalances(userAddress, {
      [tokenAddress]: "USDC",
    });

    expect(balances).toEqual({
      USDC: 1,
    });

    expect(mockAlchemy.core.getTokenBalances).toHaveBeenCalledWith(
      userAddress,
      [tokenAddress]
    );
    expect(mockAlchemy.core.getTokenMetadata).toHaveBeenCalledWith(
      tokenAddress
    );
  });

  it("should return {} if user has no balances onchain", async () => {
    const userAddress = "0x001";
    const tokenAddress = "0xdac";

    mockAlchemy.core.getTokenBalances.mockResolvedValue({
      address: userAddress,
      tokenBalances: [],
    });

    const balances = await alchemyService.fetchBalances(userAddress, {
      [tokenAddress]: "USDC",
    });

    expect(balances).toEqual({});
  });

  it("should throw error if RPC throws error", async () => {
    const userAddress = "0x001";
    const tokenAddress = "0xdac";

    mockAlchemy.core.getTokenBalances.mockRejectedValue({
      error: "RPC error",
    });

    jest.spyOn(console, "error").mockImplementationOnce(() => {});

    expect(async () => {
      await alchemyService.fetchBalances(userAddress, {
        [tokenAddress]: "USDC",
      });
    }).rejects.toThrow("RPC Error");
  });
});

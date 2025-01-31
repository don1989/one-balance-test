import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { BalanceService } from "./balanceService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const balanceService = new BalanceService();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("One Balance Test server");
});

app.get("/api/balance/:address", async (req, res) => {
  try {
    const balances = await balanceService.getBalances(req.params.address);
    res.send(balances);
  } catch (error: unknown) {
    const errMsg = (error as any).message;
    res.status(400).json({ error: errMsg || "An unexpected error occurred." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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
  res.send("Express + TypeScript Server");
});

app.get("/api/balance/:address", async (req, res) => {
  const balances = await balanceService.getBalances(req.params.address);
  res.send(balances);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

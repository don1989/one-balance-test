# OneBalance Test

This is a test project for **OneBalance**, designed to fetch and display Ethereum balances (ETH and ERC-20 tokens) using **Alchemy API**.

---

## 🚀 Setup Instructions

### Clone the repository
```sh
git clone https://github.com/don1989/one-balance-test.git
cd one-balance-test
```

### **Backend**

```sh
cd backend
cp .env.example .env
npm install
npm run dev       # Run in development mode
```

or to build and run:

```sh
npm run build
npm start
```

The .env file contains a temporary Alchemy API key so you can easily test it.

This key will be deleted on 8-Feb-2025.

### **Frontend**

```sh
cd frontend
cp .env.example .env
npm install
npm run dev
```

The .env file contains BASE_URL, which should point to the local backend.

If not set, it defaults to http://localhost:3001.

### 🏗 How It Works

- Enter an Ethereum address.
- Use the Paste button for convenience.
- Click Submit to fetch the balances.
- The app displays ETH + ERC-20 token balances in separate cards.

### ✅ Tests & GitHub Workflows

- Jest tests included for backend services and frontend utilities.
- GitHub Actions CI/CD workflow runs tests on push and PRs.

### 🎨 Assumptions

- Dark theme used (consistent with OneBalance branding).
- Ethereum Mainnet only (which can be easily configurable by adjusting network settings).
- I considered that Snapshot tests and a separate IconButton component (for the paste button) were out of scope.
- No tests for index.ts (Express integration tests would require additional setup).

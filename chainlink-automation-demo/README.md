# Chainlink Automation Demo - Price Monitoring

Dự án demo sử dụng Chainlink Automation để tự động lấy giá ETH tại thời điểm cụ thể và sau 30 phút.

## Tính năng

- Tự động lấy giá ETH từ Chainlink Price Feed
- Lập lịch automation tại thời điểm cụ thể
- Lưu trữ lịch sử giá trong 30 phút
- Hỗ trợ nhiều network (Mainnet, Sepolia, Base, Base Sepolia)

## Cài đặt

1. Clone repository và cài đặt dependencies:
```bash
cd chainlink-automation-demo
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cấu hình environment variables trong file `.env`:
```env
# Private key của wallet (không có 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR-PROJECT-ID
BASE_RPC_URL=https://mainnet.base.org

# API Keys cho verification
ETHERSCAN_API_KEY=your_etherscan_api_key
BASESCAN_API_KEY=your_basescan_api_key

# Contract address sau khi deploy (sẽ được set sau khi chạy deploy script)
CONTRACT_ADDRESS=0x...
```

## Sử dụng

### 1. Compile Contracts
```bash
npm run compile
```

### 2. Deploy Contract
```bash
# Deploy lên Sepolia testnet
npx hardhat run scripts/deploy.ts --network sepolia

# Deploy lên Base Sepolia
npx hardhat run scripts/deploy.ts --network baseSepolia
```

### 3. Đăng ký Automation
Sau khi deploy, copy contract address và set vào `.env`:
```env
CONTRACT_ADDRESS=0x... # Address từ bước deploy
```

Sau đó đăng ký automation:
```bash
npm run register
```

**Lưu ý**: Bạn cần có LINK token để đăng ký automation:
- Sepolia: https://faucets.chain.link/sepolia
- Base Sepolia: Sử dụng Sepolia LINK

### 4. Bắt đầu Automation
```bash
npm run start-automation
```

## Cách hoạt động

1. **Contract PriceAutomation**: Smart contract implement Chainlink Automation interface
2. **checkUpkeep()**: Kiểm tra có cần thực hiện automation không
3. **performUpkeep()**: Thực hiện lấy giá và lưu vào storage
4. **Chainlink Automation Network**: Tự động gọi các function trên theo lịch trình

## Cấu trúc Contract

### PriceAutomation.sol
- `startAutomation(uint256 _startTime)`: Bắt đầu automation
- `checkUpkeep()`: Kiểm tra điều kiện thực hiện
- `performUpkeep()`: Thực hiện lấy giá
- `getLatestPrice()`: Lấy giá hiện tại
- `getAllPrices()`: Lấy tất cả giá đã lưu

## Networks được hỗ trợ

| Network | Chain ID | Price Feed | Registry |
|---------|----------|------------|----------|
| Mainnet | 1 | ETH/USD | Mainnet Registry |
| Sepolia | 11155111 | ETH/USD | Sepolia Registry |
| Base | 8453 | WETH | Mainnet Registry |
| Base Sepolia | 84532 | WETH | Sepolia Registry |

## Scripts

- `npm run compile`: Compile contracts
- `npm run deploy`: Deploy contract
- `npm run register`: Đăng ký automation
- `npm run start-automation`: Bắt đầu automation

## Monitoring

Sau khi automation được đăng ký, bạn có thể:

1. Theo dõi trên Chainlink Automation UI
2. Kiểm tra events trong contract
3. Gọi `getAllPrices()` để xem lịch sử giá

## Troubleshooting

### Không đủ LINK
```bash
# Lấy testnet LINK từ faucet
# Sepolia: https://faucets.chain.link/sepolia
```

### Contract verification failed
- Kiểm tra API key trong `.env`
- Đợi ít nhất 6 block confirmations trước khi verify

### Automation không chạy
- Kiểm tra balance LINK trong registry
- Kiểm tra gas limit có đủ không
- Xem logs trong Chainlink Automation UI

## Liên kết hữu ích

- [Chainlink Automation Documentation](https://docs.chain.link/chainlink-automation)
- [Chainlink Price Feeds](https://docs.chain.link/data-feeds/price-feeds)
- [Hardhat Documentation](https://hardhat.org/docs)

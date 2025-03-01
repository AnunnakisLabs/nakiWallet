# Naki Wallet


## Overview

Naki Wallet is a mobile-first crypto wallet application built on the Base blockchain ecosystem, designed to simplify cryptocurrency transactions for everyday users. It combines the security and decentralization of blockchain with the user experience of traditional payment apps. The application focuses on USDC stablecoin transactions, making it accessible for those who want to use cryptocurrency without worrying about price volatility.

## Key Features

- **Simple User Authentication**: Email login with OTP verification, plus social authentication options (Google, Apple)
- **Embedded Crypto Wallet**: Automatic wallet creation and management via Privy SDK
- **Peer-to-Peer Payments**: Easily send and request money from contacts
- **Multiple Funding Options**: Add funds via debit cards, bank transfers, PayPal, or cryptocurrency
- **Transaction History**: Track and monitor all your financial activities
- **QR Code & NFC Support**: Scan to pay functionality for quick transactions
- **Social Features**: Connect with friends and view their profiles

## Tech Stack

- **Frontend**: React Native with Expo
- **UI Framework**: NativeWind (Tailwind CSS for React Native) with Gluestack UI
- **Navigation**: Expo Router
- **Blockchain Integration**: Privy SDK for wallet management
- **Styling**: CSS-in-JS with styled-components
- **Authentication**: Privy SDK with passkey support
- **Network**: Base Testnet (for development/hackathon)

## Installation

### Prerequisites

- Node.js (v18 or later)
- npm or [bun](https://bun.sh) package manager
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/your-username/AnunnakisLabs/nakiWallet.git
cd nakiWallet
```

2. **Install dependencies**

Using npm:
```bash
npm install
```

Or using bun:
```bash
bun install
```

3. **Configure your environment**

Create a Privy account at [dashboard.privy.io](https://dashboard.privy.io) and set up an app client.

Update the `app.config.ts` file with your credentials:

```typescript
// in app.config.ts
extra: {
  privyAppId: "YOUR_PRIVY_APP_ID",
  privyClientId: "YOUR_PRIVY_CLIENT_ID",
},
```

4. **Configure your application identifiers**

Update your bundle identifiers/package names in `app.config.ts`:

```typescript
ios: {
  bundleIdentifier: "com.yourcompany.nakiwallet"
},
android: {
  package: "com.yourcompany.nakiwallet"
},
```

5. **Run the application**

For Expo Go (quick development):
```bash
npx expo start
```

For iOS:
```bash
npx expo run:ios
```

For Android:
```bash
npx expo run:android
```

## Project Structure

```
naki/
├── app/                          # Main application screens
│   ├── (tabs)/                   # Tab-based navigation screens
│   ├── _layout.tsx               # Root layout with authentication
│   └── [various screen files]    # Individual screens
├── assets/images/                # App icons and images
├── components/                   # Reusable UI components
│   ├── gluestack-ui/             # UI framework components
│   └── [various components]      # Custom components
├── hooks/                        # Custom React hooks
│   └── useBlockchain.ts          # Blockchain interaction hook
├── constants/                    # App constants
├── app.config.ts                 # Expo configuration
├── babel.config.js               # Babel configuration
├── global.css                    # Global CSS styles
├── tailwind.config.js            # Tailwind CSS configuration
└── package.json                  # Project dependencies
```

## Blockchain Integration

Naki Wallet integrates with the Base Testnet blockchain through the Privy SDK. The implementation includes:

- Automatic wallet creation for new users
- USDC token transfers between wallets
- Balance monitoring and transaction history
- Simulated blockchain transactions for development/testing

### Base Testnet Configuration

The application is pre-configured to use Base Testnet with the following parameters:

```
Chain ID: 0x14a33 (84531 in decimal)
RPC URL: https://goerli.base.org
```

## Development Notes

- **For Hackathon/Demo Mode**: Some functionality (particularly blockchain interactions) is simulated for demonstration purposes using SecureStore for persistent state.
- **UX Priority**: The app is designed with mobile-first principles, focusing on intuitive user experience.
- **Expo Modules**: The project uses several Expo packages that may require additional setup for ejected applications.

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- Privy SDK for wallet and authentication services
- Base for blockchain infrastructure
- Expo team for the development framework
- Gluestack UI for component library
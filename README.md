# Ethereum Bridge Transaction Tool (zkSync-Starknet)

This project provides a simple command line tool to make transactions through Ethereum layer 2 scaling solutions, zkSync and StarkNet, using flashbots. The tool is developed using Node.js and ethers.js library.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine
- NPM or Yarn installed on your local machine
- An understanding of Ethereum transactions, layer 2 solutions (zkSync and StarkNet), and the flashbots.

## Installation

1. Clone the repo:

```
git clone https://github.com/codeesura/ethereum-bridge-transaction-tool-zksync-starknet.git
```

2. Navigate to the project directory:

```
cd ethereum-bridge-transaction-tool
```

3. Install the dependencies:

```
npm install
```
or 
```
yarn install
```

## Usage

To use this tool, follow these steps:

1. Configure your .env file:

Before running the script, you need to configure your .env file with the necessary keys. The .env file should include your PRIVATE_KEY and STARKNET_WALLET_ADDRESS. Be sure to replace the placeholders with your actual private key and wallet address.

Your .env file should look something like this:
```
PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"
STARKNET_WALLET_ADDRESS="BRAVOS_OR_ARGENT_WALLET_ADDRESS"
```
Note: Never share your private keys. The PRIVATE_KEY is sensitive data and should be kept confidential. Be cautious where and how you store this information.

2. Run the main function:

```
node main.js
```

3. The tool will ask which bridge you would like to use. Enter `zksync` for ZK Sync and `starknet` for StarkNet.

4. Enter the amount of ETH for the transaction (decimal values should be separated with a dot).

5. The script will then attempt to create a transaction using the chosen bridge and ETH amount. It will calculate the gas price and send the transaction bundle using Flashbots.

6. You will receive a response about the transaction status.

## Functionality

This tool makes it easy to interact with Ethereum layer 2 solutions by abstracting away many of the complexities involved in creating and signing transactions. The user simply needs to choose the layer 2 solution and enter the desired transaction amount. The tool then handles all the necessary steps to create, sign, and send the transaction bundle.

Please note that this script is an example and might need adjustments according to your specific requirements, such as adding error handling, user input validation, etc.

## Contributing

If you want to contribute to this project, please submit a pull request with your changes.

## License

This project uses the [MIT License](https://github.com/codeesura/Ethereum-Bridge-Transaction-Tool-zkSync-Starknet/blob/main/LICENSE).

## Contact

If you want to contact me, you can reach out at [codeesura@gmail.com](mailto:codeesura@gmail.com).

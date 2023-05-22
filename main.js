const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const fs = require('fs');
require('dotenv').config()
const chalk = require('chalk');
const { ethers } = require("ethers");
const { FlashbotsBundleProvider, FlashbotsBundleResolution} = require("@flashbots/ethers-provider-bundle");

const addresses = {
    'zkSyncBridgeAddress': '0x32400084c286cf3e17e7b677ea9583e60a000324',
    'StarknetBridgeAddress': '0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419'
};
const abiData = JSON.parse(fs.readFileSync('./ABI/abi_data.json', 'utf8'));

const CHAIN_ID = 1;
const provider = new ethers.providers.JsonRpcProvider('https://ethereum.publicnode.com');
const PrivateKey_ = process.env.PRIVATE_KEY;
const Wallet_ = new ethers.Wallet(PrivateKey_,provider);
const zkSyncBridgeContract_ABI = abiData.zkSyncBridgeContract_ABI;
const StarknetBridgeContract_ABI = abiData.StarknetBridgeContract_ABI;
const zkSyncBridgeInterface = new ethers.utils.Interface(zkSyncBridgeContract_ABI);
const StarknetBridgeInterface = new ethers.utils.Interface(StarknetBridgeContract_ABI);
const hexValue = process.env.STARKNET_WALLET_ADDRESS;
const Starknet_Wallet = ethers.BigNumber.from(hexValue);

async function main() {
  // console clear
  process.stdout.write('\033c');

  readline.question(chalk.cyan("✨ Which bridge would you like to use? (zksync/starknet) ✨"), async bridge => {
    if (bridge !== 'zksync' && bridge !== 'starknet') {
      console.error('Invalid bridge. Please enter either "zksync" or "starknet".');
      readline.close();
      return;
    }

    readline.question(chalk.cyan("✨ Enter the amount of ETH for the transaction (separate decimals with a dot) ✨"), async value_ETH_str => {
      let value_ETH;
      try {
          value_ETH = ethers.utils.parseEther(value_ETH_str);
      } catch (error) {
          console.error('Invalid ETH value. Please enter a valid number.');
          readline.close();
          return;
      }  
      const flashbotsProvider = await FlashbotsBundleProvider.create(provider, ethers.Wallet.createRandom())
      
      provider.on('block', async (blockNumber) => {
        const gasPrice = await provider.getGasPrice();
        const gasPriceDecimal = ((parseInt(gasPrice.toString()) / 1000000000) + 0.85).toFixed(8);
        if (bridge === 'zksync') {
          try {
            const bundle_zksync = [
            {
              transaction: {
                  chainId: CHAIN_ID,
                  to:addresses.zkSyncBridgeAddress,
                  value:value_ETH,
                  data: zkSyncBridgeInterface.encodeFunctionData("requestL2Transaction",[
                      Wallet_.address,
                      value_ETH,
                      '0x00',
                      750150,
                      800,
                      [],
                      Wallet_.address
                  ]),
                  type: 2,
                  gasLimit: 149210,
                  maxFeePerGas: ethers.utils.parseUnits(gasPriceDecimal.toString(), 'gwei'),
                  maxPriorityFeePerGas: ethers.utils.parseUnits(gasPriceDecimal.toString(), 'gwei'),
              },
              signer: Wallet_ 
            }]
            const flashbotsTransactionResponse = await flashbotsProvider.sendBundle(
                bundle_zksync,
                blockNumber + 1,
                );
            const resolution = await flashbotsTransactionResponse.wait();
            console.log(await flashbotsTransactionResponse.simulate());
            
            if (resolution === FlashbotsBundleResolution.BundleIncluded) {
              console.log(`Congrats, included in ${blockNumber + 1}`);
              process.exit(0);
            }

            if ('error' in flashbotsTransactionResponse) {
                console.warn(flashbotsTransactionResponse.error.message)
                return;
            }        
            
            } catch (error) {
                return;
            }
        } else if (bridge === 'starknet') {
            try {
              const bundle_Starknet = [
                  {
                    transaction: {
                        chainId: CHAIN_ID,
                        to:addresses.StarknetBridgeAddress,
                        value:((value_ETH).add(ethers.utils.parseUnits('1', 'wei'))), // less fee bug !! 
                        data: StarknetBridgeInterface.encodeFunctionData("deposit(uint256,uint256)",[
                            value_ETH,
                            Starknet_Wallet.toString()
                        ]),
                        type: 2,
                        gasLimit: 150000,
                        maxFeePerGas: ethers.utils.parseUnits(gasPriceDecimal.toString(), 'gwei'),
                        maxPriorityFeePerGas: ethers.utils.parseUnits(gasPriceDecimal.toString(), 'gwei'),
                    },
                    signer: Wallet_ 
                  }]     
              const flashbotsTransactionResponse = await flashbotsProvider.sendBundle(
                  bundle_Starknet,
                  blockNumber + 1,
                  );
              const resolution = await flashbotsTransactionResponse.wait();
              console.log(await flashbotsTransactionResponse.simulate());
              
              if (resolution === FlashbotsBundleResolution.BundleIncluded) {
                console.log(`Congrats, included in ${blockNumber + 1}`);
                process.exit(0);
              }
  
              if ('error' in flashbotsTransactionResponse) {
                  console.warn(flashbotsTransactionResponse.error.message)
                  return;
              }        
              
              } catch (error) {
                  return;
              }
          }
          })

          readline.close();
      });
  });
}

main();

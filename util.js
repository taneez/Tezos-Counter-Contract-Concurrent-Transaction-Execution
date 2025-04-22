import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";

// Initialize Tezos toolkit
const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com'); // Use Ghostnet for testing

// Set up signer (replace with your private key)
// const signer = new InMemorySigner('edskRePAsioRSbCQViCVmYezvCXpnseh5zq5wXTnK7Mp8Vy734g5xnjaCWHDaYJdh6ixgiYrq3db9qCCU17nPwarG5mru8gt5K');
// Tezos.setProvider({ signer });

const contractAddress = 'KT1KAUbe1gsdw5BeVQfgjh9xZFrHrKVs8ApD';

async function increment(value, signer) {
  try {
    Tezos.setProvider({ signer });
    const contract = await Tezos.contract.at(contractAddress);
    console.log(`Incrementing storage value by ${value}...`);
    const op = await contract.methodsObject.increment(value).send();
    console.log(`Waiting for ${op.hash} to be confirmed...`);
    await op.confirmation(3);
    console.log(`Operation injected: https://ghost.tzstats.com/${op.hash}`);
  } catch (error) {
    console.log(`Error: ${JSON.stringify(error, null, 2)}`);
    console.log('Error occurred, retrying after 1 seconds...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return increment(value);
    // console.log(`Error: ${JSON.stringify(error, null, 2)}`);
  }
}

// Function to get the stored value from the contract
async function getStoredValue(signer) {
  try {
    // Load the contract
    Tezos.setProvider({ signer });
    const contract = await Tezos.wallet.at(contractAddress);

    // Get the storage
    const storage = await contract.storage();
    console.log(`Stored value: ${storage}`);
  } catch (error) {
    console.error('Error getting stored value:', error);
  }
}

export { increment, getStoredValue };
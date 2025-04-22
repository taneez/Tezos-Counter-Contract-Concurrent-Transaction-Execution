import { threadId } from "worker_threads";
import os from "os";
import { getStoredValue } from "./util.js";
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import {accounts} from "./constants.js";

export default async ({ data }) => {
  // Get the CPU core being used
  const coreId = threadId % os.cpus().length;
  
  console.log(`Worker ${threadId} is running on CPU core ${coreId}`);

  // Select an account based on threadId (modulo to wrap around if more threads than accounts)
  const account = accounts[threadId % accounts.length];
  // Initialize signer
  // const signer = new InMemorySigner('edskRePAsioRSbCQViCVmYezvCXpnseh5zq5wXTnK7Mp8Vy734g5xnjaCWHDaYJdh6ixgiYrq3db9qCCU17nPwarG5mru8gt5K');
  // Initialize signer
  const signer = new InMemorySigner(account.private_key);
  // Simulate a time-consuming task
  let result = 0;
  for (let i = 0; i < data; i++) {
    await getStoredValue(signer); // Call getStoredValue asynchronously
    result += 1;
  }

  return result;
};

// export default2 async ({ data }) => {
//   // Get the CPU core being used
//   const coreId = threadId % os.cpus().length;
  
//   console.log(`Worker ${threadId} is running on CPU core ${coreId}`);

//   // Simulate a time-consuming task
//   let result = 0;
//   for (let i = 0; i < data; i++) {
//     await increment(1); 
//     result += 1;
//   }

//   return result;
// };



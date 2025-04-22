import { threadId } from "worker_threads";
import os from "os";
import { getStoredValue, increment } from "./util.js";
import {accounts} from "./constants.js";
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";

export default async ({ data }) => {
  // Get the CPU core being used
  const coreId = threadId % os.cpus().length;
  
  console.log(`Worker ${threadId} is running on CPU core ${coreId}`);

  // Select an account based on threadId (modulo to wrap around if more threads than accounts)
  const account = accounts[threadId % accounts.length];
  // Initialize signer
  const signer = new InMemorySigner(account.private_key);
  console.log(`data ${data}`);
  // Simulate a time-consuming task
  let result = 0;
  for (let i = 1; i <= data; i++) {
    if (i % 5 === 0) {
      // await increment(1, signer); // 20% write
      await getStoredValue(signer); 
      console.log(` READ ${i}`);
    }
    else{
        await increment(1, signer); 
        // await getStoredValue(signer); // 80% read
    }
    result += 1;
  }

  return result;
};
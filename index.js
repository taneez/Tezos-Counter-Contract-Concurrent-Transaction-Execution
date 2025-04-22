import Piscina from "piscina";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { performance } from "perf_hooks"; // For high-resolution timing
import fs from "fs";

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Create a thread pool
const pool = new Piscina({
  filename: new URL("./worker8020.js", import.meta.url).pathname,
});

// Function to append data to a CSV file
function appendToCSV(n, threads, timeTaken) {
  const csvFilePath = "results.csv";
  const header = "transactions,threads,time_taken\n"; // CSV header
  const row = `${n},${threads},${timeTaken.toFixed(2)}\n`; // CSV row

  // Check if the file exists
  if (!fs.existsSync(csvFilePath)) {
    // If the file doesn't exist, create it and add the header
    fs.writeFileSync(csvFilePath, header);
  }

  // Append the row to the CSV file
  fs.appendFileSync(csvFilePath, row);
}

// Main function to run tasks in parallel
async function main(n, threads) {
  const tasks = Array(threads).fill(Math.floor(n / threads));
  for (let i = 0; i < n % threads; i++) {
      tasks[i] += 1; // Distribute the remainder
  }

  console.log(`tasks: ${tasks}`);

  // Start timing
  const startTime = performance.now();

  try {
    // Run tasks in parallel using the thread pool
    const results = await Promise.all(
      tasks.map((task) => pool.run({ data: task }))
    );

    // End timing
    const endTime = performance.now();

    const totalTime = (endTime - startTime) / 1000; // Convert to seconds

    console.log("Results:", results);
    console.log(`Total time taken: ${totalTime.toFixed(2)} seconds`);

    // Append the data to the CSV file
    appendToCSV(n, threads, totalTime);
  } catch (error) {
    console.error("Error:", error);
  }
}

// for (let i = 1; i <= 1; i++) {
//   await main(1000, 64);
// }

// for (let i = 1; i <= 1; i++) {
//   await main(1000, 32);
// }

// for (let i = 1; i <= 1; i++) {
//   await main(1000, 16);
// }

// for (let i = 1; i <= 1; i++) {
//   await main(1000, 8);
// }

// for (let i = 1; i <= 1; i++) {
//   await main(1000, 4);
// }

// for (let i = 1; i <= 1; i++) {
//   await main(1000, 2);
// }

// for (let i = 1; i <= 1; i++) {
//   await main(1000, 1);
// }

main(1000,32);
// main(1, 1);

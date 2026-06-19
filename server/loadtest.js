/**
 * loadtest.js
 * Simple load test script using Node.js built-in http module.
 * Fires concurrent requests and measures latency metrics.
 *
 * Usage: node loadtest.js [url] [concurrency]
 * Example: node loadtest.js http://localhost:8000/users/doctors 4000
 */
const http = require("http");
const url = require("url");

const TARGET_URL = process.argv[2] || "http://localhost:8000/users/doctors";
const CONCURRENCY = parseInt(process.argv[3] || "4000", 10);


const parsed = new URL(TARGET_URL);
const options = {
  hostname: parsed.hostname,
  port: parsed.port || 80,
  path: parsed.pathname + parsed.search,
  method: "GET",
  headers: {
    "Accept": "application/json",
    "Connection": "keep-alive",
  },
};

const latencies = [];
let successes = 0;
let failures = 0;
let completed = 0;

const startTime = Date.now();

function makeRequest(index) {
  return new Promise((resolve) => {
    const reqStart = Date.now();

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        const latency = Date.now() - reqStart;
        latencies.push(latency);

        if (res.statusCode >= 200 && res.statusCode < 400) {
          successes++;
        } else {
          failures++;
        }
        completed++;
        printProgress();
        resolve();
      });
    });

    req.on("error", (err) => {
      const latency = Date.now() - reqStart;
      latencies.push(latency);
      failures++;
      completed++;
      printProgress();
      resolve();
    });

    req.setTimeout(30000, () => {
      req.destroy();
      failures++;
      completed++;
      latencies.push(30000);
      printProgress();
      resolve();
    });

    req.end();
  });
}

function printProgress() {
  if (completed % Math.max(1, Math.floor(CONCURRENCY / 20)) === 0 || completed === CONCURRENCY) {
    const pct = ((completed / CONCURRENCY) * 100).toFixed(0);
    process.stdout.write(`\r   Progress: ${completed}/${CONCURRENCY} (${pct}%) | ✅ ${successes} | ❌ ${failures}`);
  }
}

function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function runLoadTest() {
  console.log(` Firing ${CONCURRENCY} concurrent requests...\n`);

  // Fire all requests concurrently
  const promises = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    promises.push(makeRequest(i));
  }

  await Promise.all(promises);

  const totalTime = Date.now() - startTime;
  const rps = (CONCURRENCY / (totalTime / 1000)).toFixed(1);
  const errorRate = ((failures / CONCURRENCY) * 100).toFixed(2);

  const p50 = percentile(latencies, 50);
  const p95 = percentile(latencies, 95);
  const p99 = percentile(latencies, 99);
  const avg = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1);
  const maxLat = Math.max(...latencies);
  const minLat = Math.min(...latencies);

  console.log(`\n\n${"═".repeat(50)}`);
  console.log(`   LOAD TEST RESULTS`);
  console.log(`${"═".repeat(50)}`);
  console.log(`  Total Requests:    ${CONCURRENCY}`);
  console.log(`  Total Time:        ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`  Requests/sec:      ${rps}`);
  console.log(`  ─────────────────────────────────`);
  console.log(`   Successes:      ${successes}`);
  console.log(`   Failures:       ${failures}`);
  console.log(`  Error Rate:        ${errorRate}%`);
  console.log(`  ─────────────────────────────────`);
  console.log(`  Latency (ms):`);
  console.log(`    Min:             ${minLat}ms`);
  console.log(`    Avg:             ${avg}ms`);
  console.log(`    P50 (median):    ${p50}ms`);
  console.log(`    P95:             ${p95}ms`);
  console.log(`    P99:             ${p99}ms`);
  console.log(`    Max:             ${maxLat}ms`);
  console.log(`${"═".repeat(50)}`);

  // Verdict
  if (parseFloat(errorRate) < 1) {
    console.log(`\n   PASS — Error rate < 1%. Server handles ${CONCURRENCY} concurrent users.`);
  } else if (parseFloat(errorRate) < 5) {
    console.log(`\n   WARNING — Error rate ${errorRate}%. Some requests failed under load.`);
  } else {
    console.log(`\n   FAIL — Error rate ${errorRate}%. Server cannot handle ${CONCURRENCY} concurrent users.`);
  }
  console.log();
}

runLoadTest().catch(console.error);

import cluster, { Worker } from "node:cluster";
import os from "node:os";
import http, { IncomingMessage, ServerResponse, RequestOptions } from "node:http";
import { runServer } from "./server/server";
import { config } from "./server/config";

const PORT: number = config.port;
const numCPUs: number = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Array of worker ports
  const workerPorts: number[] = [];

  // Fork workers (numCPUs - 1)
  for (let i = 0; i < numCPUs - 1; i++) {
    const workerPort = PORT + i;
    workerPorts.push(workerPort);

    // Pass port via environment variable
    cluster.fork({ WORKER_PORT: workerPort });
  }

  // Restart worker if it dies
  cluster.on("exit", (worker: Worker, code: number, signal: string) => {
    console.log(`Worker ${worker.process.pid} died. Spawning a new one.`);
    cluster.fork();
  });

  // Round-robin load balancer
  let currentWorker: number = 0;

  const server: http.Server = http.createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      if (!req.url || !req.method) {
        res.writeHead(400).end("Bad request");
        return;
      }

      const targetPort: number = workerPorts[currentWorker % workerPorts.length];
      currentWorker++;

      const options: RequestOptions = {
        hostname: "localhost",
        port: targetPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      const proxyReq: http.ClientRequest = http.request(options, (proxyRes: IncomingMessage) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });

      req.pipe(proxyReq, { end: true });

      proxyReq.on("error", (err: Error) => {
        console.error("Proxy error:", err);
        res.writeHead(500).end("Proxy error");
      });
    }
  );

  server.listen(PORT, () => {
    console.log(`Load balancer running on http://localhost:${PORT}`);
  });

} else {
  const port: number = parseInt(process.env.WORKER_PORT ?? String(PORT), 10);
  runServer(port);
}

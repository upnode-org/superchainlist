import { useState, useEffect } from "react";

interface RPCInfo {
  rpc: string;
  blockHeight: number;
  latency: string;
  status: boolean;
  privacy: string;
}

const jsonrpcRequest = {
  jsonrpc: "2.0",
  method: "eth_blockNumber",
  params: [],
  id: 1,
};

export const useRPCMetrics = (rpcEndpoints: string[]) => {
  const [rpcData, setRPCData] = useState<RPCInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRPCData = async () => {
    setLoading(true);
    setError(null);

    try {
      const rpcResults: RPCInfo[] = await Promise.all(
        rpcEndpoints.map(async (rpc) => {
          const isWebSocket = rpc.startsWith("wss://");
          const startTime = performance.now();

          if (isWebSocket) {
            return new Promise<RPCInfo>((resolve) => {
              try {
                const ws = new WebSocket(rpc);

                ws.onopen = () => {
                  ws.send(JSON.stringify(jsonrpcRequest));
                };

                ws.onmessage = (event) => {
                  const endTime = performance.now();
                  const data = JSON.parse(event.data);

                  ws.close();

                  if (!data.result) {
                    resolve({
                      rpc,
                      blockHeight: 0,
                      latency: "N/A",
                      status: false,
                      privacy: "N/A", // Placeholder for privacy
                    });
                  } else {
                    const blockHeight = parseInt(data.result, 16); // Convert hex to decimal
                    resolve({
                      rpc,
                      blockHeight,
                      latency: (endTime - startTime).toFixed(2) + "ms",
                      status: true, // Placeholder, update logic as needed
                      privacy: "N/A", // Placeholder for privacy
                    });
                  }
                };

                ws.onerror = () => {
                  resolve({
                    rpc,
                    blockHeight: 0,
                    latency: "N/A",
                    status: false,
                    privacy: "N/A", // Placeholder for privacy
                  });
                };
              } catch (error) {
                resolve({
                  rpc,
                  blockHeight: 0,
                  latency: "N/A",
                  status: false,
                  privacy: "N/A", // Placeholder for privacy
                });
              }
            });
          } else {
            // Handle HTTP-based endpoints
            const response = await fetch(rpc, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(jsonrpcRequest),
            });

            const endTime = performance.now();

            if (!response.ok) {
              return {
                rpc,
                blockHeight: 0,
                latency: "N/A",
                status: false,
                privacy: "N/A", // Placeholder for privacy
              };
            }

            const data = await response.json();
            const blockHeight = parseInt(data.result, 16); // Convert hex to decimal

            return {
              rpc,
              blockHeight,
              latency: (endTime - startTime).toFixed(2) + "ms",
              status: true, // Placeholder, update logic as needed
              privacy: "N/A", // Placeholder for privacy
            };
          }
        })
      );

      const sortedResults = rpcResults.sort((a, b) => {
        const latencyA = parseFloat(a.latency.replace("ms", "")) || Number.MAX_SAFE_INTEGER;
        const latencyB = parseFloat(b.latency.replace("ms", "")) || Number.MAX_SAFE_INTEGER;
  
        return latencyA - latencyB;
      });

      setRPCData(rpcResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRPCData();
  }, [rpcEndpoints]);

  return { rpcData, loading, error, refresh: fetchRPCData };
};
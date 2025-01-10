import { useRPCMetrics } from "@/hook/useRPCMetrics";
import { useCopy } from "@/hook/useCopy";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "./ui/table";
import { XCircle, CheckCircle2, RefreshCcw, MessageCircleWarning, Info } from "lucide-react";
import classNames from "classnames";
import { CardTitle } from "./ui/card";
import { SectionTitle, Title } from "./Typography";

interface RPCListParams {
  rpcEndpoints: string[];
}

export default function RPCList({ rpcEndpoints }: RPCListParams) {
  const { rpcData, loading, error, refresh } = useRPCMetrics(rpcEndpoints);
  const { onCopy } = useCopy({
    resetAfter: 2000,
    onSuccess: (data) => console.log(`Copied: ${data}`),
    onError: () => console.error("Failed to copy!"),
  });

  return (
    <div>
      {/* Refresh Button */}
      <div className="mb-4 flex justify-between items-center">
        <CardTitle>
          <SectionTitle className="mt-0">RPC</SectionTitle>
        </CardTitle>
        <button
          onClick={refresh}
          disabled={loading}
          className="bg-stone-500 text-white px-1.5 py-1.5 rounded hover:bg-stone-700 disabled:opacity-50"
        >
          <RefreshCcw
            className={classNames("h-4 w-4 transition-transform", {
              "animate-spin": loading,
            })}
          />
        </button>
      </div>

      {/* Error Skeleton */}
      {error && (
        <div className="p-4 h-24 bg-muted rounded flex flex-row items-center justify-center">
          <Info className="size-8 m-2 text-red-500"/>
          <div className="border-l pl-2 border-stone-700">
            <SectionTitle className="mt-0">Error</SectionTitle>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="">
          <div
            className="h-[40px] w-full p-1"
          >
            <div className="animate-pulse bg-muted rounded size-full" />
          </div>
          {[...Array(rpcEndpoints.length)].map((_, index) => (
            <div
              key={index}
              className="h-[41px] w-full p-1"
            >
              <div className="animate-pulse bg-muted rounded size-full" />
            </div>
          ))}
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Server Address</TableHead>
              <TableHead>Height</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead>Privacy</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rpcData.map((rpcInfo) => (
              <TableRow key={rpcInfo.rpc}>
                <TableCell
                  className="font-medium hover:underline cursor-copy"
                  onClick={() => onCopy(rpcInfo.rpc)}
                >
                  {rpcInfo.rpc}
                </TableCell>
                <TableCell>{rpcInfo.blockHeight}</TableCell>
                <TableCell>{rpcInfo.latency}</TableCell>
                <TableCell className=" flex align-middle [&>*]:mx-auto">
                  {rpcInfo.status ? (
                    <CheckCircle2 className="text-green-500" />
                  ) : (
                    <XCircle className=" text-red-500" />
                  )}
                </TableCell>
                {/* <TableCell>{rpcInfo.privacy}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

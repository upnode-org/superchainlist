"use client"

import { Superchain } from "@/utils/generateChainData"
import { SectionTitle } from "./Typography"
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import RPCTable from "./RPCTable"

export default function NetworkCard({ network }: { network: Superchain }) {

    const handleOpenLink = (url: string) => {
        window.open(url, "_blank");
    };

    return (
        <Card>
            <CardHeader className="flex flex-col">
                <RPCTable rpcEndpoints={network.rpc} />
            </CardHeader>

            <CardHeader className="flex flex-col">
                <CardTitle>
                    <SectionTitle className="mt-0">Block Explorer</SectionTitle>
                </CardTitle>
                <Table className=" overflow-x-visible">
                    <TableHeader>
                    </TableHeader>
                    <TableBody>
                        {network.explorers.map((blockExplorer) => (
                            <TableRow key={blockExplorer}>
                                <TableCell className="font-medium hover:underline cursor-alias"
                                    onClick={() => handleOpenLink(blockExplorer)}
                                >
                                    {blockExplorer}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardHeader>
            {network.faucets && network.faucets.length > 0 &&
                <CardHeader className="flex flex-col">
                    <CardTitle>
                        <SectionTitle className="mt-0">Faucets</SectionTitle>
                    </CardTitle>
                    <Table className=" overflow-x-visible">
                        <TableHeader>
                        </TableHeader>
                        <TableBody>
                            {network.faucets.map((faucets) => (
                                <TableRow key={faucets}>
                                    <TableCell className="font-medium hover:underline cursor-alias"
                                        onClick={() => handleOpenLink(faucets)}
                                    >
                                        {faucets}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                </CardHeader>
            }
        </Card>
    )
}
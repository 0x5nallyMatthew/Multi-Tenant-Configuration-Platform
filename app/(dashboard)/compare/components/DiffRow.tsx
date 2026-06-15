import React from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface DiffRowProps {
    label: string
    valA: any
    valB: any
    formatter?: (v: any) => React.ReactNode
}

export function DiffRow({ label, valA, valB, formatter = (v) => String(v) }: DiffRowProps) {
    const isDifferent = JSON.stringify(valA) !== JSON.stringify(valB)

    return (
        <TableRow className={`border-border dark:border-zinc-800 text-xs ${isDifferent ? "bg-amber-950/10" : ""}`}>
            <TableCell className="font-semibold w-1/3">{label}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    {formatter(valA)}
                    {/* {isDifferent && <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 rounded">Old</Badge>} */}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    {formatter(valB)}
                    {/* {isDifferent && <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 rounded">New</Badge>} */}
                </div>
            </TableCell>
        </TableRow>
    )
}
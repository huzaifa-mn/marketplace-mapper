"use client";

import { useState } from "react";
import Link from "next/link";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useMappings } from "@/hooks/useMappingHooks";
import { Plus } from "lucide-react";

export default function MappingList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useMappings(page);

  const hasData = data && data.items.length > 0;
  const canPrev = data && data.page > 1;
  const canNext = data && data.page < data.totalPages;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Saved Mappings</CardTitle>
        <Link
          href="/mappings/new"
          className="rounded-full shadow-md bg-indigo-700"
          aria-label="Add marketplace template"
        >
          <Button asChild size="icon" className="rounded-full shadow-md w-8 h-8 bg-indigo-700"
            aria-label="Add marketplace template">
            <Plus className="h-5 w-5 p-2" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">Failed to load mappings.</p>
        ) : !hasData ? (
          <p className="text-sm text-muted-foreground">
            No mappings yet. Click &quot;New Mapping&quot; to create one.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Marketplace Template</TableHead>
                  <TableHead>Seller File</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.id}</TableCell>
                    <TableCell>{m.marketplaceTemplateId}</TableCell>
                    <TableCell>{m.sellerFileId}</TableCell>
                    <TableCell>
                      {new Date(m.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/mappings/${m.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination controls */}
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>
                Page {data.page} of {data.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canPrev}
                  onClick={() => canPrev && setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canNext}
                  onClick={() => canNext && setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

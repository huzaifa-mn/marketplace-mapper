"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSellerFiles } from "@/hooks/useSellerFilesHooks";
import SellerFileUploadForm from "./SellerFileUploadForm";

export default function SellerFileList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useSellerFiles(page);

  const hasData = data && data.items.length > 0;
  const canPrev = data && data.page > 1;
  const canNext = data && data.page < data.totalPages;

  console.log("Seller File Data: ", JSON.stringify(data, null, 2));

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Seller Files</CardTitle>
        <SellerFileUploadForm page={page} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">
            Failed to load seller files.
          </p>
        ) : !hasData ? (
          <p className="text-sm text-muted-foreground">
            No seller files yet. Upload one above.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Columns</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.fileName}</TableCell>
                    <TableCell>{file.columns.join(", ")}</TableCell>
                    <TableCell>
                      {new Date(file.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/seller-files/${file.id}`}>View</Link>
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

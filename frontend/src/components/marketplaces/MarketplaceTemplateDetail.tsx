"use client";

import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarketplaceTemplate } from "@/hooks/useMarketplaceHooks";

export default function MarketplaceTemplateDetail() {
  const params = useParams();
  const idParam = params?.id;
  const id = idParam ? Number(idParam) : null;

  const { data, isLoading, error } = useMarketplaceTemplate(id);

  if (!id) {
    return <p className="text-sm text-destructive">Invalid template id.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {data ? data.name : isLoading ? "Loading..." : "Template"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : error || !data ? (
          <p className="text-sm text-destructive">
            Failed to load marketplace template.
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Created at: {new Date(data.createdAt).toLocaleString()}
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attribute Name</TableHead>
                  <TableHead>Data Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.attributes.map((attr) => (
                  <TableRow key={attr.id}>
                    <TableCell>{attr.name}</TableCell>
                    <TableCell>{attr.dataType || "string"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}

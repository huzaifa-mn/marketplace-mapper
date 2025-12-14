"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMapping } from "@/hooks/useMappingHooks";
import { dmSans, inter } from "@/lib/fonts";
import { ArrowRight, GitMerge, FileSpreadsheet, Store } from "lucide-react";

export default function MappingDetail() {
  const params = useParams();
  const idParam = params?.id;
  const id = idParam ? Number(idParam) : null;

  const { data, isLoading, error } = useMapping(id);

  if (!id) {
    return <p className="text-sm text-destructive">Invalid mapping id.</p>;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-red-500">
        Failed to load mapping details.
      </div>
    );
  }

  // build a quick lookup: sellerColumnName -> marketplace attribute name
  const marketplaceBySellerCol: Record<string, string> = {};
  data.items.forEach((item) => {
    const attr = data.marketplaceTemplate.attributes.find(
      (a) => a.id === item.marketplaceAttributeId,
    );
    if (attr) {
      marketplaceBySellerCol[item.sellerColumnName] = attr.name;
    }
  });


  // Normalize seller columns in case this mapping points to an old sellerFile
  const normalizedColumns =
    data.sellerFile.columns.length === 1
      ? data.sellerFile.columns[0]
        .split(",")
        .map((c: string) => c.trim())
        .filter(Boolean)
      : data.sellerFile.columns;

  // Fix sampleRows for legacy shape { "SKU,Name,...": "TSHIRT001,Classic Tee,..." }
  const fixedSampleRows =
    data.sellerFile.sampleRows && data.sellerFile.sampleRows.length > 0
      ? data.sellerFile.sampleRows.map((row: any) => {
        const keys = Object.keys(row);
        if (keys.length !== 1) return row; // already proper object

        const singleKey = keys[0];
        const rawValue = String(row[singleKey] ?? "");
        const values = rawValue.split(",");

        const obj: Record<string, any> = {};
        normalizedColumns.forEach((col, idx) => {
          obj[col] = values[idx] ?? "";
        });
        return obj;
      })
      : [];


  // Helper to get mapped value for a row
  const getMappedValue = (row: any, attributeId: number) => {
    const mappingItem = data.items.find((i) => i.marketplaceAttributeId === attributeId);
    if (!mappingItem) return "-";
    return row[mappingItem.sellerColumnName] ?? "-";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${dmSans.className} text-3xl font-bold text-slate-900`}>
            Mapping Details
          </h1>
          <p className={`${inter.className} text-slate-500 mt-1`}>
            Configuration & Preview
          </p>
        </div>
        <Link href="/mappings">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6 flex items-center space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Store className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className={`${dmSans.className} text-sm font-medium text-slate-500`}>
                Marketplace Template
              </p>
              <p className={`${inter.className} font-medium`}>
                {data.marketplaceTemplate.name}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className={`${dmSans.className} text-sm font-medium text-slate-500`}>
                Source Seller File
              </p>
              <p className={`${inter.className} font-medium`}>
                {data.sellerFile.fileName}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Table */}
      <Card>
        <CardHeader>
          <CardTitle className={`${dmSans.className}`}>Mapping Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={`${inter.className} w-[45%]`}>Marketplace Attribute</TableHead>
                  <TableHead className="w-[10%] text-center"><ArrowRight className="h-4 w-4 mx-auto text-slate-400" /></TableHead>
                  <TableHead className={`${inter.className} w-[45%]`}>Seller Column</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => {
                  const attr = data.marketplaceTemplate.attributes.find(
                    (a) => a.id === item.marketplaceAttributeId
                  );
                  return (
                    <TableRow key={item.id}>
                      <TableCell className={`${inter.className} font-medium`}>
                        {attr?.name ?? item.marketplaceAttributeId}
                      </TableCell>
                      <TableCell className="text-center">
                        <GitMerge className="h-4 w-4 mx-auto text-indigo-500" />
                      </TableCell>
                      <TableCell className={`${inter.className} text-slate-600`}>
                        {item.sellerColumnName}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mapped Data Preview */}
      {/* <Card>
        <CardHeader>
          <CardTitle className={`${dmSans.className}`}>Mapped Data Preview</CardTitle>
          <p className={`${inter.className} text-sm text-slate-500`}>
            This is how your products will look when exported to {data.marketplaceTemplate.name}.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {data.marketplaceTemplate.attributes.map((attr) => (
                    <TableHead key={attr.id} className={`${inter.className} whitespace-nowrap`}>
                      {attr.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixedSampleRows && fixedSampleRows.length > 0 ? (
                  fixedSampleRows.map((row: any, i: number) => (
                    <TableRow key={i}>
                      {data.marketplaceTemplate.attributes.map((attr) => (
                        <TableCell
                          key={attr.id}
                          className={`${inter.className} whitespace-nowrap`}
                        >
                          {getMappedValue(row, attr.id)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={data.marketplaceTemplate.attributes.length}
                      className="text-center py-8 text-slate-500"
                    >
                      No sample data available to preview.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </div>
        </CardContent>
      </Card> */}

      {/* Mapped Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle className={dmSans.className}>Mapped Data Preview</CardTitle>
          <p className={`${inter.className} text-sm text-slate-500`}>
            This is how your seller data looks per column, with mappings applied.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {normalizedColumns.map((col) => (
                    <TableHead
                      key={col}
                      className={`${inter.className} whitespace-nowrap`}
                    >
                      {col}
                      {marketplaceBySellerCol[col] && (
                        <span className="ml-1 text-xs text-slate-400">
                          ← {marketplaceBySellerCol[col]}
                        </span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixedSampleRows && fixedSampleRows.length > 0 ? (
                  fixedSampleRows.map((row: any, i: number) => (
                    <TableRow key={i}>
                      {normalizedColumns.map((col) => (
                        <TableCell
                          key={col}
                          className={`${inter.className} whitespace-nowrap`}
                        >
                          {row[col] !== undefined ? String(row[col]) : "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={normalizedColumns.length}
                      className="text-center py-8 text-slate-500"
                    >
                      No sample data available to preview.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

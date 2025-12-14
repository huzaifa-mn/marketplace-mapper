// "use client";

// import { useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";
// import { useSellerFile } from "@/hooks/useSellerFilesHooks";
// import { dmSans, inter } from "@/lib/fonts";
// import {
//   FileSpreadsheet,
//   Calendar,
//   Database,
//   Code,
//   Table as TableIcon,
//   List,
// } from "lucide-react";

// export default function SellerFileDetail() {
//   const params = useParams();
//   const id = params.id ? Number(params.id) : null;
//   const { data, isLoading, error } = useSellerFile(id);
//   const [activeTab, setActiveTab] = useState<"raw" | "table" | "list">("list");

//   if (!id) return <div>Invalid ID</div>;

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <Skeleton className="h-12 w-1/3" />
//         <Skeleton className="h-64 w-full" />
//       </div>
//     );
//   }

//   if (error || !data) {
//     return (
//       <div className="text-red-500">
//         Error loading file details. Please try again.
//       </div>
//     );
//   }

//   // Normalize columns in case some records still store a single combined header string
//   const normalizedColumns =
//     data.columns.length === 1
//       ? data.columns[0]
//         .split(",")
//         .map((c) => c.trim())
//         .filter(Boolean)
//       : data.columns;

//   // Helper to identify key columns
//   const identifyColumns = () => {
//     const skuCol = normalizedColumns.find(
//       (c) =>
//         c.toLowerCase().includes("sku") || c.toLowerCase().includes("id"),
//     );
//     const nameCol = normalizedColumns.find(
//       (c) =>
//         c.toLowerCase().includes("name") || c.toLowerCase().includes("title"),
//     );
//     const imageCol = normalizedColumns.find((c) => {
//       const lc = c.toLowerCase();
//       return lc.includes("image") || lc.includes("img") || lc.includes("photo");
//     });

//     return { skuCol, nameCol, imageCol };
//   };

//   const { skuCol, nameCol, imageCol } = identifyColumns();

//   // Fix rows that still come as { "SKU,Name,...": "TSHIRT001,Classic Tee,..." }
//   const fixedSampleRows =
//     data.sampleRows && data.sampleRows.length > 0
//       ? data.sampleRows.map((row: any) => {
//         const keys = Object.keys(row);
//         if (keys.length !== 1) return row; // already proper object

//         const singleKey = keys[0];
//         const rawValue = String(row[singleKey] ?? "");
//         const values = rawValue.split(","); // CSV is comma-separated

//         const obj: Record<string, any> = {};
//         normalizedColumns.forEach((col, idx) => {
//           obj[col] = values[idx] ?? "";
//         });
//         return obj;
//       })
//       : [];

//   return (
//     <div className="space-y-8">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className={`${dmSans.className} text-3xl font-bold text-slate-900`}>
//             {data.fileName}
//           </h1>
//           <p className={`${inter.className} text-slate-500 mt-1`}>
//             Seller File Details &amp; Preview
//           </p>
//         </div>
//         <Link href="/seller-files">
//           <Button variant="outline">Back to List</Button>
//         </Link>
//       </div>

//       {/* Metadata Cards */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardContent className="pt-6 flex items-center space-x-4">
//             <div className="p-2 bg-indigo-100 rounded-lg">
//               <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
//             </div>
//             <div>
//               <p
//                 className={`${dmSans.className} text-sm font-medium text-slate-500`}
//               >
//                 File Name
//               </p>
//               <p className={`${inter.className} font-medium`}>{data.fileName}</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6 flex items-center space-x-4">
//             <div className="p-2 bg-indigo-100 rounded-lg">
//               <Database className="h-6 w-6 text-indigo-600" />
//             </div>
//             <div>
//               <p
//                 className={`${dmSans.className} text-sm font-medium text-slate-500`}
//               >
//                 Total Columns
//               </p>
//               <p className={`${inter.className} font-medium`}>
//                 {normalizedColumns.length}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6 flex items-center space-x-4">
//             <div className="p-2 bg-indigo-100 rounded-lg">
//               <Calendar className="h-6 w-6 text-indigo-600" />
//             </div>
//             <div>
//               <p
//                 className={`${dmSans.className} text-sm font-medium text-slate-500`}
//               >
//                 Uploaded At
//               </p>
//               <p className={`${inter.className} font-medium`}>
//                 {new Date(data.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Preview Section with Tabs */}
//       <Card>
//         <CardHeader>
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <CardTitle className={`${dmSans.className}`}>
//               File Content Preview
//             </CardTitle>
//             <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
//               <button
//                 onClick={() => setActiveTab("list")}
//                 className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "list"
//                   ? "bg-white text-indigo-600 shadow-sm"
//                   : "text-slate-600 hover:text-slate-900"
//                   }`}
//               >
//                 <List className="w-4 h-4" />
//                 <span>Product List</span>
//               </button>
//               <button
//                 onClick={() => setActiveTab("table")}
//                 className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "table"
//                   ? "bg-white text-indigo-600 shadow-sm"
//                   : "text-slate-600 hover:text-slate-900"
//                   }`}
//               >
//                 <TableIcon className="w-4 h-4" />
//                 <span>Structured Table</span>
//               </button>
//               <button
//                 onClick={() => setActiveTab("raw")}
//                 className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "raw"
//                   ? "bg-white text-indigo-600 shadow-sm"
//                   : "text-slate-600 hover:text-slate-900"
//                   }`}
//               >
//                 <Code className="w-4 h-4" />
//                 <span>Raw Data</span>
//               </button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {activeTab === "raw" && (
//             <div className="bg-slate-950 rounded-lg p-4 overflow-auto max-h-[500px]">
//               <pre
//                 className={`${inter.className} font-mono text-xs text-slate-50`}
//               >
//                 {JSON.stringify(data.sampleRows, null, 2)}
//               </pre>
//             </div>
//           )}

//           {activeTab === "table" && (
//             <div className="rounded-md border overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     {normalizedColumns.map((col) => (
//                       <TableHead
//                         key={col}
//                         className={`${inter.className} font-semibold whitespace-nowrap`}
//                       >
//                         {col}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {fixedSampleRows.length > 0 ? (
//                     fixedSampleRows.map((row, i) => (
//                       <TableRow key={i}>
//                         {normalizedColumns.map((col) => (
//                           <TableCell
//                             key={col}
//                             className={`${inter.className} whitespace-nowrap`}
//                           >
//                             {row[col] !== undefined ? String(row[col]) : "-"}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell
//                         colSpan={normalizedColumns.length}
//                         className="text-center py-8 text-slate-500"
//                       >
//                         No sample data available.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           )}

//           {/* Product List tab */}
//           {activeTab === "list" && (
//             <div className="space-y-4">
//               {fixedSampleRows.length > 0 ? (
//                 fixedSampleRows.map((row, i) => (
//                   <div
//                     key={i}
//                     className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
//                   >
//                     <div className="flex flex-col md:flex-row gap-6">
//                       {/* Identity column */}
//                       <div className="w-full md:w-1/4 space-y-3">
//                         {imageCol && row[imageCol] && (
//                           <div className="w-24 h-24 bg-slate-100 rounded-md overflow-hidden border">
//                             {/* eslint-disable-next-line @next/next/no-img-element */}
//                             <img
//                               src={row[imageCol]}
//                               alt="Product"
//                               className="w-full h-full object-cover"
//                               onError={(e) =>
//                                 (e.currentTarget.style.display = "none")
//                               }
//                             />
//                           </div>
//                         )}
//                         <div>
//                           <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
//                             SKU / ID
//                           </p>
//                           <p
//                             className={`${inter.className} font-mono font-medium text-slate-900 break-all`}
//                           >
//                             {skuCol ? row[skuCol] : "N/A"}
//                           </p>
//                         </div>
//                         {nameCol && (
//                           <div>
//                             <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
//                               Name
//                             </p>
//                             <p
//                               className={`${inter.className} text-sm text-slate-700 line-clamp-2`}
//                             >
//                               {row[nameCol]}
//                             </p>
//                           </div>
//                         )}
//                       </div>

//                       {/* Attributes grid */}
//                       <div className="w-full md:w-3/4">
//                         <div className="bg-slate-50 rounded-md border p-4">
//                           <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
//                             Product Attributes
//                           </p>
//                           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//                             {normalizedColumns
//                               .filter(
//                                 (col) =>
//                                   col !== skuCol &&
//                                   col !== nameCol &&
//                                   col !== imageCol,
//                               )
//                               .map((col) => (
//                                 <div key={col} className="space-y-1">
//                                   <p
//                                     className="text-xs text-slate-500 truncate"
//                                     title={col}
//                                   >
//                                     {col}
//                                   </p>
//                                   <p
//                                     className={`${inter.className} text-sm font-medium text-slate-800 truncate`}
//                                     title={
//                                       row[col] !== undefined
//                                         ? String(row[col])
//                                         : "-"
//                                     }
//                                   >
//                                     {row[col] !== undefined
//                                       ? String(row[col])
//                                       : "-"}
//                                   </p>
//                                 </div>
//                               ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-12 text-slate-500 border rounded-lg border-dashed">
//                   No sample data available to render list view.
//                 </div>
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


/// ======================================================================================


"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
import { useSellerFile } from "@/hooks/useSellerFilesHooks";
import { dmSans, inter } from "@/lib/fonts";
import {
  FileSpreadsheet,
  Calendar,
  Database,
  Code,
  Table as TableIcon,
  List,
} from "lucide-react";

const PAGE_SIZE = 5;

export default function SellerFileDetail() {
  const params = useParams();
  const id = params.id ? Number(params.id) : null;
  const { data, isLoading, error } = useSellerFile(id);
  const [activeTab, setActiveTab] = useState<"raw" | "table" | "list">("list");
  const [page, setPage] = useState(1);

  if (!id) return <div>Invalid ID</div>;

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
        Error loading file details. Please try again.
      </div>
    );
  }

  const normalizedColumns =
    data.columns.length === 1
      ? data.columns[0]
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
      : data.columns;

  const identifyColumns = () => {
    const skuCol = normalizedColumns.find(
      (c) =>
        c.toLowerCase().includes("sku") || c.toLowerCase().includes("id"),
    );
    const nameCol = normalizedColumns.find(
      (c) =>
        c.toLowerCase().includes("name") || c.toLowerCase().includes("title"),
    );
    const imageCol = normalizedColumns.find((c) => {
      const lc = c.toLowerCase();
      return lc.includes("image") || lc.includes("img") || lc.includes("photo");
    });

    return { skuCol, nameCol, imageCol };
  };

  const { skuCol, nameCol, imageCol } = identifyColumns();

  const fixedSampleRows =
    data.sampleRows && data.sampleRows.length > 0
      ? data.sampleRows.map((row: any) => {
        const keys = Object.keys(row);
        if (keys.length !== 1) return row;

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

  const totalRows = fixedSampleRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pagedRows = fixedSampleRows.slice(start, end);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${dmSans.className} text-3xl font-bold text-slate-900`}>
            {data.fileName}
          </h1>
          <p className={`${inter.className} text-slate-500 mt-1`}>
            Seller File Details &amp; Preview
          </p>
        </div>
        <Link href="/seller-files">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>

      {/* Metadata Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 flex items-center space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p
                className={`${dmSans.className} text-sm font-medium text-slate-500`}
              >
                File Name
              </p>
              <p className={`${inter.className} font-medium`}>{data.fileName}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Database className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p
                className={`${dmSans.className} text-sm font-medium text-slate-500`}
              >
                Total Columns
              </p>
              <p className={`${inter.className} font-medium`}>
                {normalizedColumns.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p
                className={`${dmSans.className} text-sm font-medium text-slate-500`}
              >
                Uploaded At
              </p>
              <p className={`${inter.className} font-medium`}>
                {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className={dmSans.className}>
              File Content Preview
            </CardTitle>
            <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("list")}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "list"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <List className="w-4 h-4" />
                <span>Product List</span>
              </button>
              <button
                onClick={() => setActiveTab("table")}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "table"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <TableIcon className="w-4 h-4" />
                <span>Structured Table</span>
              </button>
              <button
                onClick={() => setActiveTab("raw")}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "raw"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <Code className="w-4 h-4" />
                <span>Raw Data</span>
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "raw" && (
            <div className="bg-slate-950 rounded-lg p-4 overflow-auto max-h-[500px]">
              <pre
                className={`${inter.className} font-mono text-xs text-slate-50`}
              >
                {JSON.stringify(data.sampleRows, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === "table" && (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {normalizedColumns.map((col) => (
                        <TableHead
                          key={col}
                          className={`${inter.className} font-semibold whitespace-nowrap`}
                        >
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedRows.length > 0 ? (
                      pagedRows.map((row, i) => (
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
                          No sample data available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination for table */}
              {totalRows > 0 && (
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>
                    Page {currentPage} of {totalPages}
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
              )}
            </>
          )}

          {activeTab === "list" && (
            <>
              <div className="space-y-4">
                {pagedRows.length > 0 ? (
                  pagedRows.map((row, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/4 space-y-3">
                          {imageCol && row[imageCol] && (
                            <div className="w-24 h-24 bg-slate-100 rounded-md overflow-hidden border">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={row[imageCol]}
                                alt="Product"
                                className="w-full h-full object-cover"
                                onError={(e) =>
                                  (e.currentTarget.style.display = "none")
                                }
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                              SKU / ID
                            </p>
                            <p
                              className={`${inter.className} font-mono font-medium text-slate-900 break-all`}
                            >
                              {skuCol ? row[skuCol] : "N/A"}
                            </p>
                          </div>
                          {nameCol && (
                            <div>
                              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                Name
                              </p>
                              <p
                                className={`${inter.className} text-sm text-slate-700 line-clamp-2`}
                              >
                                {row[nameCol]}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="w-full md:w-3/4">
                          <div className="bg-slate-50 rounded-md border p-4">
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
                              Product Attributes
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                              {normalizedColumns
                                .filter(
                                  (col) =>
                                    col !== skuCol &&
                                    col !== nameCol &&
                                    col !== imageCol,
                                )
                                .map((col) => (
                                  <div key={col} className="space-y-1">
                                    <p
                                      className="text-xs text-slate-500 truncate"
                                      title={col}
                                    >
                                      {col}
                                    </p>
                                    <p
                                      className={`${inter.className} text-sm font-medium text-slate-800 truncate`}
                                      title={
                                        row[col] !== undefined
                                          ? String(row[col])
                                          : "-"
                                      }
                                    >
                                      {row[col] !== undefined
                                        ? String(row[col])
                                        : "-"}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500 border rounded-lg border-dashed">
                    No sample data available to render list view.
                  </div>
                )}
              </div>

              {/* Pagination for list */}
              {totalRows > 0 && (
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>
                    Page {currentPage} of {totalPages}
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
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// "use client";

// import Link from "next/link";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
// import { useMarketplaceTemplates } from "@/hooks/useMarketplaceHooks";
// import MarketplaceTemplateForm from "./MarketplaceTemplateForm";

// export default function MarketplaceTemplateList() {
//   const { data, isLoading, error } = useMarketplaceTemplates();

//   return (
//     <Card>
//       <CardHeader className="flex justify-between items-center">
//         <CardTitle>Marketplace Templates</CardTitle>
//         <MarketplaceTemplateForm />
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="space-y-2">
//             <Skeleton className="h-8 w-full" />
//             <Skeleton className="h-8 w-full" />
//           </div>
//         ) : error ? (
//           <p className="text-sm text-destructive">
//             Failed to load marketplace templates.
//           </p>
//         ) : !data || data.items.length === 0 ? (
//           <p className="text-sm text-muted-foreground">
//             No marketplace templates yet. Create one above.
//           </p>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Created At</TableHead>
//                 <TableHead className="w-24 text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data.items.map((tpl) => (
//                 <TableRow key={tpl.id}>
//                   <TableCell>{tpl.name}</TableCell>
//                   <TableCell>
//                     {new Date(tpl.createdAt).toLocaleString()}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href={`/marketplaces/${tpl.id}`}>View</Link>
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";

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
import { Button } from "@/components/ui/button";
import { useMarketplaceTemplates } from "@/hooks/useMarketplaceHooks";
import MarketplaceTemplateForm from "./MarketplaceTemplateForm";

export default function MarketplaceTemplateList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useMarketplaceTemplates(page);

  const hasData = data && data.items.length > 0;
  const canPrev = data && data.page > 1;
  const canNext = data && data.page < data.totalPages;

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Marketplace Templates</CardTitle>
        <MarketplaceTemplateForm page={page} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">
            Failed to load marketplace templates.
          </p>
        ) : !hasData ? (
          <p className="text-sm text-muted-foreground">
            No marketplace templates yet. Create one above.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((tpl) => (
                  <TableRow key={tpl.id}>
                    <TableCell>{tpl.name}</TableCell>
                    <TableCell>
                      {new Date(tpl.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/marketplaces/${tpl.id}`}>View</Link>
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

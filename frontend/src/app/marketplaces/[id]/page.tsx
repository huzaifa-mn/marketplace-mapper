// "use client";

// import { useParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Loader2, Table, FileSpreadsheet } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useGetMarketplaceTemplateById } from "@/hooks/useMarketplaceHooks";
// import { dmSans, inter } from "@/lib/fonts";

// export default function MarketplaceTemplateDetailPage() {
//   const params = useParams();
//   const id = Number(params.id);

//   const { data, isPending, isError, error } = useGetMarketplaceTemplateById(id);

//   if (isPending)
//     return (
//       <div className="flex items-center justify-center h-[60vh]">
//         <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
//       </div>
//     );

//   if (isError)
//     return (
//       <div className="flex items-center justify-center h-[60vh] text-red-600">
//         {error?.message || "Failed to load marketplace template"}
//       </div>
//     );

//   if (!data) {
//     return (
//       <div className="flex items-center justify-center h-[60vh]">
//         Template not found
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
//       {/* HEADER */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1
//             className={`${dmSans.className} text-3xl font-bold tracking-tight text-slate-900`}
//           >
//             {data.name}
//           </h1>
//           <p className={`${inter.className} text-sm text-muted-foreground`}>
//             Marketplace Template Overview
//           </p>
//         </div>

//         <Link href="/marketplaces">
//           <Button variant="secondary">Back</Button>
//         </Link>
//       </div>

//       {/* TEMPLATE INFO CARD */}
//       <Card className="border border-slate-200 shadow-sm">
//         <CardHeader>
//           <CardTitle className={`${dmSans.className} text-lg font-semibold`}>
//             Template Info
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex items-center space-x-4">
//             <div className="p-2 rounded-lg bg-indigo-100">
//               <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
//             </div>
//             <div>
//               <p className={`${dmSans.className} text-sm font-medium`}>
//                 Template ID
//               </p>
//               <p className={`${inter.className} text-muted-foreground`}>
//                 {data.id}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="p-2 rounded-lg bg-indigo-100">
//               <Table className="h-5 w-5 text-indigo-600" />
//             </div>
//             <div>
//               <p className={`${dmSans.className} text-sm font-medium`}>
//                 Attributes Count
//               </p>
//               <p className={`${inter.className} text-muted-foreground`}>
//                 {/* {data.attributes?.length || 0} */}

//                 {data.attributes?.reduce((acc, attr) => acc + attr.name.split(",").length, 0) || 0}
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* ATTRIBUTES CARD */}
//       <Card className="border border-slate-200 shadow-sm">
//         <CardHeader>
//           <CardTitle className={`${dmSans.className} text-lg font-semibold`}>
//             Marketplace Attributes
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="w-full">
//           {data.attributes && data.attributes.length > 0 ? (
//             <div className="gap-3 grid grid-cols-4">
//               {data.attributes.map((attr) => (
//                 <div
//                   key={attr.id}
//                   className="flex items-start justify-between gap-4 rounded-lg border bg-white px-4 py-3 shadow-sm hover:border-indigo-200 hover:bg-slate-50 transition-colors"
//                 >
//                   <div className="flex flex-col gap-1">
//                     <span
//                       className={`${inter.className} text-sm font-medium text-slate-900`}
//                     >
//                       {attr.name}
//                     </span>
//                     {/* {attr.dataType && (
//                       <span className="text-xs text-slate-500">
//                         Type: <span className="font-medium inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">{attr.dataType}</span>
//                       </span>
//                     )} */}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {attr.dataType && (
//                       <span className="text-xs text-slate-500">
//                         Type: <span className="font-medium inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">{attr.dataType}</span>
//                       </span>
//                     )}
//                     {/* <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
//                       Attribute
//                     </span> */}
//                     {/* If you later add required flag: */}
//                     {/* {attr.required && (
//                       <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
//                         Required
//                       </span>
//                     )} */}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div
//               className={`${inter.className} text-center py-10 text-muted-foreground`}
//             >
//               No attributes found in this template
//             </div>
//           )}
//         </CardContent>

//       </Card>
//     </div>
//   );
// }


"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Table, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetMarketplaceTemplateById } from "@/hooks/useMarketplaceHooks";
import { dmSans, inter } from "@/lib/fonts";

export default function MarketplaceTemplateDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isPending, isError, error } = useGetMarketplaceTemplateById(id);

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4 text-center text-red-600">
        {error?.message || "Failed to load marketplace template"}
      </div>
    );

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4 text-center">
        Template not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1
            className={`${dmSans.className} text-2xl sm:text-3xl font-bold tracking-tight text-slate-900`}
          >
            {data.name}
          </h1>
          <p className={`${inter.className} text-sm text-muted-foreground`}>
            Marketplace Template Overview
          </p>
        </div>

        <div className="flex justify-start sm:justify-end">
          <Link href="/marketplaces">
            <Button variant="secondary" size="sm">
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* TEMPLATE INFO CARD */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className={`${dmSans.className} text-base sm:text-lg font-semibold`}>
            Template Info
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-indigo-100">
              <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className={`${dmSans.className} text-sm font-medium`}>Template ID</p>
              <p className={`${inter.className} text-sm text-muted-foreground`}>
                {data.id}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-indigo-100">
              <Table className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className={`${dmSans.className} text-sm font-medium`}>
                Attributes Count
              </p>
              <p className={`${inter.className} text-sm text-muted-foreground`}>
                {data.attributes?.reduce(
                  (acc, attr) => acc + attr.name.split(",").length,
                  0,
                ) || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ATTRIBUTES CARD */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className={`${dmSans.className} text-base sm:text-lg font-semibold`}>
            Marketplace Attributes
          </CardTitle>
        </CardHeader>

        <CardContent className="w-full">
          {data.attributes && data.attributes.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.attributes.map((attr) => (
                <div
                  key={attr.id}
                  className="flex items-start justify-between gap-3 rounded-lg border bg-white px-3 py-3 text-sm shadow-sm transition-colors hover:border-indigo-200 hover:bg-slate-50 sm:px-4"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span
                      className={`${inter.className} text-sm font-medium text-slate-900 break-words`}
                    >
                      {/* {attr.name} */}
                      {attr.name.trim().replace(/^"+|"+$/g, "")}

                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {attr.dataType && (
                      <span className="text-xs text-slate-500">
                        Type:{" "}
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                          {attr.dataType}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`${inter.className} text-center py-10 text-sm text-muted-foreground`}
            >
              No attributes found in this template
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

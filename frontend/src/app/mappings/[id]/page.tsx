"use client";

import MappingDetail from "@/components/mappings/MappingDetail";
import { inter } from "@/lib/fonts";

export default function MappingDetailPage() {
  return (
    <div className={`${inter.className} space-y-8 p-8 md:p-10`}>
      <MappingDetail />
    </div>
  );
}

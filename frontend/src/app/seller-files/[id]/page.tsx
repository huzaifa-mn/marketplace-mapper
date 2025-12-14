// src/app/seller-files/[id]/page.tsx
"use client";

import SellerFileDetail from "@/components/seller-files/SellerFileDetail";
import { inter } from "@/lib/fonts";

export default function SellerFileDetailPage() {
  return (
    <div className={`${inter.className} p-8 md:p-10`}>
      <SellerFileDetail />
    </div>
  );
}

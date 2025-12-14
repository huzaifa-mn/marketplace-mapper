// src/app/seller-files/page.tsx
"use client";

import SellerFileUploadForm from "@/components/seller-files/SellerFileUploadForm";
import SellerFileList from "@/components/seller-files/SellerFileList";
import Header from "@/components/common/Header";
import { inter } from "@/lib/fonts";

export default function SellerFilesPage() {
  return (
    <div className={`${inter.className}`}>
      <Header />
      <div className="p-8 md:p-10">
        <SellerFileList />
      </div>
    </div>
  );
}

"use client";

import Header from "@/components/common/Header";
import MappingList from "@/components/mappings/MappingList";
import { inter } from "@/lib/fonts";

export default function MappingsPage() {
  return (
    <div className={`${inter.className}`}>
      <Header />
      <div className="p-8">
        <MappingList />
      </div>
    </div>
  );
}

// src/app/mappings/new/page.tsx
import { inter } from "@/lib/fonts";
import MappingBuilder from "../../../components/mappings/MappingBuilder";

export default function NewMappingPage() {
  return (
    <div className={`${inter.className} space-y-8 p-4`}>
      <nav className="flex items-center space-x-2 text-sm">
        <a
          href="/mappings"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Mappings
        </a>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">New</span>
      </nav>
      <MappingBuilder />
    </div>
  );
}

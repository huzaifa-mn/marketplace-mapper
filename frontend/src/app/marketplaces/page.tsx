import MarketplaceTemplateList from "../../components/marketplaces/MarketplaceTemplateList";
import Header from "@/components/common/Header";
import { inter } from "@/lib/fonts";

export default function MarketplacesPage() {
  return (
    <div className={`${inter.className}`}>
      <Header />
      <div className="p-8 md:p-10 space-y-8">
        <MarketplaceTemplateList />
      </div>
    </div>
  );
}

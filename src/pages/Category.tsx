import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CategoryHeader from "../components/category/CategoryHeader";
import CategorySidebar from "../components/category/CategorySidebar";
import FilterSortBar, { FilterState } from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";

const Category = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    priceRanges: [],
    materials: []
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <CategorySidebar />

        <main className="w-full lg:w-[calc(100%-16rem)] pt-6">
          <CategoryHeader
            category={category || 'All Products'}
          />

          <FilterSortBar
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            itemCount={itemCount}
            sortBy={sortBy}
            setSortBy={setSortBy}
            activeFilters={activeFilters}
            onApplyFilters={setActiveFilters}
          />

          <ProductGrid
            category={category}
            sortBy={sortBy}
            onCountChange={setItemCount}
            filters={activeFilters}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Category;
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CategoryHeader from "../components/category/CategoryHeader";
import CategorySidebar from "../components/category/CategorySidebar";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";

const Category = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

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
            itemCount={24}
          />
          
          <ProductGrid category={category} />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Category;
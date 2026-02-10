import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";
import AnimatedSection from "../animations/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
  second_image_url?: string | null;
  images?: string[];
  is_new?: boolean;
  is_pre_order?: boolean;
  is_limited_edition?: boolean;
  slug: string;
  material?: string | null;
}

import { FilterState } from "./FilterSortBar";

interface ProductGridProps {
  category?: string;
  sortBy?: string;
  onCountChange?: (count: number) => void;
  filters?: FilterState;
}

// Products should be fetched from Supabase based on category filter
const ProductGrid = ({ category, sortBy = "featured", onCountChange, filters }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    // Reset to first page when category, sort or filters change
    setCurrentPage(1);
  }, [category, sortBy, filters]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*, categories!inner(name, slug)');

        // Handle special "New In" filters
        if (category === 'new-arrivals' || category === 'new-in') {
          query = query.eq('is_new', true);
        } else if (category === 'pre-orders') {
          query = query.eq('is_pre_order', true);
        } else if (category === 'limited-edition') {
          query = query.eq('is_limited_edition', true);
        } else if (category && category !== 'shop') {
          const categorySlug = category.toLowerCase().replace(/\s*\/\s*/g, '-').replace(/\s+/g, '-');
          query = query.eq('categories.slug', categorySlug);
        }

        // Apply filters from FilterSortBar at DB level
        if (filters) {
          if (filters.categories.length > 0) {
            query = query.in('categories.name', filters.categories);
          }

          if (filters.priceRanges.length > 0) {
            // Price filtering logic moved to DB
            const priceFilters = filters.priceRanges.map(range => {
              if (range === "Under AED 100") return { min: 0, max: 99.99 };
              if (range === "AED 100 - AED 200") return { min: 100, max: 200 };
              if (range === "AED 200 - AED 500") return { min: 200, max: 500 };
              if (range === "AED 500+") return { min: 500.01, max: 1000000 };
              return null;
            }).filter(Boolean);

            if (priceFilters.length > 0) {
              const minPrice = Math.min(...priceFilters.map(r => r!.min));
              const maxPrice = Math.max(...priceFilters.map(r => r!.max));
              query = query.gte('price', minPrice).lte('price', maxPrice);
            }
          }
        }

        // Apply sorting
        switch (sortBy) {
          case 'price-low':
            query = query.order('price', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'name':
            query = query.order('name', { ascending: true });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
          if (onCountChange) onCountChange(0);
        } else {
          const transformedProducts = (data || []).map((product: any) => ({
            id: product.id,
            name: product.name,
            category: product.categories?.name || 'Uncategorized',
            price: product.price,
            image_url: product.image_url,
            second_image_url: product.second_image_url || null,
            images: product.images || (product.image_url ? [product.image_url] : []),
            is_new: product.is_new || false,
            is_pre_order: product.is_pre_order || false,
            is_limited_edition: product.is_limited_edition || false,
            slug: product.slug,
            material: product.material || null
          }));

          setProducts(transformedProducts);
          if (onCountChange) onCountChange(transformedProducts.length);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        if (onCountChange) onCountChange(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortBy, filters]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Calculate paginated products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (loading) {
    return (
      <section className="w-full px-6 md:px-10 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 md:gap-x-7 md:gap-y-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-secondary/30 mb-4"></div>
              <div className="space-y-2 px-0.5">
                <div className="h-3 bg-secondary/30 rounded w-1/3"></div>
                <div className="h-4 bg-secondary/30 rounded w-3/4"></div>
                <div className="h-3 bg-secondary/30 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 md:px-10 mb-16">
      <AnimatedSection animation="fadeUp" stagger={0.04} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 md:gap-x-7 md:gap-y-12">
        {currentProducts.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-muted-foreground text-sm tracking-wider">No products found.</p>
          </div>
        ) : (
          currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              price={product.price}
              image_url={product.image_url}
              second_image_url={product.second_image_url}
              images={product.images}
              is_new={product.is_new}
              is_pre_order={product.is_pre_order}
              is_limited_edition={product.is_limited_edition}
              slug={product.slug}
            />
          ))
        )}
      </AnimatedSection>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
};

export default ProductGrid;
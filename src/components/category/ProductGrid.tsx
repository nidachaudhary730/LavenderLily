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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*, categories(name, slug)');

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
          default: // featured
            query = query.order('created_at', { ascending: false });
        }

        // Handle special "New In" filters
        if (category === 'new-arrivals' || category === 'new-in') {
          query = query.eq('is_new', true);
        } else if (category === 'pre-orders') {
          query = query.eq('is_pre_order', true);
        } else if (category === 'limited-edition') {
          query = query.eq('is_limited_edition', true);
        } else if (category && category !== 'shop') {
          // Regular category filter - If category is specified and not "shop" (All)
          const categorySlug = category.toLowerCase().replace(/\s*\/\s*/g, '-').replace(/\s+/g, '-');

          // First, find the category by slug
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .maybeSingle();

          if (categoryError) {
            console.log("Error checking category", categoryError);
          }

          if (categoryData) {
            query = query.eq('category_id', categoryData.id);
          } else {
            console.log(`Category '${category}' with slug '${categorySlug}' not found in DB.`);
            setProducts([]);
            if (onCountChange) onCountChange(0);
            setLoading(false);
            return;
          }
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
          if (onCountChange) onCountChange(0);
        } else {
          // Transform the data to match our Product interface
          let transformedProducts = (data || []).map((product: any) => ({
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

          // Apply Client-Side Filtering based on activeFilters
          if (filters) {
            // Filter by Category
            if (filters.categories.length > 0) {
              transformedProducts = transformedProducts.filter(p =>
                filters.categories.includes(p.category)
              );
            }

            // Filter by Price
            if (filters.priceRanges.length > 0) {
              transformedProducts = transformedProducts.filter(p => {
                return filters.priceRanges.some(range => {
                  if (range === "Under AED 100") return p.price < 100;
                  if (range === "AED 100 - AED 200") return p.price >= 100 && p.price <= 200;
                  if (range === "AED 200 - AED 500") return p.price >= 200 && p.price <= 500;
                  if (range === "AED 500+") return p.price > 500;
                  return false;
                });
              });
            }

            // Filter by Material (if applicable in future)
            // if (filters.materials.length > 0) { ... }
          }

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
        {products.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-muted-foreground text-sm tracking-wider">No products found.</p>
          </div>
        ) : (
          products.map((product) => (
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

      <Pagination />
    </section>
  );
};

export default ProductGrid;
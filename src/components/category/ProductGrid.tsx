import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
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
  slug: string;
}

interface ProductGridProps {
  category?: string;
}

// Products should be fetched from Supabase based on category filter
const ProductGrid = ({ category }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*, categories(name, slug)')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // If category is specified and not "shop" (All), filter by category
        if (category && category !== 'shop') {
          // Get category slug from the URL parameter
          const categorySlug = category.toLowerCase().replace(/\s*\/\s*/g, '-').replace(/\s+/g, '-');
          
          // First, find the category by slug
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single();

          if (categoryData) {
            query = query.eq('category_id', categoryData.id);
          }
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        } else {
          // Transform the data to match our Product interface
          const transformedProducts = (data || []).map((product: any) => ({
            id: product.id,
            name: product.name,
            category: product.categories?.name || 'Uncategorized',
            price: product.price,
            image_url: product.image_url,
            second_image_url: product.second_image_url || null,
            images: product.images || (product.image_url ? [product.image_url] : []),
            is_new: product.is_new || false,
            slug: product.slug
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted/20 mb-3"></div>
              <div className="h-4 bg-muted/20 rounded mb-2"></div>
              <div className="h-4 bg-muted/20 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 mb-16">
        <AnimatedSection animation="fadeUp" stagger={0.02} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-sm">No products found.</p>
            </div>
          ) : (
            products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card 
                className="border-none shadow-none bg-transparent group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                    {product.image_url ? (
                      <>
                        {/* Primary image */}
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0"
                        />
                        {/* Secondary image on hover - always show, use second image if available, otherwise use same image */}
                        <img
                          src={product.second_image_url || product.images?.[1] || product.image_url}
                          alt={`${product.name} - alternate view`}
                          className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                        <p className="text-muted-foreground text-xs">No Image</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                    {product.is_new && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-primary/5 text-xs font-medium text-primary z-10 pointer-events-none">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light text-foreground">
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm font-light text-foreground">
                        AED {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            ))
          )}
        </AnimatedSection>
      
      <Pagination />
    </section>
  );
};

export default ProductGrid;
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import AnimatedText from "../animations/AnimatedText";
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
  material?: string | null;
}

const ProductCarousel = () => {
  // Products should be fetched from Supabase
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name, slug)')
          .eq('is_active', true)
          .eq('is_new', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
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
            slug: product.slug,
            material: product.material || null
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
  }, []);
  return (
    <section className="w-full mb-16 px-6">
      <AnimatedText animation="fadeUp" delay={0}>
        <h2 className="text-sm font-light text-foreground mb-4 px-2">Featured Products</h2>
      </AnimatedText>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="">
          {loading ? (
            <CarouselItem className="basis-full">
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">Loading products...</p>
              </div>
            </CarouselItem>
          ) : products.length === 0 ? (
            <CarouselItem className="basis-full">
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">No products available.</p>
              </div>
            </CarouselItem>
          ) : (
            products.map((product, index) => (
              <CarouselItem
                key={product.id}
                className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
                data-animate-delay={index * 0.1}
              >
                <Link to={`/product/${product.slug}`}>
                  <Card className="border-none shadow-none bg-transparent group">
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
              </CarouselItem>
            ))
          )}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
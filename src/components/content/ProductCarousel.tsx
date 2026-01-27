import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import AnimatedText from "../animations/AnimatedText";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  isNew?: boolean;
}

const ProductCarousel = () => {
  // Products should be fetched from Supabase
  const [products, setProducts] = useState<Product[]>([]);
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
            {products.length === 0 ? (
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
                 <Link to={`/product/${product.id}`}>
                  <Card className="border-none shadow-none bg-transparent group">
                    <CardContent className="p-0">
                      <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-primary/5"></div>
                        {product.isNew && (
                          <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-primary">
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
                           {product.price}
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
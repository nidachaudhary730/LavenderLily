import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Minus, Plus } from "lucide-react";

const ProductInfo = () => {
  const [quantity, setQuantity] = useState(1);
  // Product data should be fetched from Supabase based on productId from route params
  const [product, setProduct] = useState<{
    name: string;
    category: string;
    price: string;
    material?: string;
    dimensions?: string;
    weight?: string;
    description?: string;
  } | null>(null);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">Loading product information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb - Show only on desktop */}
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/category/${product.category.toLowerCase()}`}>{product.category}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product title and price */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-light text-muted-foreground mb-1">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">{product.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xl font-light text-foreground">{product.price}</p>
          </div>
        </div>
      </div>

      {/* Product details */}
      {product.material || product.dimensions || product.weight || product.description ? (
        <div className="space-y-4 py-4 border-b border-border">
          {product.material && (
            <div className="space-y-2">
              <h3 className="text-sm font-light text-foreground">Material</h3>
              <p className="text-sm font-light text-muted-foreground">{product.material}</p>
            </div>
          )}
          
          {product.dimensions && (
            <div className="space-y-2">
              <h3 className="text-sm font-light text-foreground">Dimensions</h3>
              <p className="text-sm font-light text-muted-foreground">{product.dimensions}</p>
            </div>
          )}
          
          {product.weight && (
            <div className="space-y-2">
              <h3 className="text-sm font-light text-foreground">Weight</h3>
              <p className="text-sm font-light text-muted-foreground">{product.weight}</p>
            </div>
          )}
          
          {product.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-light text-foreground">Description</h3>
              <p className="text-sm font-light text-muted-foreground">{product.description}</p>
            </div>
          )}
        </div>
      ) : null}

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-light text-foreground">Quantity</span>
          <div className="flex items-center border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={decrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="h-10 flex items-center px-4 text-sm font-light min-w-12 justify-center border-l border-r border-border">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={incrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary-hover font-light rounded-none"
        >
          Add to Bag
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
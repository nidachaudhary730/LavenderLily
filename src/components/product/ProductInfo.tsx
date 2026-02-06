
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  image_url: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  is_new: boolean;
  is_active: boolean;
  stock_quantity: number;
  material: string | null;
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { addToCart } = useCart();

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    await addToCart(product.id, quantity, selectedSize || undefined, selectedColor || undefined);
    // Reset quantity after adding
    setQuantity(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount);
  };

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
            {product.categories && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/category/${product.categories.slug}`}>
                      {product.categories.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
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
            {product.categories && (
              <p className="text-sm font-light text-muted-foreground mb-1">
                {product.categories.name}
              </p>
            )}
            <h1 className="text-2xl md:text-3xl font-light text-foreground">{product.name}</h1>
            {product.material && (
              <p className="text-sm font-light text-muted-foreground mt-1">
                Material: {product.material}
              </p>
            )}
            {product.is_new && (
              <span className="inline-block mt-2 text-xs bg-primary text-primary-foreground px-2 py-1">
                NEW
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-xl font-light text-foreground">{formatCurrency(product.price)}</p>
            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Only {product.stock_quantity} left
              </p>
            )}
            {product.stock_quantity === 0 && (
              <p className="text-sm text-destructive mt-1">Out of stock</p>
            )}
          </div>
        </div>
      </div>

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-4 py-6 border-t border-border">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-medium text-foreground">
              Select Size <span className="text-muted-foreground ml-2 font-light">(UK / US)</span>
            </h3>
            <Link
              to="/about/size-guide"
              className="text-[10px] uppercase tracking-widest underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              Size Guide
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[50px] h-12 border text-xs font-light transition-all duration-300 ${selectedSize === size
                  ? 'border-foreground bg-foreground text-background shadow-lg'
                  : 'border-border hover:border-muted-foreground'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3 py-4 border-t border-border">
          <h3 className="text-sm font-light text-foreground">Color</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border text-sm font-light transition-colors ${selectedColor === color
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border hover:border-foreground'
                  }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity and Add to Cart */}
      <div className="space-y-4 py-4 border-t border-border">
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
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
        >
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Bag'}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;

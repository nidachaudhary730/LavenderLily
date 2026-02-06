import { Link } from "react-router-dom";

interface ProductCardProps {
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
}

const ProductCard = ({
  name,
  category,
  price,
  image_url,
  second_image_url,
  images,
  is_new,
  is_pre_order,
  is_limited_edition,
  slug,
}: ProductCardProps) => {
  const hoverImage = second_image_url || images?.[1] || image_url;

  return (
    <Link to={`/product/${slug}`} className="group block">
      {/* Image container — generous aspect ratio */}
      <div className="aspect-[3/4] mb-4 overflow-hidden bg-secondary/40 relative">
        {image_url ? (
          <>
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:opacity-0 absolute inset-0"
              loading="lazy"
            />
            <img
              src={hoverImage || image_url}
              alt={`${name} - alternate view`}
              className="w-full h-full object-cover transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-[1.03] absolute inset-0"
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground text-xs tracking-wider uppercase">
              No Image
            </p>
          </div>
        )}

        {/* Badges */}
        {is_new && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-foreground/90 text-background text-[10px] tracking-[0.15em] uppercase font-medium z-10">
            New
          </span>
        )}
        {is_pre_order && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-accent-foreground/90 text-background text-[10px] tracking-[0.15em] uppercase font-medium z-10">
            Pre-Order
          </span>
        )}
        {is_limited_edition && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-destructive/80 text-destructive-foreground text-[10px] tracking-[0.15em] uppercase font-medium z-10">
            Limited
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5 px-0.5">
        <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground font-light">
          {category}
        </p>
        <h3 className="text-sm font-normal text-foreground leading-snug tracking-wide">
          {name}
        </h3>
        <p className="text-sm text-foreground/70 font-light tracking-wide">
          ${price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;

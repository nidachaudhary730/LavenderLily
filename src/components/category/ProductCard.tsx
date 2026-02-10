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
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {is_new && (
            <span className="px-2.5 py-1 bg-primary text-primary-foreground text-[9px] tracking-[0.15em] uppercase font-bold shadow-sm">
              New
            </span>
          )}
          {is_pre_order && (
            <span className="px-2.5 py-1 bg-white/90 text-primary-foreground border border-primary/20 text-[9px] tracking-[0.15em] uppercase font-bold shadow-sm">
              Pre-Order
            </span>
          )}
          {is_limited_edition && (
            <span className="px-2.5 py-1 bg-foreground text-background text-[9px] tracking-[0.15em] uppercase font-bold shadow-sm">
              Limited
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1 mt-4 px-0.5 text-center">
        <h3 className="text-[13px] font-normal text-foreground leading-snug tracking-wider hover:underline transition-all duration-300 font-cinzel uppercase">
          {name}
        </h3>
        <p className="text-[12px] text-foreground/80 font-normal tracking-wider">
          AED {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;

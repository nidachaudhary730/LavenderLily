-- Add product tags for New In functionality (pre-order, limited edition, etc.)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_pre_order boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_limited_edition boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS collection text DEFAULT NULL;

-- Add index for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_new ON public.products (is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_products_pre_order ON public.products (is_pre_order) WHERE is_pre_order = true;
CREATE INDEX IF NOT EXISTS idx_products_limited ON public.products (is_limited_edition) WHERE is_limited_edition = true;
-- Add images array column for multiple product images
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add second_image_url column to products table for hover effect (deprecated, use images array instead)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS second_image_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.products.images IS 'Array of image URLs for product gallery (first image is primary)';
COMMENT ON COLUMN public.products.second_image_url IS 'Second image URL for hover effect (deprecated, use images array instead)';

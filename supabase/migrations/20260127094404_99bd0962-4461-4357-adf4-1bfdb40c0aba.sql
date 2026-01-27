-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Categories: Everyone can view, only admins can modify
CREATE POLICY "Anyone can view categories"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Admins can insert categories"
ON public.categories FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
ON public.categories FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
ON public.categories FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Products: Everyone can view active, only admins can modify
CREATE POLICY "Anyone can view active products"
ON public.products FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update timestamp triggers
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories for girls clothing
INSERT INTO public.categories (name, slug, description) VALUES
  ('Dresses', 'dresses', 'Beautiful dresses for every occasion'),
  ('Tops', 'tops', 'Stylish tops and blouses'),
  ('Bottoms', 'bottoms', 'Skirts, pants, and shorts'),
  ('Outerwear', 'outerwear', 'Jackets, coats, and cardigans'),
  ('Accessories', 'accessories', 'Hair accessories, bags, and more');
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

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
  is_pre_order: boolean;
  is_limited_edition: boolean;
  collection: string | null;
  stock_quantity: number;
  material: string | null;
  categories?: Category | null;
}

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category_id: '',
    sizes: '',
    colors: '',
    is_new: false,
    is_active: true,
    is_pre_order: false,
    is_limited_edition: false,
    collection: '',
    stock_quantity: '0',
    material: '',
  });

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch products', variant: 'destructive' });
    } else {
      // Ensure images array exists
      const productsWithImages = (data || []).map((product: any) => ({
        ...product,
        images: product.images || (product.image_url ? [product.image_url] : [])
      }));
      setProducts(productsWithImages);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').order('name');
    setCategories(data || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      category_id: '',
      sizes: '',
      colors: '',
      is_new: false,
      is_active: true,
      is_pre_order: false,
      is_limited_edition: false,
      collection: '',
      stock_quantity: '0',
      material: '',
    });
    setProductImages([]);
    setEditingProduct(null);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price.toString(),
        category_id: product.category_id || '',
        sizes: product.sizes?.join(', ') || '',
        colors: product.colors?.join(', ') || '',
        is_new: product.is_new,
        is_active: product.is_active,
        is_pre_order: product.is_pre_order || false,
        is_limited_edition: product.is_limited_edition || false,
        collection: product.collection || '',
        stock_quantity: product.stock_quantity.toString(),
        material: product.material || '',
      });
      // Set images array, fallback to image_url if images array doesn't exist
      setProductImages(product.images || (product.image_url ? [product.image_url] : []));
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Error', description: `${file.name} is not an image file`, variant: 'destructive' });
        return null;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Error', description: `${file.name} is too large (max 5MB)`, variant: 'destructive' });
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return data.publicUrl;
      } catch (error: any) {
        console.error('Upload error:', error);
        toast({
          title: 'Error',
          description: `Failed to upload ${file.name}: ${error.message}`,
          variant: 'destructive'
        });
        return null;
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter((url): url is string => url !== null);

    if (validUrls.length > 0) {
      setProductImages([...productImages, ...validUrls]);
      toast({ title: 'Success', description: `Uploaded ${validUrls.length} image(s)` });
    }

    setUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const imageUrl = productImages[index];
    setProductImages(productImages.filter((_, i) => i !== index));

    // Optionally delete from storage (you might want to keep this for cleanup)
    // Extract file path from URL and delete from storage
    if (imageUrl.includes('/product-images/')) {
      const filePath = imageUrl.split('/product-images/')[1];
      supabase.storage
        .from('product-images')
        .remove([filePath])
        .catch(console.error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productImages.length === 0) {
      toast({ title: 'Error', description: 'Please upload at least one image', variant: 'destructive' });
      return;
    }

    const slug = formData.slug || generateSlug(formData.name);
    const productData = {
      name: formData.name,
      slug,
      description: formData.description || null,
      price: parseFloat(formData.price),
      category_id: formData.category_id || null,
      image_url: productImages[0] || null, // First image as primary
      images: productImages, // All images in array
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
      is_new: formData.is_new,
      is_active: formData.is_active,
      is_pre_order: formData.is_pre_order,
      is_limited_edition: formData.is_limited_edition,
      collection: formData.collection || null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      material: formData.material || null,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        toast({ title: 'Error', description: 'Failed to update product', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Product updated' });
        fetchProducts();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from('products').insert([productData]);

      if (error) {
        toast({ title: 'Error', description: 'Failed to create product', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Product created' });
        fetchProducts();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Product deleted' });
      fetchProducts();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-light">Products ({products.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="rounded-none">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="!rounded-none max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-light">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (€) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Slug (auto-generated)</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder={generateSlug(formData.name)}
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-none"
                />
              </div>

              <div className="space-y-4">
                <Label>Product Images *</Label>
                <div
                  className={`border-2 border-dashed rounded-none p-6 text-center transition-colors ${isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}>
                      {isDragging ? 'Drop images here' : 'Click to upload images or drag and drop'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Multiple images allowed (max 5MB each)
                    </span>
                  </label>
                  {uploading && (
                    <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                  )}
                </div>

                {/* Image Preview Grid */}
                {productImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {productImages.map((imageUrl, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={imageUrl}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sizes (comma separated)</Label>
                  <Input
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="XS, S, M, L, XL"
                    className="rounded-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Colors (comma separated)</Label>
                  <Input
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Pink, Lavender, White"
                    className="rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stock Quantity</Label>
                  <Input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="rounded-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_new}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                    />
                    <Label>New Arrival</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_pre_order}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_pre_order: checked })}
                    />
                    <Label>Pre-Order</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_limited_edition}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_limited_edition: checked })}
                    />
                    <Label>Limited Edition</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Collection (optional)</Label>
                <Input
                  value={formData.collection}
                  onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                  placeholder="e.g., Spring 2026, Summer Collection"
                  className="rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Material (optional)</Label>
                <Input
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g., 100% Cotton, Linen Blend"
                  className="rounded-none"
                />
              </div>

              <Button type="submit" className="w-full rounded-none">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{product.name}</span>
                  {product.is_new && <Badge variant="secondary">NEW</Badge>}
                  {product.is_pre_order && <Badge variant="outline" className="border-primary text-primary">PRE-ORDER</Badge>}
                  {product.is_limited_edition && <Badge variant="outline" className="border-destructive text-destructive">LIMITED</Badge>}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {product.categories?.name || '-'}
              </TableCell>
              <TableCell>€{product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock_quantity}</TableCell>
              <TableCell>
                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No products yet. Add your first product!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsManager;

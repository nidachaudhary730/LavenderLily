import { useState, useEffect } from 'react';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
  sizes: string[];
  colors: string[];
  is_new: boolean;
  is_active: boolean;
  stock_quantity: number;
  categories?: Category | null;
}

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    sizes: '',
    colors: '',
    is_new: false,
    is_active: true,
    stock_quantity: '0',
  });

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch products', variant: 'destructive' });
    } else {
      setProducts(data || []);
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
      image_url: '',
      sizes: '',
      colors: '',
      is_new: false,
      is_active: true,
      stock_quantity: '0',
    });
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
        image_url: product.image_url || '',
        sizes: product.sizes?.join(', ') || '',
        colors: product.colors?.join(', ') || '',
        is_new: product.is_new,
        is_active: product.is_active,
        stock_quantity: product.stock_quantity.toString(),
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = formData.slug || generateSlug(formData.name);
    const productData = {
      name: formData.name,
      slug,
      description: formData.description || null,
      price: parseFloat(formData.price),
      category_id: formData.category_id || null,
      image_url: formData.image_url || null,
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
      is_new: formData.is_new,
      is_active: formData.is_active,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
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
              
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="rounded-none"
                />
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
                <div className="flex items-center gap-6 pt-6">
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
                </div>
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

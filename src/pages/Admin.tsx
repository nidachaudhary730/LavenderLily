import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductsManager from '@/components/admin/ProductsManager';
import CategoriesManager from '@/components/admin/CategoriesManager';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, user, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-light text-foreground">Admin Dashboard</h1>
          </div>
          <span className="text-sm text-muted-foreground">LavenderLily</span>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-6 rounded-none">
            <TabsTrigger value="products" className="rounded-none">Products</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-none">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

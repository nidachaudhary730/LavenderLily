import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse text-center text-muted-foreground">
              Loading...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-8 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-foreground mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">Your saved items</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-light text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start adding items you love to your wishlist
            </p>
            <Button
              onClick={() => navigate('/category/shop')}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;

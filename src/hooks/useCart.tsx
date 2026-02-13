import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string | null;
    images: string[];
    category_id: string | null;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      if (!user) {
        // Guest user - fetch from local storage
        const localCartStr = localStorage.getItem('guest_cart');
        const localCart = localCartStr ? JSON.parse(localCartStr) : [];

        if (localCart.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Fetch product details for local items
        const productIds = localCart.map((item: any) => item.product_id);

        // Use maybeSingle if only one item to avoid array issues, but .in() works fine usually
        const { data: products, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            price,
            image_url,
            images,
            category_id
          `)
          .in('id', productIds);

        if (error) {
          console.error('Error fetching guest products:', error);
          throw error;
        }

        // Merge local item data with product details
        const formattedItems = localCart.map((localItem: any) => {
          const product = products?.find(p => p.id === localItem.product_id);
          if (!product) return null;
          return {
            ...localItem,
            product,
          };
        }).filter((item): item is CartItem => item !== null);

        setCartItems(formattedItems);
      } else {
        // Logged in user - fetch from Supabase

        // First check if we need to merge guest cart
        const localCartStr = localStorage.getItem('guest_cart');
        const localCart = localCartStr ? JSON.parse(localCartStr) : [];

        if (localCart.length > 0) {
          // Fetch current server items to compare
          const { data: serverItems, error: fetchError } = await supabase
            .from('cart_items')
            .select('id, product_id, quantity, size, color')
            .eq('user_id', user.id);

          if (fetchError) throw fetchError;

          // Process merges
          for (const localItem of localCart) {
            const existingItem = serverItems?.find(item =>
              item.product_id === localItem.product_id &&
              item.size === localItem.size &&
              item.color === localItem.color
            );

            if (existingItem) {
              // Update quantity
              await supabase
                .from('cart_items')
                .update({ quantity: existingItem.quantity + localItem.quantity })
                .eq('id', existingItem.id);
            } else {
              // Insert new item
              await supabase
                .from('cart_items')
                .insert({
                  user_id: user.id,
                  product_id: localItem.product_id,
                  quantity: localItem.quantity,
                  size: localItem.size,
                  color: localItem.color,
                });
            }
          }

          // Clear local storage after merging
          localStorage.removeItem('guest_cart');
        }

        // Fetch final cart state
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            product_id,
            quantity,
            size,
            color,
            products (
              id,
              name,
              slug,
              price,
              image_url,
              images,
              category_id
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        const formattedItems = (data || []).map((item: any) => ({
          ...item,
          product: item.products,
        }));

        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchCart();

    // Add event listener for storage changes (to sync across tabs/components if needed)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'guest_cart') {
        fetchCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('cart-updated', fetchCart);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart-updated', fetchCart);
    };
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity: number, size?: string, color?: string) => {
    try {
      if (!user) {
        // Guest user - save to local storage
        const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const existingItemIndex = localCart.findIndex(
          (item: any) => item.product_id === productId && item.size === (size || null) && item.color === (color || null)
        );

        if (existingItemIndex > -1) {
          localCart[existingItemIndex].quantity += quantity;
        } else {
          localCart.push({
            id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate temporary ID
            product_id: productId,
            quantity,
            size: size || null,
            color: color || null,
          });
        }

        localStorage.setItem('guest_cart', JSON.stringify(localCart));

        // Dispatch custom event to notify listeners
        window.dispatchEvent(new Event('cart-updated'));

        await fetchCart(); // Refresh state
        toast({
          title: 'Added to cart',
          description: 'Item has been added to your cart',
        });
        return;
      }

      // Logged in user
      const existingItem = cartItems.find(
        item => item.product_id === productId && item.size === (size || null) && item.color === (color || null)
      );

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
            size: size || null,
            color: color || null,
          });

        if (error) throw error;
      }

      await fetchCart();
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart',
      });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      if (!user) {
        const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const updatedCart = localCart.map((item: any) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        localStorage.setItem('guest_cart', JSON.stringify(updatedCart));

        window.dispatchEvent(new Event('cart-updated'));

        setCartItems(items =>
          items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        );
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quantity',
        variant: 'destructive',
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (!user) {
        const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const updatedCart = localCart.filter((item: any) => item.id !== itemId);
        localStorage.setItem('guest_cart', JSON.stringify(updatedCart));

        window.dispatchEvent(new Event('cart-updated'));

        setCartItems(items => items.filter(item => item.id !== itemId));
        toast({
          title: 'Removed',
          description: 'Item removed from cart',
        });
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(items => items.filter(item => item.id !== itemId));
      toast({
        title: 'Removed',
        description: 'Item removed from cart',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  const clearCart = async () => {
    try {
      if (!user) {
        localStorage.removeItem('guest_cart');
        setCartItems([]);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Ensure existing items have product details before calculating
      if (!item.product) return total;
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      refetch: fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

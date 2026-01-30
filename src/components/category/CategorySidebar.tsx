import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CategorySidebar = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <aside className="hidden lg:block w-64 sticky top-32 h-fit px-6">
      <nav className="space-y-1">
        <h3 className="text-lg font-light text-foreground mb-6">Categories</h3>
        
        {/* All Products link */}
        <NavLink
          to="/category/shop"
          className={({ isActive }) =>
            `block py-2 text-sm font-light transition-all ${
              isActive
                ? 'text-primary underline decoration-2 underline-offset-4'
                : 'text-muted-foreground hover:text-foreground hover:underline hover:decoration-1 hover:underline-offset-4'
            }`
          }
        >
          All
        </NavLink>

        {isLoading ? (
          <div className="py-2 text-sm text-muted-foreground animate-pulse">Loading...</div>
        ) : (
          categories.map((cat) => (
            <NavLink
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={({ isActive }) =>
                `block py-2 text-sm font-light transition-all ${
                  isActive
                    ? 'text-primary underline decoration-2 underline-offset-4'
                    : 'text-muted-foreground hover:text-foreground hover:underline hover:decoration-1 hover:underline-offset-4'
                }`
              }
            >
              {cat.name}
            </NavLink>
          ))
        )}
      </nav>
    </aside>
  );
};

export default CategorySidebar;

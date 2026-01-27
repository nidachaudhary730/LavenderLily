import { NavLink } from 'react-router-dom';

const categories = [
  { name: 'All', slug: 'shop' },
  { name: 'Tops / Shirts', slug: 'tops-shirts' },
  { name: 'Dresses', slug: 'dresses' },
  { name: 'Pants', slug: 'pants' },
  { name: 'Skirts', slug: 'skirts' },
  { name: 'Co-ord set', slug: 'co-ord-set' },
  { name: 'Ethnic', slug: 'ethnic' }
];

const CategorySidebar = () => {
  return (
    <aside className="hidden lg:block w-64 sticky top-32 h-fit px-6">
      <nav className="space-y-1">
        <h3 className="text-lg font-light text-foreground mb-6">Categories</h3>
        {categories.map((cat) => (
          <NavLink
            key={cat.slug}
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
        ))}
      </nav>
    </aside>
  );
};

export default CategorySidebar;

import { ArrowRight, X, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ShoppingBag from "./ShoppingBag";
import UserMenu from "./UserMenu";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [offCanvasType, setOffCanvasType] = useState<'favorites' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShoppingBagOpen, setIsShoppingBagOpen] = useState(false);

  // Fetch categories from database
  const { data: categories = [] } = useQuery({
    queryKey: ['nav-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  // Preload dropdown images for faster display
  useEffect(() => {
    const imagesToPreload = [
      "/images/categories/dresses/1.png",
      "/images/categories/tops/1.png",
      "/images/categories/party-wear/1.png",
      "/images/categories/skirts/1.png",
      "/images/categories/co-ords/1.png"
    ];

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const navItems = [
    {
      name: "Shop",
      href: "/category/shop",
      submenuItems: categories.map(cat => cat.name),
      images: [
        { src: "/images/categories/dresses/1.png", alt: "Dresses Collection", label: "Dresses", href: "/category/dresses" },
        { src: "/images/categories/tops/1.png", alt: "Tops Collection", label: "Tops", href: "/category/tops" }
      ]
    },
    {
      name: "New In",
      href: "/category/new-in",
      submenuItems: [
        { name: "New Arrivals", slug: "new-arrivals", filter: "is_new" },
        { name: "Pre-Orders", slug: "pre-orders", filter: "is_pre_order" },
        { name: "Limited Edition", slug: "limited-edition", filter: "is_limited_edition" }
      ],
      images: [
        { src: "/images/categories/party-wear/1.png", alt: "New Arrivals", label: "New Arrivals", href: "/category/new-arrivals" },
        { src: "/images/categories/skirts/1.png", alt: "Limited Edition", label: "Limited", href: "/category/limited-edition" }
      ]
    },
    {
      name: "About",
      href: "/about/our-story",
      submenuItems: [
        { name: "Our Story", slug: "our-story" },
        { name: "Sustainability", slug: "sustainability" },
        { name: "Size Guide", slug: "size-guide" },
        { name: "Customer Care", slug: "customer-care" },
        { name: "Store Locator", slug: "store-locator" }
      ],
      images: [
        { src: "/images/categories/co-ords/1.png", alt: "Our Story", label: "Read our story", href: "/about/our-story" }
      ]
    }
  ];

  const getSubmenuLink = (activeDropdownName: string, subItem: string | { name: string; slug: string; filter?: string }) => {
    if (activeDropdownName === "About") {
      const slug = typeof subItem === 'object' ? subItem.slug : subItem.toLowerCase().replace(/\s+/g, '-');
      return `/about/${slug}`;
    } else if (activeDropdownName === "New In") {
      const slug = typeof subItem === 'object' ? subItem.slug : subItem.toLowerCase().replace(/\s+/g, '-');
      return `/category/${slug}`;
    } else {
      // Shop - find matching category
      const itemName = typeof subItem === 'object' ? subItem.name : subItem;
      const category = categories.find(cat => cat.name === itemName);
      return category ? `/category/${category.slug}` : `/category/${itemName.toLowerCase().replace(/\s*\/\s*/g, '-').replace(/\s+/g, '-')}`;
    }
  };

  const getSubmenuItemName = (subItem: string | { name: string; slug: string; filter?: string }) => {
    return typeof subItem === 'object' ? subItem.name : subItem;
  };

  return (
    <nav
      className="relative"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="border-b border-border/40">
        <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-6 max-w-[1700px] mx-auto">
          {/* Left: Search icon */}
          <div className="flex-1 flex items-center">
            <button
              className="p-2 text-foreground hover:opacity-70 transition-opacity duration-200"
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>

          {/* Center: Logo & Branding */}
          <div className="flex-[3] flex justify-center">
            <Link to="/" className="flex items-center gap-5 group py-1">
              <div className="w-9 h-9 md:w-12 md:h-12 bg-primary/90 flex items-center justify-center rounded-[2px] shadow-sm shrink-0">
                <img
                  src="/favicon.ico"
                  alt="Lavender Lily Logo"
                  className="w-6 h-6 md:w-8 md:h-8 object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-base md:text-2xl font-cinzel tracking-[0.2em] md:tracking-[0.3em] text-foreground leading-none mb-0 md:mb-2 whitespace-nowrap">
                  LAVENDER LILY
                </h1>
                <p className="hidden md:block text-[9.5px] font-light tracking-[0.25em] text-muted-foreground uppercase opacity-80 whitespace-nowrap">
                  A Bloom of Elegance in every thread
                </p>
              </div>
            </Link>
          </div>

          {/* Right: User & Bag icons */}
          <div className="flex-1 flex items-center justify-end">
            <div className="hidden md:flex items-center">
              <UserMenu />
            </div>
            <button
              className="p-2 text-foreground hover:opacity-70 transition-opacity duration-200 relative"
              aria-label="Shopping bag"
              onClick={() => setIsShoppingBagOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>

            {/* Mobile hamburger button */}
            <button
              className="lg:hidden p-2 text-foreground ml-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 relative">
                <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1.5'}`}></span>
                <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 top-2.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-3.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Navigation - Desktop only */}
      <div className="hidden lg:flex justify-center border-b border-border/40">
        <div className="flex space-x-12 py-3">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={item.href}
                className="text-[10px] tracking-[0.25em] font-light text-foreground/80 hover:text-foreground transition-colors duration-200 uppercase"
              >
                {item.name}
              </Link>
            </div>
          ))}
          {/* Add some more direct links to match the image density */}
          <Link to="/category/new-arrivals" className="text-[11px] tracking-[0.2em] font-light text-foreground/80 hover:text-foreground transition-colors duration-200 uppercase">
            New Arrivals
          </Link>
          <Link to="/about/store-locator" className="text-[11px] tracking-[0.2em] font-light text-foreground/80 hover:text-foreground transition-colors duration-200 uppercase">
            Our Stores
          </Link>
        </div>
      </div>

      {/* Full width dropdown */}
      {activeDropdown && (
        <div
          className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50"
          onMouseEnter={() => setActiveDropdown(activeDropdown)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="px-6 py-8">
            <div className="flex justify-between w-full">
              {/* Left side - Menu items */}
              <div className="flex-1">
                <ul className="space-y-2">
                  {navItems
                    .find(item => item.name === activeDropdown)
                    ?.submenuItems.map((subItem, index) => (
                      <li key={index}>
                        <Link
                          to={getSubmenuLink(activeDropdown, subItem)}
                          className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light block py-2"
                        >
                          {getSubmenuItemName(subItem)}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Right side - Images */}
              <div className="flex space-x-6">
                {navItems
                  .find(item => item.name === activeDropdown)
                  ?.images.map((image, index) => (
                    <Link key={index} to={image.href} className="w-[400px] h-[280px] cursor-pointer group relative overflow-hidden block">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                      />
                      <div className="absolute bottom-2 left-2 text-white text-xs font-light flex items-center gap-1">
                        <span>{image.label}</span>
                        <ArrowRight size={12} />
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {isSearchOpen && (
        <div
          className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50"
        >
          <div className="px-6 py-8">
            <div className="max-w-2xl mx-auto">
              {/* Search input */}
              <div className="relative mb-8">
                <div className="flex items-center border-b border-border pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-nav-foreground mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for clothing..."
                    className="flex-1 bg-transparent text-nav-foreground placeholder:text-nav-foreground/60 outline-none text-lg"
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick links */}
              <div>
                <h3 className="text-nav-foreground text-sm font-light mb-4">Quick Links</h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/category/new-arrivals"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-nav-foreground hover:text-primary-foreground text-sm font-light py-2 px-4 border border-primary rounded-none transition-colors duration-200 hover:bg-primary"
                  >
                    New Arrivals
                  </Link>
                  <Link
                    to="/category/limited-edition"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-nav-foreground hover:text-primary-foreground text-sm font-light py-2 px-4 border border-primary rounded-none transition-colors duration-200 hover:bg-primary"
                  >
                    Limited Edition
                  </Link>
                  <Link
                    to="/category/pre-orders"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-nav-foreground hover:text-primary-foreground text-sm font-light py-2 px-4 border border-primary rounded-none transition-colors duration-200 hover:bg-primary"
                  >
                    Pre-Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
          <div className="px-6 py-8">
            <div className="space-y-6">
              {/* Mobile menu actions */}
              <div className="flex flex-col space-y-3 pb-6 border-b border-border">
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-base font-light py-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  Search
                </button>
                <button
                  onClick={() => {
                    setOffCanvasType('favorites');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-base font-light py-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  Favorites
                </button>
                <div className="flex items-center gap-3 text-nav-foreground text-base font-light py-2">
                  <UserMenu />
                  <span>Account</span>
                </div>
              </div>

              {/* Navigation items */}
              {navItems.map((item, index) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-lg font-light block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  <div className="mt-3 pl-4 space-y-2">
                    {item.submenuItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={getSubmenuLink(item.name, subItem)}
                        className="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {getSubmenuItemName(subItem)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shopping Bag Component */}
      <ShoppingBag
        isOpen={isShoppingBagOpen}
        onClose={() => setIsShoppingBagOpen(false)}
        onViewFavorites={() => {
          setIsShoppingBagOpen(false);
          setOffCanvasType('favorites');
        }}
      />

      {/* Favorites Off-canvas overlay */}
      {offCanvasType === 'favorites' && (
        <div className="fixed inset-0 z-50 h-screen">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 h-screen"
            onClick={() => setOffCanvasType(null)}
          ></div>

          {/* Off-canvas panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-lg font-light">Favorites</h2>
                <button
                  onClick={() => setOffCanvasType(null)}
                  className="text-nav-foreground hover:text-nav-hover transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 mx-auto text-muted-foreground mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  <p className="text-muted-foreground text-sm">No favorites yet</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Items you love will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

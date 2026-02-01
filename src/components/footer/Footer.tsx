import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ['footer-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name')
        .limit(5);
      if (error) throw error;
      return data || [];
    }
  });
  return (
    <footer className="w-full bg-secondary text-foreground pt-16 pb-8 px-6 border-t border-primary/50 mt-48">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Brand - Left side */}
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-cinzel tracking-[0.2em] text-foreground">Lavender Lily</h2>
              <p className="text-[0.6rem] font-light tracking-[0.1em] text-muted-foreground uppercase">
                A Blossom of elegance in every thread
              </p>
            </div>
            <p className="text-sm font-light text-foreground/70 leading-relaxed max-w-md">
              Beautiful girls clothing for every occasion, crafted with love and elegance for your special moments.
            </p>

            {/* Contact Information */}
            <div className="space-y-4 text-sm font-light text-foreground/70">
              <div>
                <p className="font-semibold text-foreground/90 mb-1">Visit Us</p>
                <p>Al Nasr Square, Block B</p>
                <p>Shop No 11, Oud Maitha</p>
                <p>Dubai, UAE</p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">Contact</p>
                <p>+971 58 836 6059</p>
                <p>lavenderlilyuae@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Link lists - Right side */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Shop - Dynamic Categories */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-6 text-foreground/90">Shop</h4>
              <ul className="space-y-3">
                <li><Link to="/category/new-in" className="text-sm font-light text-foreground/60 hover:text-nav-hover transition-colors">New In</Link></li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/category/${cat.slug}`} className="text-sm font-light text-foreground/60 hover:text-nav-hover transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-6 text-foreground/90">Support</h4>
              <ul className="space-y-3">
                <li><Link to="/about/size-guide" className="text-sm font-light text-foreground/60 hover:text-nav-hover transition-colors">Size Guide</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-foreground/60 hover:text-nav-hover transition-colors">Care Instructions</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-foreground/60 hover:text-nav-hover transition-colors">Returns</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-foreground/60 hover:text-nav-hover transition-colors">Shipping</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-foreground/60 hover:text-nav-hover transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-6 text-foreground/90">Connect</h4>
              <ul className="space-y-3">
                <li><a href="https://www.instagram.com/lavenderlily_uae?igsh=dzNhM2l4YWxpMjd5&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-sm font-light text-foreground/60 hover:text-nav-hover transition-colors">Instagram</a></li>
                <li><a href="#" className="text-sm font-light text-foreground/60 hover:text-nav-hover transition-colors">Pinterest</a></li>
                <li><a href="#" className="text-sm font-light text-foreground/60 hover:text-nav-hover transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section - edge to edge separator */}
        <div className="border-t border-primary/30 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm font-light text-foreground/50">
                © 2026 Lavender Lily. All rights reserved.
              </p>
              <p className="text-[0.7rem] font-light text-foreground/40 mt-1">
                Designed and developed by <a href="https://www.linkedin.com/in/mohdjarirnoorkhan/" target="_blank" rel="noopener noreferrer" className="hover:text-nav-hover transition-colors underline underline-offset-4">Mohd Jarir Khan</a>
              </p>
            </div>
            <div className="flex space-x-8">
              <Link to="/privacy-policy" className="text-xs font-light text-foreground/50 hover:text-nav-hover transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-xs font-light text-foreground/50 hover:text-nav-hover transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
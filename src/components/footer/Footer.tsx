import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black pt-8 pb-2 px-6 border-t border-[#e5e5e5] mt-48">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Brand - Left side */}
          <div>
            <h2 className="text-xl font-light tracking-widest mb-4">LavenderLily</h2>
            <p className="text-sm font-light text-black/70 leading-relaxed max-w-md mb-6">
              Beautiful girls clothing for every occasion
            </p>
            
            {/* Contact Information */}
            <div className="space-y-2 text-sm font-light text-black/70">
              <div>
                <p className="font-normal text-black mb-1">Visit Us</p>
                <p>123 Madison Avenue</p>
                <p>New York, NY 10016</p>
              </div>
              <div>
                <p className="font-normal text-black mb-1 mt-3">Contact</p>
                <p>+1 (212) 555-0123</p>
                <p>hello@lavenderlily.com</p>
              </div>
            </div>
          </div>

          {/* Link lists - Right side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shop */}
            <div>
              <h4 className="text-sm font-normal mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><Link to="/category/new-in" className="text-sm font-light text-black/70 hover:text-black transition-colors">New In</Link></li>
                <li><Link to="/category/dresses" className="text-sm font-light text-black/70 hover:text-black transition-colors">Dresses</Link></li>
                <li><Link to="/category/tops" className="text-sm font-light text-black/70 hover:text-black transition-colors">Tops</Link></li>
                <li><Link to="/category/bottoms" className="text-sm font-light text-black/70 hover:text-black transition-colors">Bottoms</Link></li>
                <li><Link to="/category/outerwear" className="text-sm font-light text-black/70 hover:text-black transition-colors">Outerwear</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-normal mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/about/size-guide" className="text-sm font-light text-black/70 hover:text-black transition-colors">Size Guide</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Care Instructions</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Returns</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Shipping</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-normal mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Instagram</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Pinterest</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - edge to edge separator */}
      <div className="border-t border-[#e5e5e5] -mx-6 px-6 pt-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-light text-black mb-1 md:mb-0">
            © 2024 LavenderLily. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-primary text-white pt-8 pb-2 px-6 border-t border-primary/20 mt-48">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Brand - Left side */}
          <div>
            <h2 className="text-xl font-light tracking-widest mb-4 text-white">LavenderLily</h2>
            <p className="text-sm font-light text-white/80 leading-relaxed max-w-md mb-6">
              Beautiful girls clothing for every occasion
            </p>

            {/* Contact Information */}
            <div className="space-y-2 text-sm font-light text-white/80">
              <div>
                <p className="font-normal text-white mb-1">Visit Us</p>
                <p>Al Nasr Square, Block B</p>
                <p>Shop No 11, Oud Maitha</p>
                <p>Dubai, UAE</p>
              </div>
              <div>
                <p className="font-normal text-white mb-1 mt-3">Contact</p>
                <p>+971 58 836 6059</p>
                <p>lavenderlilyuae@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Link lists - Right side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shop */}
            <div>
              <h4 className="text-sm font-normal mb-4 text-white">Shop</h4>
              <ul className="space-y-2">
                <li><Link to="/category/new-in" className="text-sm font-light text-white/80 hover:text-white transition-colors">New In</Link></li>
                <li><Link to="/category/dresses" className="text-sm font-light text-white/80 hover:text-white transition-colors">Dresses</Link></li>
                <li><Link to="/category/tops" className="text-sm font-light text-white/80 hover:text-white transition-colors">Tops</Link></li>
                <li><Link to="/category/bottoms" className="text-sm font-light text-white/80 hover:text-white transition-colors">Bottoms</Link></li>
                <li><Link to="/category/outerwear" className="text-sm font-light text-white/80 hover:text-white transition-colors">Outerwear</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-normal mb-4 text-white">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/about/size-guide" className="text-sm font-light text-white/80 hover:text-white transition-colors">Size Guide</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-white/80 hover:text-white transition-colors">Care Instructions</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-white/80 hover:text-white transition-colors">Returns</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-white/80 hover:text-white transition-colors">Shipping</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-white/80 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-normal mb-4 text-white">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://www.instagram.com/lavenderlily_uae?igsh=dzNhM2l4YWxpMjd5&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-sm font-light text-white/80 hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="text-sm font-light text-white/80 hover:text-white transition-colors">Pinterest</a></li>
                <li><a href="#" className="text-sm font-light text-white/80 hover:text-white transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - edge to edge separator */}
      <div className="border-t border-white/20 -mx-6 px-6 pt-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-2 md:mb-0">
            <p className="text-sm font-light text-white/80 mb-1">
              © 2026 LavenderLily. All rights reserved.
            </p>
            <p className="text-xs font-light text-white/60">
              Designed and developed by Mohd Jarir Khan
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-sm font-light text-white/80 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm font-light text-white/80 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import { useState } from "react";

interface Store {
  name: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

const StoreMap = () => {
  // Stores should be fetched from Supabase or CMS
  const [stores] = useState<Store[]>([
    {
      name: "LavenderLily Dubai",
      address: "Al Nasr Square, Block B, Shop No 11, Oud Maitha, Dubai",
      phone: "+971 58 836 6059",
      hours: "Mon-Sat: 10:00 AM - 9:00 PM",
      lat: 25.2048,
      lng: 55.2708
    }
  ]);
  
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-border bg-muted/10 relative">
      {/* Google Maps Embed */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.0!2d55.2708!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDEyJzE3LjMiTiA1NcKwMTYnMTQuOSJF!5e0!3m2!1sen!2sus!4v1641234567890"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
      />
      
      {/* Overlay with store markers */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
        <h4 className="text-sm font-medium text-foreground mb-3">Our Locations</h4>
        <div className="space-y-2">
          {stores.map((store, index) => (
            <div key={index} className="text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span className="font-medium text-foreground">{store.name}</span>
              </div>
              <p className="text-muted-foreground ml-4">{store.address}</p>
              <p className="text-muted-foreground ml-4 text-[10px]">{store.phone}</p>
            </div>
          ))}
        </div>
        <a 
          href="https://share.google/P63kc5rS6Cc7HtroZ" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs text-primary hover:text-primary-hover transition-colors"
        >
          Open in Google Maps →
        </a>
      </div>
    </div>
  );
};

export default StoreMap;
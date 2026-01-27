import { useEffect, useState } from "react";

const StatusBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // USPs should be fetched from CMS or configuration
  const [usps, setUsps] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % usps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [usps.length]);

  if (usps.length === 0) {
    return null;
  }

  return (
    <div className="bg-status-bar text-status-bar-foreground py-2">
      <div className="container mx-auto px-4 text-center">
        <p 
          key={currentIndex}
          className="text-sm font-light transition-all duration-700 ease-in-out opacity-100 animate-fade-in"
        >
          {usps[currentIndex]}
        </p>
      </div>
    </div>
  );
};

export default StatusBar;
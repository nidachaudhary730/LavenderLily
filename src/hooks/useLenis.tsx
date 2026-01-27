import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8, // Faster scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // Slightly faster wheel response
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
      syncTouch: true, // Better touch sync
    });

    // Store Lenis instance globally for ScrollToTop component
    (window as any).lenis = lenis;

    // Connect Lenis with GSAP ScrollTrigger - optimized
    lenis.on('scroll', ScrollTrigger.update);

    // Optimized RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);
};

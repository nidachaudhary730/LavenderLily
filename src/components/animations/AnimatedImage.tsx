import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: 'fadeIn' | 'scale' | 'slideUp' | 'parallax' | 'slideLeft' | 'slideRight';
}

const AnimatedImage = ({
  src,
  alt,
  className = '',
  delay = 0,
  duration = 0.5, // Faster default
  animation = 'fadeIn',
}: AnimatedImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const element = imageRef.current;

    // Set initial animation state - reduced movement
    let initialProps: gsap.TweenVars = {};
    
    switch (animation) {
      case 'fadeIn':
        initialProps = { opacity: 0 };
        break;
      case 'scale':
        initialProps = { opacity: 0, scale: 1.05 }; // Less scale
        break;
      case 'slideUp':
        initialProps = { opacity: 0, y: 20 }; // Reduced
        break;
      case 'slideLeft':
        initialProps = { opacity: 0, x: -20 }; // Reduced
        break;
      case 'slideRight':
        initialProps = { opacity: 0, x: 20 }; // Reduced
        break;
      case 'parallax':
        // Remove parallax for performance - use fadeIn instead
        initialProps = { opacity: 0 };
        break;
    }

    gsap.set(element, initialProps);

    // Simplified - no parallax for speed
    gsap.to(element, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      scrollTrigger: {
        trigger: element,
        start: 'top 90%', // Trigger earlier
        toggleActions: 'play none none none',
        once: true, // Only animate once
      },
      duration: duration * 0.6, // Faster
      delay: delay * 0.5, // Reduce delay
      ease: 'power2.out', // Faster easing
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [src, delay, duration, animation]);

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};

export default AnimatedImage;

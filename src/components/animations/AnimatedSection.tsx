import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
  stagger?: number;
}

const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5, // Faster default
  animation = 'fadeUp',
  stagger = 0.05, // Faster stagger
}: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const element = sectionRef.current;
    const children = element.children;

    // Set initial animation state - reduced movement
    let initialProps: gsap.TweenVars = {};
    
    switch (animation) {
      case 'fadeUp':
        initialProps = { opacity: 0, y: 20 }; // Reduced from 60
        break;
      case 'fadeIn':
        initialProps = { opacity: 0 };
        break;
      case 'slideLeft':
        initialProps = { opacity: 0, x: -20 }; // Reduced
        break;
      case 'slideRight':
        initialProps = { opacity: 0, x: 20 }; // Reduced
        break;
      case 'scale':
        initialProps = { opacity: 0, scale: 0.95 }; // Less scale
        break;
    }

    gsap.set(Array.from(children), initialProps);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 90%', // Trigger earlier
        toggleActions: 'play none none none',
        once: true, // Only animate once
      },
      delay: delay * 0.5, // Reduce delay
    });

    tl.to(Array.from(children), {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: duration * 0.6, // Faster
      ease: 'power2.out', // Faster easing
      stagger: stagger * 0.5, // Faster stagger
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [delay, duration, animation, stagger]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};

export default AnimatedSection;

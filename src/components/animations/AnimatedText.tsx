import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
  split?: boolean;
}

const AnimatedText = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5, // Faster default
  animation = 'fadeUp',
  split = false,
}: AnimatedTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;

    // Split text into words if split is true - but skip for performance
    if (split && typeof children === 'string' && children.length < 100) {
      const words = children.split(' ');
      element.innerHTML = words
        .map((word) => `<span class="inline-block">${word}</span>`)
        .join(' ');
      wordsRef.current = Array.from(element.querySelectorAll('span'));
    }

    // Set initial animation state - reduced movement for speed
    let initialProps: gsap.TweenVars = {};
    
    switch (animation) {
      case 'fadeUp':
        initialProps = { opacity: 0, y: 20 }; // Reduced from 50
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

    // Animate words individually if split, otherwise animate the whole element
    const targets = split && wordsRef.current.length > 0 ? wordsRef.current : element;

    gsap.set(targets, initialProps);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 90%', // Trigger earlier
        toggleActions: 'play none none none',
        once: true, // Only animate once for performance
      },
      delay: delay * 0.5, // Reduce delay impact
    });

    if (split && wordsRef.current.length > 0 && wordsRef.current.length < 15) {
      // Only split for short text
      wordsRef.current.forEach((word, index) => {
        tl.to(
          word,
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: duration * 0.3, // Much faster
            ease: 'power2.out', // Faster easing
          },
          index * 0.02 // Faster stagger
        );
      });
    } else {
      tl.to(element, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: duration * 0.6, // Faster
        ease: 'power2.out', // Faster easing
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [children, delay, duration, animation, split]);

  return (
    <div ref={textRef} className={className}>
      {!split && children}
    </div>
  );
};

export default AnimatedText;

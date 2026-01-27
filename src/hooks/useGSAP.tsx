import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseGSAPOptions {
  dependencies?: React.DependencyList;
  immediate?: boolean;
}

export const useGSAP = (
  callback: (context: gsap.Context) => void | (() => void),
  options: UseGSAPOptions = {}
) => {
  const { dependencies = [], immediate = true } = options;
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scopeRef.current) return;

    const ctx = gsap.context(() => {
      if (immediate) {
        const cleanup = callback(ctx);
        return cleanup;
      }
    }, scopeRef);

    return () => {
      ctx.revert();
    };
  }, dependencies);

  return scopeRef;
};

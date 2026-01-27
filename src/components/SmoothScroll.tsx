import { useLenis } from '@/hooks/useLenis';
import { ReactNode } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  useLenis();
  return <>{children}</>;
};

export default SmoothScroll;

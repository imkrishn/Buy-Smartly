'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [transitioning, setTransitioning] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setTransitioning(true);
    const timer = setTimeout(() => setTransitioning(false), 500); // Match duration with CSS transition
    return () => clearTimeout(timer);
  }, [pathname]); // Run this effect when the route changes

  return (
    <div className={transitioning ? 'page-enter' : 'page-enter-active'}>
      {children}
    </div>
  );
};

export default PageTransition;

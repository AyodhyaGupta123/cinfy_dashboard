import { useState, useEffect } from 'react';

/**
 * Hook to track window size and return boolean based on media query.
 * Useful for conditional rendering in Javascript.
 * 
 * Usage:
 * const isMobile = useMediaQuery('(max-width: 768px)');
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query, matches]);

  return matches;
};

/**
 * Helper hook for common device sizes
 */
export const useDeviceType = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return { isMobile, isTablet, isDesktop };
};

export default useMediaQuery;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to automatically scroll the window to the top whenever the route changes.
 * Useful for ensuring a fresh start on each new page.
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Also scroll any potential main layout containers if they have their own scrollbars
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [pathname]);
};

export default useScrollToTop;

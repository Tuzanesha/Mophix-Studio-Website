import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This forces the window to scroll to the top-left corner immediately on path change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
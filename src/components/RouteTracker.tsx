import { useRouteStore } from '@/hooks/useRouteStore';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const RouteTracker = () => {
  const location = useLocation();
  const setPreviousPath = useRouteStore((state) => state.setPreviousPath);

  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setPreviousPath(prevPathRef.current || '');
      prevPathRef.current = location.pathname;
    }
  }, [location, setPreviousPath]);

  return null;
};

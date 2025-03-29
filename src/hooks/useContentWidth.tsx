import { useEffect, useRef, RefObject } from 'react';

const useContentWidth = <T extends HTMLElement = HTMLDivElement>(
  onWidthChange: (width: number) => void,
): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;

    const observer = new ResizeObserver((entries) => {
      const [entry] = entries;
      const width = element?.offsetWidth || entry.contentRect.width;
      onWidthChange(width);
    });

    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [onWidthChange]);

  return ref;
};

export default useContentWidth;

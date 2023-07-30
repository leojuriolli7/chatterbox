import { useEffect, useState } from "react";

const useOnScreen = (
  ref: React.RefObject<HTMLDivElement>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...(options || {}) }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options, ref]);

  return isIntersecting;
};

export default useOnScreen;

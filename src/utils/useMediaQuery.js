import { useState, useEffect } from "react";

export const MEDIA_QUERIES = {
  SMALL: "(max-width: 640px)",
  MEDIUM: "(max-width: 768px)",
  LARGE: "(max-width: 1024px)",
  XL: "(max-width: 1280px)",
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

export default useMediaQuery;

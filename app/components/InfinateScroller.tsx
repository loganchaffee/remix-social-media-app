import { ReactNode, useCallback, useEffect, useRef } from "react";

export const InfiniteScroller = (props: {
  children: ReactNode;
  loading: boolean;
  loadNext: () => void;
}) => {
  const { children, loading, loadNext } = props;

  const scrollListener = useRef(loadNext);

  useEffect(() => {
    scrollListener.current = loadNext;
  }, [loadNext]);

  const onScroll = useCallback(() => {
    const documentHeight = document.documentElement.scrollHeight;

    const scrollDifference = Math.floor(window.innerHeight + window.scrollY);

    const scrollEnded = documentHeight == scrollDifference;

    if (scrollEnded && !loading) {
      scrollListener.current();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return <>{children}</>;
};

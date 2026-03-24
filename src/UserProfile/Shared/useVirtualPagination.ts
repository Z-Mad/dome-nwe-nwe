import { UIEvent, useCallback, useMemo, useState } from "react";

interface UseVirtualPaginationOptions {
  itemHeight: number;
  containerHeight: number;
  pageSize: number;
  overscan?: number;
}

export const useVirtualPagination = <T,>(
  items: T[],
  options: UseVirtualPaginationOptions,
) => {
  const { itemHeight, containerHeight, pageSize, overscan = 2 } = options;
  const [pageIndex, setPageIndex] = useState(1);
  const [scrollTop, setScrollTop] = useState(0);

  const totalPage = Math.max(1, Math.ceil(items.length / pageSize));
  const loadedCount = Math.min(items.length, pageIndex * pageSize);
  const loadedItems = useMemo(
    () => items.slice(0, loadedCount),
    [items, loadedCount],
  );

  const visibleStart = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan,
  );
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
  const visibleEnd = Math.min(loadedItems.length, visibleStart + visibleCount);
  const visibleItems = loadedItems.slice(visibleStart, visibleEnd);

  const topSpacerHeight = visibleStart * itemHeight;
  const bottomSpacerHeight = Math.max(
    0,
    (loadedItems.length - visibleEnd) * itemHeight,
  );

  const onScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      setScrollTop(target.scrollTop);
      const distanceToBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight;
      if (distanceToBottom < itemHeight * 2) {
        setPageIndex((current) => Math.min(totalPage, current + 1));
      }
    },
    [itemHeight, totalPage],
  );

  const reset = useCallback(() => {
    setPageIndex(1);
    setScrollTop(0);
  }, []);

  return {
    visibleItems,
    visibleStart,
    loadedItems,
    loadedCount,
    pageIndex,
    totalPage,
    topSpacerHeight,
    bottomSpacerHeight,
    onScroll,
    reset,
  };
};

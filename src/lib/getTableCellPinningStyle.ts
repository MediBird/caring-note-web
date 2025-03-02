import { Column } from '@tanstack/react-table';

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  /**
   * Show box shadow between pinned and scrollable columns.
   * @default false
   */
  withBorder?: boolean;
  /**
   * Show box shadow between pinned and scrollable columns.
   * @default false
   */
}): React.CSSProperties {
  const isPinned = column.getIsPinned();

  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? '0px 0 20px 0px rgba(0, 0, 0, 0.08) inset'
        : isFirstRightPinnedColumn
        ? '0px 0 20px 0px rgba(0, 0, 0, 0.08) inset'
        : undefined
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : undefined,
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    borderLeft: isLastLeftPinnedColumn ? '1px solid #E0E2E6' : undefined,
  };
}

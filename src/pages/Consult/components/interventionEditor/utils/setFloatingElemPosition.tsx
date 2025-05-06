const VERTICAL_GAP = 10;
const HORIZONTAL_OFFSET = 5;

interface setFloatingElemPositionProps {
  targetRect: DOMRect;
  floatingElem: HTMLElement;
  anchorElem: HTMLElement;
  verticalGap?: number;
  horizontalOffset?: number;
  isFirstNode?: boolean;
}

export function setFloatingElemPosition({
  targetRect,
  floatingElem,
  anchorElem,
  isFirstNode,
  verticalGap = VERTICAL_GAP,
  horizontalOffset = HORIZONTAL_OFFSET,
}: setFloatingElemPositionProps) {
  const scrollerElem = anchorElem.parentElement;

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = '0';
    floatingElem.style.transform = 'translate(-10000px, -10000px)';
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const editorScrollerRect = scrollerElem.getBoundingClientRect();

  const isNearTop = targetRect.top - editorScrollerRect.top < 50;

  let top =
    isNearTop || isFirstNode
      ? targetRect.bottom + verticalGap
      : targetRect.top - floatingElemRect.height - verticalGap;

  let left = targetRect.left - horizontalOffset;

  if (isNearTop && top + floatingElemRect.height > editorScrollerRect.bottom) {
    top = targetRect.top - floatingElemRect.height - verticalGap;
  }

  if (!isNearTop && top < editorScrollerRect.top) {
    top = targetRect.bottom + verticalGap;
  }

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
  }

  top -= anchorElementRect.top;
  left -= anchorElementRect.left;

  floatingElem.style.opacity = '1';
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
}

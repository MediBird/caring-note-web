interface getDOMRangeRectProps {
  nativeSelection: Selection;
  rootElement: Element;
}

export function getDOMRangeRect({
  nativeSelection,
  rootElement,
}: getDOMRangeRectProps) {
  const domRange = nativeSelection.getRangeAt(0);

  let rect;

  if (nativeSelection.anchorNode === rootElement) {
    let inner = rootElement;
    while (inner.firstElementChild != null) {
      inner = inner.firstElementChild;
    }
    rect = inner.getBoundingClientRect();
  } else {
    rect = domRange.getBoundingClientRect();
  }

  return rect;
}

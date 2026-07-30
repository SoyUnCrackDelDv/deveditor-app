interface SelectionBoxProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  visible: boolean;
}

export function SelectionBox({ startX, startY, endX, endY, visible }: SelectionBoxProps) {
  if (!visible) return null;

  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  return (
    <div
      className="absolute bg-primary/20 border border-primary border-dashed z-[32] pointer-events-none"
      style={{ left, top, width, height }}
      data-testid="selection-box"
    />
  );
}

/**
 * Decorative contour rings suggesting a valley bowl ringed by hills.
 * Abstract linework: it does not claim to map real terrain.
 */
export function Topo({ className = "topo" }: { className?: string }) {
  const rings = Array.from({ length: 11 }, (_, i) => {
    const rx = 180 + i * 78;
    const ry = 110 + i * 46;
    const wobble = 10 + i * 3;
    const cx = 980;
    const cy = 420;
    // Four-segment closed curve with alternating wobble for an organic contour.
    return [
      `M ${cx - rx} ${cy}`,
      `C ${cx - rx} ${cy - ry + wobble}, ${cx - rx * 0.35} ${cy - ry - wobble}, ${cx} ${cy - ry}`,
      `S ${cx + rx} ${cy - ry * 0.4 + wobble}, ${cx + rx} ${cy}`,
      `S ${cx + rx * 0.4} ${cy + ry + wobble}, ${cx} ${cy + ry}`,
      `S ${cx - rx} ${cy + ry * 0.5 - wobble}, ${cx - rx} ${cy}`,
      "Z",
    ].join(" ");
  });
  return (
    <svg className={className} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {rings.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={i % 4 === 0 ? 1.6 : 0.9} />
      ))}
    </svg>
  );
}

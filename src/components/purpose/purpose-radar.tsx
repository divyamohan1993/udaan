import { component$ } from "@builder.io/qwik";
import type { PurposeVector, PurposeAxis } from "../../shared/types";

interface PurposeRadarProps {
  vector: PurposeVector;
}

const axes: { key: PurposeAxis; labelHi: string; labelEn: string }[] = [
  { key: "people", labelHi: "लोग", labelEn: "People" },
  { key: "nature", labelHi: "प्रकृति", labelEn: "Nature" },
  { key: "knowledge", labelHi: "ज्ञान", labelEn: "Knowledge" },
  { key: "craft", labelHi: "शिल्प", labelEn: "Craft" },
  { key: "service", labelHi: "सेवा", labelEn: "Service" },
  { key: "expression", labelHi: "अभिव्यक्ति", labelEn: "Expression" },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

export const PurposeRadar = component$<PurposeRadarProps>(({ vector }) => {
  const cx = 150;
  const cy = 150;
  const maxR = 120;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const angleStep = 360 / axes.length;

  // Grid rings
  const ringPaths = levels.map((level) => {
    const r = maxR * level;
    const points = axes
      .map((_, i) => {
        const p = polarToCartesian(cx, cy, r, i * angleStep);
        return `${p.x},${p.y}`;
      })
      .join(" ");
    return `M${points.split(" ")[0]} L${points.split(" ").slice(1).join(" L")} Z`;
  });

  // Data polygon
  const dataPoints = axes.map((axis, i) => {
    const val = vector[axis.key] ?? 0;
    const r = maxR * val;
    return polarToCartesian(cx, cy, r, i * angleStep);
  });
  const dataPath = `M${dataPoints.map((p) => `${p.x},${p.y}`).join(" L")} Z`;

  // Label positions
  const labelPositions = axes.map((axis, i) => {
    const p = polarToCartesian(cx, cy, maxR + 25, i * angleStep);
    return { ...axis, x: p.x, y: p.y };
  });

  return (
    <div class="flex flex-col items-center" role="img" aria-label="उद्देश्य मानचित्र / Purpose Radar Chart">
      <svg
        viewBox="0 0 300 300"
        class="w-full max-w-xs"
        aria-hidden="true"
      >
        {/* Grid */}
        {ringPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="currentColor"
            stroke-width="0.5"
            class="text-stone-300 dark:text-stone-600"
          />
        ))}

        {/* Axis lines */}
        {axes.map((_, i) => {
          const p = polarToCartesian(cx, cy, maxR, i * angleStep);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              stroke-width="0.5"
              class="text-stone-300 dark:text-stone-600"
            />
          );
        })}

        {/* Data polygon */}
        <path
          d={dataPath}
          fill="rgba(37, 99, 235, 0.2)"
          stroke="#2563eb"
          stroke-width="2"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2563eb" />
        ))}

        {/* Labels */}
        {labelPositions.map((lp) => (
          <text
            key={lp.key}
            x={lp.x}
            y={lp.y}
            text-anchor="middle"
            dominant-baseline="central"
            class="fill-stone-900 text-[10px] font-semibold dark:fill-stone-100"
          >
            {lp.labelHi}
          </text>
        ))}
      </svg>

      {/* Accessible text version */}
      <div class="sr-only">
        <h3>उद्देश्य स्कोर:</h3>
        <ul>
          {axes.map((axis) => (
            <li key={axis.key}>
              {axis.labelHi} ({axis.labelEn}): {Math.round((vector[axis.key] ?? 0) * 100)}%
            </li>
          ))}
        </ul>
      </div>

      {/* Visual scores below radar */}
      <div class="mt-4 grid w-full grid-cols-3 gap-2">
        {axes.map((axis) => {
          const val = Math.round((vector[axis.key] ?? 0) * 100);
          return (
            <div key={axis.key} class="text-center">
              <div class="text-xs font-semibold text-stone-600 dark:text-stone-400">
                {axis.labelHi}
              </div>
              <div class="text-lg font-bold text-purpose">{val}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

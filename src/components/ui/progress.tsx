import { component$ } from "@builder.io/qwik";

export type ProgressVariant = "default" | "crisis" | "purpose" | "community";

interface ProgressProps {
  value: number;
  max?: number;
  label: string;
  variant?: ProgressVariant;
}

const variantClasses: Record<ProgressVariant, string> = {
  default: "bg-stone-600",
  crisis: "bg-crisis",
  purpose: "bg-purpose",
  community: "bg-community",
};

export const Progress = component$<ProgressProps>(
  ({ value, max = 100, label, variant = "default" }) => {
    const percentage = Math.round((value / max) * 100);
    return (
      <div class="w-full">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-semibold text-stone-900 dark:text-stone-100">
            {label}
          </span>
          <span
            class="text-sm text-stone-600 dark:text-stone-400"
            aria-hidden="true"
          >
            {percentage}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${percentage}%`}
          class="h-3 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700"
        >
          <div
            class={["h-full rounded-full transition-all duration-300", variantClasses[variant]].join(" ")}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

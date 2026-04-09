import { component$, Slot } from "@builder.io/qwik";

export type BadgeVariant = "default" | "crisis" | "purpose" | "community" | "easy" | "medium" | "hard";

interface BadgeProps {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-200",
  crisis: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
  purpose: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
  community:
    "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  easy: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  medium:
    "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
  hard: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
};

export const Badge = component$<BadgeProps>(({ variant = "default" }) => {
  return (
    <span
      class={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
        variantClasses[variant],
      ].join(" ")}
    >
      <Slot />
    </span>
  );
});

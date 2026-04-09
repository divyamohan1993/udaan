import { component$, Slot } from "@builder.io/qwik";

export type CardVariant = "default" | "crisis" | "purpose" | "community";

interface CardProps {
  variant?: CardVariant;
  class?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    "border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900",
  crisis:
    "border-crisis/30 bg-red-50 dark:border-crisis/40 dark:bg-red-950",
  purpose:
    "border-purpose/30 bg-blue-50 dark:border-purpose/40 dark:bg-blue-950",
  community:
    "border-community/30 bg-green-50 dark:border-community/40 dark:bg-green-950",
};

export const Card = component$<CardProps>(
  ({ variant = "default", class: className }) => {
    return (
      <article
        class={[
          "rounded-xl border-2 p-4 shadow-sm",
          variantClasses[variant],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Slot />
      </article>
    );
  }
);

export const CardTitle = component$<{ class?: string }>(
  ({ class: className }) => {
    return (
      <h3
        class={[
          "text-lg font-bold text-stone-900 dark:text-stone-100",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Slot />
      </h3>
    );
  }
);

export const CardDescription = component$<{ class?: string }>(
  ({ class: className }) => {
    return (
      <p
        class={[
          "mt-1 text-sm text-stone-600 dark:text-stone-400",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Slot />
      </p>
    );
  }
);

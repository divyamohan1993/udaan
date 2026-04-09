import { component$, type QRL, Slot } from "@builder.io/qwik";

export type ButtonVariant = "primary" | "secondary" | "crisis" | "ghost" | "purpose" | "community";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick$?: QRL<() => void>;
  ariaLabel?: string;
  class?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-purpose text-white hover:bg-blue-700 focus-visible:ring-purpose",
  secondary:
    "bg-stone-200 text-stone-900 hover:bg-stone-300 focus-visible:ring-stone-400 dark:bg-stone-700 dark:text-stone-100 dark:hover:bg-stone-600",
  crisis:
    "bg-crisis text-white hover:bg-red-700 focus-visible:ring-crisis",
  ghost:
    "bg-transparent text-stone-900 hover:bg-stone-100 focus-visible:ring-stone-400 dark:text-stone-100 dark:hover:bg-stone-800",
  purpose:
    "bg-purpose text-white hover:bg-blue-700 focus-visible:ring-purpose",
  community:
    "bg-community text-white hover:bg-green-700 focus-visible:ring-community",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[48px] min-w-[48px] px-3 py-2 text-sm",
  md: "min-h-[48px] min-w-[48px] px-4 py-2.5 text-base",
  lg: "min-h-[48px] min-w-[48px] px-6 py-3 text-lg",
};

export const Button = component$<ButtonProps>(
  ({
    variant = "primary",
    size = "md",
    disabled = false,
    type = "button",
    onClick$,
    ariaLabel,
    class: className,
  }) => {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick$={onClick$}
        aria-label={ariaLabel}
        class={[
          "inline-flex items-center justify-center rounded-lg font-semibold",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "cursor-pointer select-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Slot />
      </button>
    );
  }
);

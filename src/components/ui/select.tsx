import { component$, type QRL } from "@builder.io/qwik";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  value?: string;
  required?: boolean;
  onChange$?: QRL<(value: string) => void>;
  ariaLabel?: string;
}

export const Select = component$<SelectProps>(
  ({ label, name, options, value, required = false, onChange$, ariaLabel }) => {
    const id = `select-${name}`;
    return (
      <div class="flex flex-col gap-1.5">
        <label
          for={id}
          class="text-sm font-semibold text-stone-900 dark:text-stone-100"
        >
          {label}
          {required && (
            <span class="ml-1 text-crisis" aria-hidden="true">
              *
            </span>
          )}
          {required && <span class="sr-only"> (आवश्यक)</span>}
        </label>
        <select
          id={id}
          name={name}
          required={required}
          aria-label={ariaLabel || label}
          aria-required={required}
          value={value}
          onChange$={(_, el) => onChange$?.(el.value)}
          class={[
            "min-h-[48px] w-full rounded-lg border-2 border-stone-300 bg-white px-3 py-2",
            "text-base text-stone-900",
            "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-purpose focus-visible:ring-offset-2",
            "dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100",
            "cursor-pointer",
          ].join(" ")}
        >
          <option value="" disabled>
            चुनें / Select
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

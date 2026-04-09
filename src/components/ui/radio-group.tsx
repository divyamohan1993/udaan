import { component$, type QRL } from "@builder.io/qwik";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  legend: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange$?: QRL<(value: string) => void>;
}

export const RadioGroup = component$<RadioGroupProps>(
  ({ legend, name, options, value, onChange$ }) => {
    return (
      <fieldset class="space-y-2" role="radiogroup">
        <legend class="text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
          {legend}
        </legend>
        <div class="grid gap-2">
          {options.map((opt) => {
            const id = `radio-${name}-${opt.value}`;
            const isSelected = value === opt.value;
            return (
              <label
                key={opt.value}
                for={id}
                class={[
                  "flex min-h-[48px] cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3",
                  "transition-colors duration-150",
                  "focus-within:ring-3 focus-within:ring-purpose focus-within:ring-offset-2",
                  isSelected
                    ? "border-purpose bg-blue-50 dark:border-purpose dark:bg-blue-950"
                    : "border-stone-300 bg-white hover:border-stone-400 dark:border-stone-600 dark:bg-stone-800 dark:hover:border-stone-500",
                ].join(" ")}
              >
                <input
                  type="radio"
                  id={id}
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  onChange$={() => onChange$?.(opt.value)}
                  class="h-5 w-5 accent-purpose focus:outline-none"
                />
                <div>
                  <span class="text-base font-semibold text-stone-900 dark:text-stone-100">
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span class="block text-sm text-stone-600 dark:text-stone-400">
                      {opt.description}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }
);

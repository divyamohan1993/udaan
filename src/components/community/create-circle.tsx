import { component$, useStore, $, type QRL } from "@builder.io/qwik";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { getAllMissions } from "../../lib/matching/purpose";

interface CreateCircleProps {
  onClose$: QRL<() => void>;
}

export const CreateCircle = component$<CreateCircleProps>((props) => {
  const missions = getAllMissions();
  const form = useStore({
    name: "",
    missionId: "",
    location: "",
  });

  const missionOptions = missions.map((m) => ({
    value: m.id,
    label: `${m.titleHi} / ${m.title}`,
  }));

  const handleSubmit = $(() => {
    // In production, this would create a circle via API
    // For showcase, just close the form
    props.onClose$();
  });

  return (
    <div
      class="rounded-xl border-2 border-community bg-green-50 p-6 dark:border-community dark:bg-green-950"
      role="dialog"
      aria-labelledby="create-circle-heading"
    >
      <h2
        id="create-circle-heading"
        class="text-xl font-bold text-stone-900 dark:text-stone-100"
      >
        नया मंडल बनाएं
        <span class="block text-sm font-normal text-stone-500 dark:text-stone-400">
          Create New Circle
        </span>
      </h2>

      <form
        preventdefault:submit
        onSubmit$={handleSubmit}
        class="mt-4 space-y-4"
        aria-label="मंडल बनाएं / Create Circle"
      >
        <div class="flex flex-col gap-1.5">
          <label
            for="circle-name"
            class="text-sm font-semibold text-stone-900 dark:text-stone-100"
          >
            मंडल का नाम / Circle Name
            <span class="ml-1 text-crisis" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="circle-name"
            type="text"
            required
            aria-required="true"
            value={form.name}
            onInput$={(_, el) => { form.name = el.value; }}
            placeholder="जैसे: मोहल्ला शिक्षक मंडल"
            class="min-h-[48px] w-full rounded-lg border-2 border-stone-300 bg-white px-3 py-2 text-base text-stone-900 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-community focus-visible:ring-offset-2 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          />
        </div>

        <Select
          label="मिशन चुनें / Select Mission"
          name="mission"
          options={missionOptions}
          value={form.missionId}
          required
          onChange$={$((v: string) => { form.missionId = v; })}
        />

        <div class="flex flex-col gap-1.5">
          <label
            for="circle-location"
            class="text-sm font-semibold text-stone-900 dark:text-stone-100"
          >
            स्थान / Location
            <span class="ml-1 text-crisis" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="circle-location"
            type="text"
            required
            aria-required="true"
            value={form.location}
            onInput$={(_, el) => { form.location = el.value; }}
            placeholder="जैसे: लखनऊ, गोमती नगर"
            class="min-h-[48px] w-full rounded-lg border-2 border-stone-300 bg-white px-3 py-2 text-base text-stone-900 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-community focus-visible:ring-offset-2 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          />
        </div>

        <div class="flex gap-3">
          <Button variant="community" type="submit" ariaLabel="मंडल बनाएं / Create Circle">
            मंडल बनाएं / Create Circle
          </Button>
          <Button variant="ghost" onClick$={props.onClose$} ariaLabel="रद्द करें / Cancel">
            रद्द करें / Cancel
          </Button>
        </div>
      </form>
    </div>
  );
});

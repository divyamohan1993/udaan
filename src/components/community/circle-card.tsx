import { component$ } from "@builder.io/qwik";
import type { Circle } from "../../shared/types";
import { Badge } from "../ui/badge";

interface CircleCardProps {
  circle: Circle;
}

export const CircleCard = component$<CircleCardProps>(({ circle }) => {
  const recentActivity = circle.activityLog.slice(-3);
  const memberCount = circle.members.length;

  return (
    <article
      class="rounded-xl border-2 border-community/30 bg-green-50 p-4 dark:border-community/40 dark:bg-green-950"
      aria-labelledby={`circle-${circle.id}`}
    >
      <div class="flex items-start justify-between gap-2">
        <div>
          <h3
            id={`circle-${circle.id}`}
            class="text-lg font-bold text-stone-900 dark:text-stone-100"
          >
            {circle.name}
          </h3>
          <p class="text-sm text-stone-600 dark:text-stone-400">
            {circle.mission.titleHi}
          </p>
        </div>
        <Badge variant="community">
          {memberCount} सदस्य
        </Badge>
      </div>

      <div class="mt-2 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
        <span>{circle.location}</span>
      </div>

      {recentActivity.length > 0 && (
        <div class="mt-3">
          <h4 class="text-sm font-semibold text-stone-700 dark:text-stone-300">
            हाल की गतिविधि / Recent Activity
          </h4>
          <ul class="mt-1 space-y-1" role="list">
            {recentActivity.map((activity) => (
              <li
                key={activity.id}
                class="text-sm text-stone-600 dark:text-stone-400"
              >
                <span class="text-community font-bold" aria-hidden="true">
                  &bull;
                </span>{" "}
                {activity.descriptionHi}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
});

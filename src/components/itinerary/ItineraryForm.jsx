import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itineraryFormSchema } from "../../schemas/itinerarySchema";
import { destinations, allTags } from "../../data/destinations";
import { Button, Spinner } from "../common/Common";

export function ItineraryForm({ onSubmit, pending, defaultDestinationId }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itineraryFormSchema),
    defaultValues: { days: 3, interests: [], pace: "balanced", budget: "moderate" },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="space-y-6 border border-[var(--color-line)] p-6"
    >
      <div>
        <label htmlFor="destinationId" className="coord mb-1 block text-[var(--color-ink-soft)]">
          Destination
        </label>
        <select
          id="destinationId"
          {...register("destinationId")}
          defaultValue={defaultDestinationId}
          className="w-full border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2"
          required
        >
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}, {d.country}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="days" className="coord mb-1 block text-[var(--color-ink-soft)]">
            Days
          </label>
          <input
            id="days"
            type="number"
            min={1}
            max={14}
            {...register("days")}
            className="w-full border border-[var(--color-line)] px-3 py-2"
            aria-invalid={Boolean(errors.days)}
            aria-describedby={errors.days ? "days-error" : undefined}
          />
          {errors.days && (
            <p id="days-error" className="mt-1 text-xs text-[var(--color-warn)]">
              {errors.days.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="pace" className="coord mb-1 block text-[var(--color-ink-soft)]">
            Pace
          </label>
          <select id="pace" {...register("pace")} className="w-full border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2">
            <option value="relaxed">Relaxed</option>
            <option value="balanced">Balanced</option>
            <option value="packed">Packed</option>
          </select>
        </div>
      </div>

      <div>
        <span className="coord mb-1 block text-[var(--color-ink-soft)]">Budget</span>
        <div className="flex gap-4">
          {["low", "moderate", "high"].map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm capitalize">
              <input type="radio" value={b} {...register("budget")} defaultChecked={b === "moderate"} />
              {b}
            </label>
          ))}
        </div>
      </div>

      <fieldset>
        <legend className="coord mb-2 block text-[var(--color-ink-soft)]">Interests</legend>
        <Controller
          control={control}
          name="interests"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const checked = field.value?.includes(tag);
                return (
                  <label
                    key={tag}
                    className={`coord cursor-pointer border px-3 py-1.5 ${
                      checked
                        ? "border-[var(--color-route)] bg-[var(--color-route)] text-[var(--color-paper)]"
                        : "border-[var(--color-line)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() =>
                        field.onChange(
                          checked ? field.value.filter((v) => v !== tag) : [...(field.value || []), tag]
                        )
                      }
                    />
                    {tag}
                  </label>
                );
              })}
            </div>
          )}
        />
      </fieldset>

      <Button type="submit" variant="route" disabled={pending} className="w-full sm:w-auto">
        {pending && <Spinner className="h-4 w-4" />}
        {pending ? "Building itinerary…" : "Generate itinerary"}
      </Button>
    </form>
  );
}

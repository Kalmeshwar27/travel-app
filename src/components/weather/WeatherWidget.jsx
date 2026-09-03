import { useWeather } from "../../hooks/useWeather";
import { weatherIconUrl } from "../../services/weatherApi";
import { formatTemp, formatTime } from "../../utils/formatWeather";
import { SkeletonBlock, ErrorState } from "../common/Common";
import { Droplets, Wind } from "lucide-react";

export function WeatherWidget({ lat, lng, label }) {
  const { data, isLoading, isError, error, refetch } = useWeather(lat, lng);

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 border border-[var(--color-line)] p-4">
        <SkeletonBlock className="h-14 w-14 shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Weather unavailable"
        message={
          error?.code === "MISSING_KEY"
            ? "Add an OpenWeather API key to see live conditions here."
            : "Couldn't reach the weather service. The rest of this page still works."
        }
        onRetry={error?.code === "MISSING_KEY" ? undefined : refetch}
      />
    );
  }

  return (
    <div className="flex items-center gap-4 border border-[var(--color-line)] p-4">
      {data.icon && (
        <img
          src={weatherIconUrl(data.icon)}
          alt=""
          aria-hidden="true"
          className="h-14 w-14 shrink-0"
        />
      )}
      <div className="flex-1">
        <p className="coord text-[var(--color-ink-soft)]">{label || data.cityName || "Current weather"}</p>
        <p className="font-display text-3xl leading-tight">{formatTemp(data.temperature)}</p>
        <p className="text-sm text-[var(--color-ink-soft)]">
          {data.condition} · feels like {formatTemp(data.feelsLike)}
        </p>
        <div className="coord mt-1 flex flex-wrap gap-3 text-[var(--color-ink-soft)]">
          {data.humidity != null && (
            <span className="flex items-center gap-1">
              <Droplets className="h-3.5 w-3.5" aria-hidden="true" /> {data.humidity}%
            </span>
          )}
          {data.windSpeed != null && (
            <span className="flex items-center gap-1">
              <Wind className="h-3.5 w-3.5" aria-hidden="true" /> {data.windSpeed} m/s
            </span>
          )}
          <span>Updated {formatTime(data.observedAt)}</span>
        </div>
      </div>
    </div>
  );
}

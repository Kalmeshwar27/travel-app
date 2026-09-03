import { Search } from "lucide-react";
import { allRegions, allTags } from "../../data/destinations";

export function DestinationFilters({ query, onQueryChange, region, onRegionChange, tag, onTagChange, onReset }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="w-full md:max-w-sm">
        <label htmlFor="destination-search" className="coord mb-1 block text-[var(--color-ink-soft)]">
          Search
        </label>
        <div className="flex items-center gap-2 border-b border-[var(--color-ink)] pb-1.5">
          <Search className="h-4 w-4 text-[var(--color-ink-soft)]" aria-hidden="true" />
          <input
            id="destination-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by place, country or interest"
            className="w-full bg-transparent font-display text-lg outline-none placeholder:text-[var(--color-ink-soft)]/60"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <FilterSelect
          id="region-filter"
          label="Region"
          value={region}
          onChange={onRegionChange}
          options={allRegions}
        />
        <FilterSelect id="tag-filter" label="Interest" value={tag} onChange={onTagChange} options={allTags} />
        {(query || region !== "all" || tag !== "all") && (
          <button type="button" onClick={onReset} className="coord text-[var(--color-route)] underline underline-offset-4">
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="coord mb-1 block text-[var(--color-ink-soft)]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-1.5 text-sm"
      >
        <option value="all">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

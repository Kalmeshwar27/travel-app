export function formatTemp(t) {
  return t == null || Number.isNaN(t) ? "—" : `${t}°C`;
}
export function formatTime(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(date);
}

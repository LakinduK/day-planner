export function formatDuration(duration) {
  const hours = Math.floor(duration);
  const minutes = Math.floor((duration % 1) * 60);
  return `${hours ? `${hours}h` : ""} ${minutes ? `${minutes}m` : ""}`;
}

export function snapTo15(pixelsPerHour, pos) {
  const pixelsPer15 = pixelsPerHour / 4;
  return (Math.round(pos / pixelsPer15) * pixelsPer15) / pixelsPerHour;
}

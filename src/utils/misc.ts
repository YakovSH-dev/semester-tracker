export function getRandomHexColorx(): string {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
}

export function getRandomHexColor(): string {
  const hue = Math.floor(Math.random() * 360); // full hue wheel
  const saturation = Math.floor(60 + Math.random() * 30); // 60–90%
  const lightness = Math.floor(55 + Math.random() * 15); // 55–70%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export const themedColors = [
  "#f87171", // soft red
  "#fbbf24", // amber
  "#34d399", // mint green
  "#60a5fa", // soft blue
  "#a78bfa", // purple
  "#f472b6", // pink
  "#2dd4bf", // teal
  "#facc15", // yellow
  "#4ade80", // green
  "#818cf8", // indigo
  "#fb7185", // rose
];
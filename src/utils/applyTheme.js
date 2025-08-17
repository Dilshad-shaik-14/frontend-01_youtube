// utils/applyTheme.js
export function applyTheme(theme) {
  if (typeof window === "undefined") return;

  const html = document.documentElement;
  html.setAttribute("data-theme", theme); // DaisyUI uses this
}

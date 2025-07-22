export const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  localStorage.setItem("theme", theme);
};

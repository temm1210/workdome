const theme = localStorage.getItem("theme");
const isDark =
  theme === "dark" ||
  (theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
document.documentElement.classList.toggle("dark", isDark);

import { create } from "zustand";

const saved = localStorage.getItem("chat-theme") || "dark";
document.documentElement.setAttribute("data-theme", saved);

export const useThemeStore = create((set) => ({
  theme: saved,
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
}));
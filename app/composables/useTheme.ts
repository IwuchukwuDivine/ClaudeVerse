import { useColorMode, usePreferredDark } from "@vueuse/core";

export const useTheme = () => {
  const prefersDark = usePreferredDark();

  const mode = useColorMode({
    selector: "html",
    attribute: "class",
    modes: { light: "", dark: "dark" },
    initialValue: prefersDark.value ? "dark" : "light",
    storageKey: "claudeverse-theme",
  });

  const toggle = () => {
    mode.value = mode.value === "dark" ? "light" : "dark";
  };

  const isDark = computed(() => mode.value === "dark");

  return { mode, toggle, isDark };
};

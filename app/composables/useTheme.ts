import { useColorMode } from "@vueuse/core";

export const useTheme = () => {
  const mode = useColorMode({
    selector: "html",
    attribute: "class",
    modes: { light: "", dark: "dark" },
    initialValue: "dark",
    storageKey: "claudeverse-theme",
  });

  const toggle = () => {
    mode.value = mode.value === "dark" ? "light" : "dark";
  };

  const isDark = computed(() => mode.value === "dark");

  return { mode, toggle, isDark };
};

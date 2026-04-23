import type { TocItem } from "~/utils/types/nav";

export const useToc = () => {
  const items = useState<TocItem[]>("toc-items", () => []);
  const activeId = useState<string>("toc-active", () => "");

  const setItems = (list: TocItem[]) => {
    items.value = list;
    if (list.length && !activeId.value) {
      activeId.value = list[0]!.id;
    }
  };

  const setActive = (id: string) => {
    activeId.value = id;
  };

  const clear = () => {
    items.value = [];
    activeId.value = "";
  };

  return { items, activeId, setItems, setActive, clear };
};

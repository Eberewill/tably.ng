import { useLayoutEffect, useRef, useState } from "react";
import type { MenuCategory } from "./types";

export function CategoryNav({
  categories,
  active,
  onChange,
}: {
  categories: MenuCategory[];
  active: MenuCategory;
  onChange: (category: MenuCategory) => void;
}) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const tab = tabRefs.current[categories.indexOf(active)];
      if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [active, categories]);

  return (
    <nav className="category-nav" aria-label="Menu categories" role="tablist">
      <span
        className="category-indicator"
        aria-hidden="true"
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: indicator.width,
        }}
      />
      {categories.map((category, index) => (
        <button
          key={category}
          ref={(element) => {
            tabRefs.current[index] = element;
          }}
          className={category === active ? "active" : ""}
          role="tab"
          aria-selected={category === active}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}

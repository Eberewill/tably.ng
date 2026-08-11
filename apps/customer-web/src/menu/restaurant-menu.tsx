import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "./bottom-nav";
import { CartReview } from "./cart-review";
import { CategoryNav } from "./category-nav";
import { categories, menu, restaurant } from "./data";
import { DishDetail } from "./dish-detail";
import { MenuCard } from "./menu-card";
import { MenuHeader } from "./menu-header";
import { MenuHero } from "./menu-hero";
import { OrderReceived } from "./order-received";
import type { CartItem, MenuCategory, MenuItem } from "./types";

type View = "menu" | "detail" | "cart" | "received";

export function RestaurantMenu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("Main");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [completedOrder, setCompletedOrder] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [view, setView] = useState<View>("menu");
  const [note, setNote] = useState("");
  const items = useMemo(
    () => menu.filter((item) => item.category === activeCategory),
    [activeCategory],
  );
  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  function openDetail(item: MenuItem) {
    setSelectedItem(item);
    setView("detail");
  }
  function addToCart(item: MenuItem, selections: string[]) {
    const id = `${item.id}-${selections.join("-") || "standard"}`;
    setCart((current) => {
      const line = current.find((entry) => entry.id === id);
      return line
        ? current.map((entry) =>
            entry.id === id
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry,
          )
        : [...current, { id, item, selections, quantity: 1 }];
    });
    setView("cart");
  }
  function changeQuantity(id: string, change: number) {
    setCart((current) =>
      current.flatMap((line) =>
        line.id !== id
          ? line
          : line.quantity + change > 0
            ? [{ ...line, quantity: line.quantity + change }]
            : [],
      ),
    );
  }

  return (
    <div className="menu-page">
      {view !== "received" && (
        <MenuHeader
          cartCount={cartCount}
          title={view === "menu" ? "CARTEVA" : restaurant.name}
          onBack={view === "menu" ? undefined : () => setView("menu")}
          onCart={() => setView("cart")}
        />
      )}
      {view === "menu" && (
        <main>
          <MenuHero />
          <CategoryNav
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
          <section
            key={activeCategory}
            className="menu-grid menu-grid-enter"
            aria-live="polite"
          >
            {items.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                quantity={
                  cart.find((line) => line.item.id === item.id)?.quantity ?? 0
                }
                onSelect={() => openDetail(item)}
              />
            ))}
          </section>
        </main>
      )}
      {view === "detail" && selectedItem && (
        <DishDetail
          item={selectedItem}
          onAdd={(selections) => addToCart(selectedItem, selections)}
        />
      )}
      {view === "cart" && (
        <CartReview
          cart={cart}
          note={note}
          onNoteChange={setNote}
          onQuantityChange={changeQuantity}
          onRemove={(id) =>
            setCart((current) => current.filter((line) => line.id !== id))
          }
          onAddMore={() => setView("menu")}
          onPlaceOrder={() => {
            setCompletedOrder(cart);
            setCart([]);
            setNote("");
            setView("received");
          }}
        />
      )}
      {view === "received" && (
        <OrderReceived order={completedOrder} onMenu={() => setView("menu")} />
      )}
      {view === "menu" && (
        <BottomNav cartCount={cartCount} onCart={() => setView("cart")} />
      )}
    </div>
  );
}

import { Icon } from "./icons";

export function BottomNav({
  cartCount,
  onCart,
  onOrders,
}: {
  cartCount: number;
  onCart: () => void;
  onOrders: () => void;
}) {
  const items = [
    ["menu", "Menu"],
    ["orders", "Orders"],
    ["cart", "Cart"],
    ["account", "Account"],
  ] as const;
  return (
    <nav className="bottom-nav" aria-label="Guest navigation">
      {items.map(([icon, label]) => (
        <button
          key={label}
          className={label === "Menu" ? "active" : ""}
          onClick={
            label === "Cart"
              ? onCart
              : label === "Orders"
                ? onOrders
                : undefined
          }
        >
          <span className="bottom-icon">
            <Icon name={icon} />
            {label === "Cart" && cartCount > 0 && <i>{cartCount}</i>}
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

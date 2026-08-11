import { Icon } from "./icons";

export function MenuHeader({
  cartCount,
  onBack,
  onCart,
  title = "CARTEVA",
}: {
  cartCount: number;
  onBack?: () => void;
  onCart: () => void;
  title?: string;
}) {
  return (
    <header className="menu-topbar">
      <button
        className="topbar-icon"
        aria-label={onBack ? "Back to menu" : "Restaurant location"}
        onClick={onBack}
      >
        <Icon name={onBack ? "arrowLeft" : "location"} />
      </button>
      <span className="menu-wordmark">{title}</span>
      <button
        className="topbar-icon"
        aria-label={`Cart, ${cartCount} items`}
        onClick={onCart}
      >
        <Icon name="bag" />
      </button>
    </header>
  );
}

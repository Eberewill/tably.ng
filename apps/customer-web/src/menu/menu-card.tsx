import type { MenuItem } from "./types";

export function MenuCard({
  item,
  quantity,
  onSelect,
}: {
  item: MenuItem;
  quantity: number;
  onSelect: () => void;
}) {
  return (
    <article className="menu-card">
      <div className="menu-card-image">
        <img src={item.image} alt={item.name} />
        {item.tag && <span>{item.tag}</span>}
      </div>
      <div className="menu-card-copy">
        <div>
          <h2>{item.name}</h2>
          <b>₦{item.price.toLocaleString("en-NG")}</b>
        </div>
        <p>{item.description}</p>
        <button onClick={onSelect}>
          {quantity ? `Add another · ${quantity} in cart` : "Add to order"}
        </button>
      </div>
    </article>
  );
}

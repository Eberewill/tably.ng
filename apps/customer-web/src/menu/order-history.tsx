import { formatNaira } from "./currency";
import type { PastOrder } from "./types";

export function OrderHistory({
  orders,
  onMenu,
  onSelect,
}: {
  orders: PastOrder[];
  onMenu: () => void;
  onSelect: (order: PastOrder) => void;
}) {
  if (!orders.length)
    return (
      <main className="order-history history-empty">
        <h1>Your orders</h1>
        <p>Orders placed from this device will appear here.</p>
        <button onClick={onMenu}>Browse the menu</button>
      </main>
    );

  return (
    <main className="order-history">
      <header>
        <h1>Your orders</h1>
        <p>Order history for this device</p>
      </header>
      <section>
        {orders.map((order) => (
          <article key={order.id}>
            <button
              className="order-history-record"
              onClick={() => onSelect(order)}
            >
              <div>
                <span>
                  <b>{order.id}</b>
                  <small>
                    {new Intl.DateTimeFormat("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(order.createdAt))}
                  </small>
                </span>
                <em className={order.status.toLowerCase()}>{order.status}</em>
              </div>
              <p>
                {order.items.reduce((total, line) => total + line.quantity, 0)}{" "}
                {order.items.length === 1 ? "item" : "items"} ·{" "}
                {order.items.map((line) => line.item.name).join(", ")}
              </p>
              <footer>
                <span>Total</span>
                <b>{formatNaira(order.total, true)}</b>
              </footer>
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

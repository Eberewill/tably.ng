import { useState } from "react";
import { BillRequest } from "./bill-request";
import { formatNaira } from "./currency";
import { Icon } from "./icons";
import type { CartItem } from "./types";

export function OrderServed({
  order,
  onClose,
  onOrderMore,
}: {
  order: CartItem[];
  onClose: () => void;
  onOrderMore: () => void;
}) {
  const [billRequested, setBillRequested] = useState(false);
  if (billRequested) {
    return <BillRequest order={order} onBack={() => setBillRequested(false)} />;
  }
  const subtotal = order.reduce(
    (total, line) => total + line.item.price * line.quantity,
    0,
  );
  const total = subtotal * 1.125;

  return (
    <div className="order-served">
      <header>
        <button aria-label="Close order" onClick={onClose}>
          ×
        </button>
        <span>Zuma Grill</span>
        <i aria-hidden="true" />
      </header>
      <main>
        <section className="served-heading">
          <span>
            <Icon name="check" />
          </span>
          <h1>Served</h1>
          <p>Your order has been delivered to Table 12.</p>
        </section>
        <section className="served-summary">
          <h2>Order summary</h2>
          {order.map((line) => (
            <div key={line.id}>
              <span>
                <b>{line.item.name}</b>
                <small>
                  {line.selections.length
                    ? line.selections.join(", ")
                    : "Standard portion"}
                </small>
              </span>
              <strong>{formatNaira(line.item.price * line.quantity)}</strong>
            </div>
          ))}
          <footer>
            <span>Total</span>
            <b>{formatNaira(total, true)}</b>
          </footer>
        </section>
        <section className="served-actions">
          <button onClick={() => setBillRequested(true)}>
            Request the bill
          </button>
          <button onClick={onOrderMore}>Order more</button>
        </section>
      </main>
    </div>
  );
}

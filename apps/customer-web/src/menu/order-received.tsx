import { useState } from "react";
import { formatNaira } from "./currency";
import { Icon } from "./icons";
import { OrderServed } from "./order-served";
import { RequestWaiter } from "./request-waiter";
import type { CartItem } from "./types";

export function OrderReceived({
  order,
  onMenu,
  onOrders,
  status = "preparing",
}: {
  order: CartItem[];
  onMenu: () => void;
  onOrders: () => void;
  status?: "preparing" | "served";
}) {
  const [requestingAssistance, setRequestingAssistance] = useState(false);
  if (status === "served") {
    return <OrderServed order={order} onClose={onMenu} onOrderMore={onMenu} />;
  }
  if (requestingAssistance) {
    return (
      <RequestWaiter
        onBack={() => setRequestingAssistance(false)}
        onMenu={onMenu}
        onOrders={onOrders}
      />
    );
  }
  const subtotal = order.reduce(
    (total, line) => total + line.item.price * line.quantity,
    0,
  );
  const total = subtotal * 1.125;

  return (
    <div className="order-received">
      <main>
        <section className="received-content">
          <div className="received-heading">
            <span>
              <Icon name="check" />
            </span>
            <h1>Order Received</h1>
            <p>
              Your order <b>#ZUMA-4829</b> is confirmed.
            </p>
          </div>
          <section className="status-card">
            <h2>Current status</h2>
            <ol>
              <li className="complete">
                <i>
                  <Icon name="check" />
                </i>
                <span>Received</span>
              </li>
              <li className="active">
                <i></i>
                <span>Preparing</span>
              </li>
              <li>
                <i></i>
                <span>Served</span>
              </li>
            </ol>
            <p>The kitchen is artfully preparing your selections.</p>
          </section>
          <section className="received-summary">
            <h2>Order summary</h2>
            {order.map((line) => (
              <div key={line.id}>
                <span>
                  <i>{line.quantity}x</i>
                  {line.item.name}
                </span>
                <b>{formatNaira(line.item.price * line.quantity)}</b>
              </div>
            ))}
            <footer>
              <span>Total</span>
              <b>{formatNaira(total, true)}</b>
            </footer>
          </section>
          <div className="received-actions">
            <button onClick={() => setRequestingAssistance(true)}>
              <Icon name="waiter" />
              Request assistance
            </button>
            <button onClick={onMenu}>
              <Icon name="menu" />
              View full menu
            </button>
          </div>
          <p className="help-link">Need help? Contact us</p>
        </section>
      </main>
      <nav className="received-nav" aria-label="Guest navigation">
        <button onClick={onMenu}>
          <Icon name="menu" />
          <span>Menu</span>
        </button>
        <button>
          <Icon name="search" />
          <span>Search</span>
        </button>
        <button className="active" onClick={onOrders}>
          <Icon name="orders" />
          <span>Orders</span>
        </button>
        <button>
          <Icon name="account" />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}

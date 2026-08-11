import { formatNaira } from "./currency";
import { Icon } from "./icons";
import type { CartItem } from "./types";

export function CartReview({
  cart,
  note,
  onNoteChange,
  onQuantityChange,
  onRemove,
  onAddMore,
  onPlaceOrder,
}: {
  cart: CartItem[];
  note: string;
  onNoteChange: (note: string) => void;
  onQuantityChange: (id: string, change: number) => void;
  onRemove: (id: string) => void;
  onAddMore: () => void;
  onPlaceOrder: () => void;
}) {
  const subtotal = cart.reduce(
    (total, line) => total + line.item.price * line.quantity,
    0,
  );
  const vat = subtotal * 0.075;
  const consumptionTax = subtotal * 0.05;
  const total = subtotal + vat + consumptionTax;
  if (!cart.length)
    return (
      <main className="cart-review empty-cart">
        <h1>Your cart is waiting</h1>
        <p>
          Choose something lovely from today’s menu and it will appear here.
        </p>
        <button onClick={onAddMore}>Browse menu</button>
      </main>
    );
  return (
    <main className="cart-review">
      <header className="review-title">
        <h1>Order Review</h1>
        <p>Table 12</p>
      </header>
      <section className="cart-lines">
        {cart.map((line) => (
          <article key={line.id} className="cart-line">
            <img src={line.item.image} alt={line.item.name} />
            <div>
              <div className="cart-line-title">
                <h2>{line.item.name}</h2>
                <b>{formatNaira(line.item.price)}</b>
              </div>
              <p>
                {line.selections.length
                  ? line.selections.join(", ")
                  : "Standard portion"}
              </p>
              <div className="line-actions">
                <span>
                  <button
                    aria-label={`Remove one ${line.item.name}`}
                    onClick={() => onQuantityChange(line.id, -1)}
                  >
                    −
                  </button>
                  <b>{line.quantity}</b>
                  <button
                    aria-label={`Add one ${line.item.name}`}
                    onClick={() => onQuantityChange(line.id, 1)}
                  >
                    +
                  </button>
                </span>
                <button onClick={() => onRemove(line.id)}>Remove</button>
              </div>
            </div>
          </article>
        ))}
      </section>
      <button className="add-more" onClick={onAddMore}>
        <Icon name="cart" /> Add more items
      </button>
      <section className="order-note">
        <label htmlFor="order-note">Add a note</label>
        <textarea
          id="order-note"
          rows={3}
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Any allergies, special requests, or preferences?"
        />
      </section>
      <section className="billing-summary">
        <h2>Billing summary</h2>
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatNaira(subtotal, true)}</dd>
          </div>
          <div>
            <dt>VAT (7.5%)</dt>
            <dd>{formatNaira(vat, true)}</dd>
          </div>
          <div>
            <dt>Consumption Tax (5%)</dt>
            <dd>{formatNaira(consumptionTax, true)}</dd>
          </div>
        </dl>
        <footer>
          <span>Total</span>
          <b>{formatNaira(total, true)}</b>
        </footer>
      </section>
      <div className="detail-action">
        <button onClick={onPlaceOrder}>
          <span>Place order</span>
          <b>{formatNaira(total, true)}</b>
        </button>
      </div>
    </main>
  );
}

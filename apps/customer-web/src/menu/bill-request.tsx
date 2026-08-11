import { formatNaira } from "./currency";
import { Icon } from "./icons";
import type { CartItem } from "./types";

export function BillRequest({
  order,
  onBack,
}: {
  order: CartItem[];
  onBack: () => void;
}) {
  const subtotal = order.reduce(
    (total, line) => total + line.item.price * line.quantity,
    0,
  );
  const vat = subtotal * 0.075;
  const consumptionTax = subtotal * 0.05;
  const total = subtotal + vat + consumptionTax;

  function downloadReceipt() {
    const receipt = [
      "ZUMA GRILL",
      "Receipt #ZUMA-4829",
      "Table 12",
      "",
      ...order.flatMap((line) => [
        `${line.quantity}x ${line.item.name}  ${formatNaira(line.item.price * line.quantity, true)}`,
        line.selections.length ? `   ${line.selections.join(", ")}` : "",
      ]),
      "",
      `Subtotal  ${formatNaira(subtotal, true)}`,
      `VAT (7.5%)  ${formatNaira(vat, true)}`,
      `Consumption tax (5%)  ${formatNaira(consumptionTax, true)}`,
      `Total  ${formatNaira(total, true)}`,
    ]
      .filter(Boolean)
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([receipt], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "zuma-grill-receipt.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bill-request">
      <header>
        <button aria-label="Go back to order" onClick={onBack}>
          <Icon name="arrowLeft" />
        </button>
        <span>Zuma Grill</span>
        <i aria-hidden="true" />
      </header>
      <main>
        <section className="bill-heading">
          <h1>Your bill</h1>
          <p>Table 12</p>
        </section>
        <section className="bill-summary">
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
              <strong>
                {formatNaira(line.item.price * line.quantity, true)}
              </strong>
            </div>
          ))}
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
              <dt>Consumption tax (5%)</dt>
              <dd>{formatNaira(consumptionTax, true)}</dd>
            </div>
          </dl>
          <footer>
            <span>Total</span>
            <b>{formatNaira(total, true)}</b>
          </footer>
        </section>
        <p className="bill-note">
          Payment is settled with your server. You can download a copy of your
          receipt now.
        </p>
        <button className="download-receipt" onClick={downloadReceipt}>
          <Icon name="download" />
          Download receipt
        </button>
      </main>
    </div>
  );
}

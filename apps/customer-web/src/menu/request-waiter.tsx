import { useState } from "react";
import { Icon } from "./icons";

const requests = [
  ["waiter", "General assistance"],
  ["water", "Refill water"],
  ["menu", "Extra napkins"],
  ["cutlery", "Request cutlery"],
  ["clear", "Clear table"],
] as const;

export function RequestWaiter({
  onBack,
  onMenu,
  onOrders,
}: {
  onBack: () => void;
  onMenu: () => void;
  onOrders: () => void;
}) {
  const [selectedRequest, setSelectedRequest] = useState<string>();
  const [sent, setSent] = useState(false);

  return (
    <div className="assistance-page">
      <header className="assistance-header">
        <button aria-label="Go back to your order" onClick={onBack}>
          <Icon name="arrowLeft" />
        </button>
        <span>Zuma Grill</span>
        <i aria-hidden="true" />
      </header>
      <main>
        <section className="assistance-heading">
          <h1>Request assistance</h1>
          <p>Select how we can help and a server will be with you shortly.</p>
        </section>
        <section className="assistance-grid" aria-label="Assistance options">
          {requests.map(([icon, label]) => (
            <button
              key={label}
              className={selectedRequest === label ? "selected" : undefined}
              aria-pressed={selectedRequest === label}
              onClick={() => {
                setSelectedRequest(label);
                setSent(false);
              }}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </section>
        <div className="assistance-action">
          {sent && <p>Your request has been sent to the team.</p>}
          <button disabled={!selectedRequest} onClick={() => setSent(true)}>
            {sent ? "Request sent" : "Send request"}
          </button>
        </div>
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

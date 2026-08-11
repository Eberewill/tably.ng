import { useEffect, useState } from "react";
import "./orders-overview.css";

type OrderStatus = "New" | "Preparing" | "Ready" | "Completed";
type ServiceType = "Dine in" | "Takeaway";

type OverviewOrder = {
  id: string;
  table: string;
  guests: number;
  placedAt: string;
  service: ServiceType;
  status: OrderStatus;
  items: Array<{ name: string; price: number; quantity?: number }>;
  note?: string;
};

const columns: Array<{ status: OrderStatus; label: string }> = [
  { status: "New", label: "New" },
  { status: "Preparing", label: "Preparing" },
  { status: "Ready", label: "Ready" },
  { status: "Completed", label: "Completed" },
];

const initialOrders: OverviewOrder[] = [
  { id: "1032", table: "07", guests: 2, placedAt: "2 mins ago", service: "Takeaway", status: "New", items: [{ name: "Truffle Mushroom Pasta", price: 18500 }, { name: "Lemonade", price: 3500 }] },
  { id: "1031", table: "12", guests: 4, placedAt: "4 mins ago", service: "Dine in", status: "New", items: [{ name: "Grilled Salmon", price: 21000 }, { name: "Coke Zero", price: 5000, quantity: 2 }], note: "One guest has a dairy allergy. Keep butter and cream away from this order." },
  { id: "1030", table: "03", guests: 3, placedAt: "6 mins ago", service: "Dine in", status: "New", items: [{ name: "Chicken Suya Bowl", price: 16000 }, { name: "Hibiscus Iced Tea", price: 3000 }] },
  { id: "1029", table: "09", guests: 2, placedAt: "8 mins ago", service: "Dine in", status: "New", items: [{ name: "Margherita Pizza", price: 14500 }, { name: "Sparkling Water", price: 2000 }] },
  { id: "1028", table: "05", guests: 2, placedAt: "10 mins ago", service: "Dine in", status: "Preparing", items: [{ name: "Jollof Rice", price: 15000 }, { name: "Fried Plantain", price: 2500 }], note: "Peanut allergy recorded. Use clean utensils and confirm the garnish." },
  { id: "1027", table: "11", guests: 3, placedAt: "11 mins ago", service: "Dine in", status: "Preparing", items: [{ name: "Pepper Steak", price: 22500 }, { name: "Mashed Potatoes", price: 3500 }] },
  { id: "1026", table: "02", guests: 2, placedAt: "14 mins ago", service: "Takeaway", status: "Preparing", items: [{ name: "Chicken Alfredo", price: 17000 }, { name: "Lemonade", price: 3500 }] },
  { id: "1025", table: "08", guests: 4, placedAt: "16 mins ago", service: "Takeaway", status: "Preparing", items: [{ name: "Seafood Risotto", price: 23000 }, { name: "Coke Zero", price: 2500 }] },
  { id: "1017", table: "14", guests: 3, placedAt: "17 mins ago", service: "Dine in", status: "Preparing", items: [{ name: "Lamb Chops", price: 20500 }, { name: "Garden Salad", price: 3500 }] },
  { id: "1016", table: "10", guests: 2, placedAt: "18 mins ago", service: "Dine in", status: "Preparing", items: [{ name: "Prawn Linguine", price: 16000 }, { name: "Still Water", price: 2500 }] },
  { id: "1024", table: "01", guests: 2, placedAt: "18 mins ago", service: "Dine in", status: "Ready", items: [{ name: "Grilled Chicken", price: 16500 }, { name: "Pineapple Juice", price: 3500 }] },
  { id: "1023", table: "06", guests: 3, placedAt: "20 mins ago", service: "Takeaway", status: "Ready", items: [{ name: "Beef Burger", price: 15000 }, { name: "Fries", price: 3000 }] },
  { id: "1022", table: "10", guests: 2, placedAt: "21 mins ago", service: "Dine in", status: "Ready", items: [{ name: "Spaghetti Bolognese", price: 16000 }, { name: "Sparkling Water", price: 2000 }] },
  { id: "1021", table: "04", guests: 2, placedAt: "25 mins ago", service: "Dine in", status: "Completed", items: [{ name: "Roast Chicken", price: 19500 }] },
  { id: "1020", table: "07", guests: 3, placedAt: "28 mins ago", service: "Dine in", status: "Completed", items: [{ name: "Suya Platter", price: 24000 }] },
  { id: "1019", table: "09", guests: 2, placedAt: "31 mins ago", service: "Takeaway", status: "Completed", items: [{ name: "Seafood Okra", price: 16500 }] },
  { id: "1018", table: "12", guests: 4, placedAt: "34 mins ago", service: "Dine in", status: "Completed", items: [{ name: "Ribeye and Fries", price: 27500 }] },
  { id: "1015", table: "05", guests: 2, placedAt: "38 mins ago", service: "Dine in", status: "Completed", items: [{ name: "Smoky Party Jollof", price: 18000 }] },
  { id: "1014", table: "15", guests: 3, placedAt: "42 mins ago", service: "Takeaway", status: "Completed", items: [{ name: "Peppered Snails", price: 22500 }] },
  { id: "1013", table: "02", guests: 2, placedAt: "46 mins ago", service: "Dine in", status: "Completed", items: [{ name: "Suya Spiced Ribeye", price: 14500 }] },
  { id: "1012", table: "11", guests: 3, placedAt: "51 mins ago", service: "Dine in", status: "Completed", items: [{ name: "Zuma Grill Platter", price: 18500 }] },
];

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function orderTotal(order: OverviewOrder) {
  return order.items.reduce((total, item) => total + item.price, 0);
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />
    </svg>
  );
}

function DensityIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6 4v16M18 4v16M12 4v16M4 8h4M10 15h4M16 10h4" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M7 17h10l-1.5-2v-4a3.5 3.5 0 0 0-7 0v4L7 17ZM10.5 20h3" />
    </svg>
  );
}

export function OrdersOverview() {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [service, setService] = useState<ServiceType | "All">("All");
  const [compact, setCompact] = useState(false);
  const [draggedOrder, setDraggedOrder] = useState<string>();
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>();
  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedOrderId(undefined);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchValue = `${order.id} ${order.table} ${order.items.map((item) => item.name).join(" ")}`.toLowerCase();
    return (
      (service === "All" || order.service === service) &&
      searchValue.includes(query.trim().toLowerCase())
    );
  });

  function moveOrder(id: string, status: OrderStatus) {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  }

  function cycleService() {
    setService((current) =>
      current === "All" ? "Dine in" : current === "Dine in" ? "Takeaway" : "All",
    );
  }

  return (
    <section className={`orders-overview${compact ? " compact" : ""}`}>
      <header className="orders-overview-toolbar">
        <div>
          <h1>Orders</h1>
          <p>Live overview of all table orders.</p>
        </div>
        <div className="orders-overview-actions">
          <label className="orders-search">
            <SearchIcon />
            <span className="sr-only">Search orders</span>
            <input
              type="search"
              placeholder="Search orders, tables or items…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button onClick={cycleService} aria-label={`Service filter: ${service}`}>
            <FilterIcon />
            <span>{service === "All" ? "Filter" : service}</span>
          </button>
          <button
            className={compact ? "active" : ""}
            aria-pressed={compact}
            aria-label="Toggle compact order cards"
            title="Display density"
            onClick={() => setCompact((current) => !current)}
          >
            <DensityIcon />
          </button>
        </div>
      </header>

      <div className="orders-overview-columns">
        {columns.map((column) => {
          const columnOrders = filteredOrders.filter(
            (order) => order.status === column.status,
          );
          const displayedOrders =
            column.status === "Completed" && !showAllCompleted
              ? columnOrders.slice(0, 4)
              : columnOrders;

          return (
            <section
              key={column.status}
              className="overview-order-column"
              data-status={column.status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggedOrder) moveOrder(draggedOrder, column.status);
                setDraggedOrder(undefined);
              }}
            >
              <header>
                <div>
                  <i aria-hidden="true" />
                  <h2>{column.label}</h2>
                  <span>{columnOrders.length}</span>
                </div>
                <b aria-hidden="true">⠿</b>
              </header>
              <div className="overview-order-list">
                {displayedOrders.map((order) => (
                  <article
                    key={order.id}
                    className="overview-order-card"
                    draggable
                    tabIndex={0}
                    aria-label={`View order ${order.id} details`}
                    onClick={() => setSelectedOrderId(order.id)}
                    onDragStart={() => setDraggedOrder(order.id)}
                    onDragEnd={() => setDraggedOrder(undefined)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedOrderId(order.id);
                      }
                    }}
                  >
                    <header>
                      <strong>Order #{order.id}</strong>
                      <time>{order.placedAt}</time>
                    </header>
                    <p>
                      Table {order.table}
                      <span>•</span>
                      {order.guests} guests
                    </p>
                    {column.status === "Completed" ? (
                      <div className="overview-order-total">
                        <span>Total</span>
                        <strong>{money.format(orderTotal(order))}</strong>
                      </div>
                    ) : (
                      <ul>
                        {order.items.map((item) => (
                          <li key={item.name}>
                            <span>{item.quantity ?? 1} × {item.name}</span>
                            <strong>{money.format(item.price)}</strong>
                          </li>
                        ))}
                      </ul>
                    )}
                    <footer>
                      {column.status === "Completed" ? (
                        <span aria-label="Order completed">✓</span>
                      ) : (
                        <AlertIcon />
                      )}
                      <strong>{order.service}</strong>
                    </footer>
                  </article>
                ))}
              </div>
              {column.status === "Completed" && columnOrders.length > 4 && (
                <button
                  className="completed-orders-toggle"
                  onClick={() => setShowAllCompleted((current) => !current)}
                >
                  {showAllCompleted ? "Show fewer" : "View all completed"}
                </button>
              )}
            </section>
          );
        })}
      </div>

      {selectedOrder && (
        <div
          className="overview-order-overlay"
          onClick={() => setSelectedOrderId(undefined)}
        >
          <section
            className="overview-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="overview-order-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="overview-order-modal-close"
              aria-label="Close order details"
              onClick={() => setSelectedOrderId(undefined)}
            >
              ×
            </button>
            <span className="overview-order-modal-status">{selectedOrder.status}</span>
            <h2 id="overview-order-title">Order #{selectedOrder.id}</h2>
            <p>{selectedOrder.placedAt}</p>
            <dl>
              <div><dt>Table</dt><dd>{selectedOrder.table}</dd></div>
              <div><dt>Guests</dt><dd>{selectedOrder.guests}</dd></div>
              <div><dt>Service</dt><dd>{selectedOrder.service}</dd></div>
            </dl>
            <section>
              <h3>Order details</h3>
              <ul>
                {selectedOrder.items.map((item) => (
                  <li key={item.name}>
                    <span>{item.quantity ?? 1} × {item.name}</span>
                    <strong>{money.format(item.price)}</strong>
                  </li>
                ))}
              </ul>
              <div className="overview-order-modal-total">
                <span>Total</span>
                <strong>{money.format(orderTotal(selectedOrder))}</strong>
              </div>
            </section>
            <section className="overview-order-note">
              <h3>Dietary and service notes</h3>
              <p>{selectedOrder.note ?? "No allergies or special requests recorded."}</p>
            </section>
          </section>
        </div>
      )}

      <footer className="orders-live-summary">
        <strong><i aria-hidden="true">⌁</i> Live summary</strong>
        <dl>
          <div><dt>Total orders</dt><dd>{orders.length}</dd></div>
          <div><dt>Preparing</dt><dd>{orders.filter((order) => order.status === "Preparing").length}</dd></div>
          <div><dt>Ready</dt><dd>{orders.filter((order) => order.status === "Ready").length}</dd></div>
          <div><dt>Completed</dt><dd>{orders.filter((order) => order.status === "Completed").length}</dd></div>
          <div><dt>Total sales</dt><dd>{money.format(orders.reduce((total, order) => total + orderTotal(order), 0))}</dd></div>
        </dl>
        <span className="orders-auto-refresh"><i aria-hidden="true" /> Auto refresh · 30s</span>
      </footer>
    </section>
  );
}

import { useEffect, useState } from "react";
import "./live-order-board.css";

type OrderStatus = "Pending" | "Preparing" | "Ready" | "Served";

type LiveOrder = {
  id: string;
  table: string;
  placedAt: string;
  guest?: string;
  allergyNote?: string;
  items: string[];
  status: OrderStatus;
};

const columns: { status: OrderStatus; label: string; action?: string }[] = [
  { status: "Pending", label: "Pending", action: "Start preparing" },
  { status: "Preparing", label: "Preparing", action: "Mark ready" },
  { status: "Ready", label: "Ready to serve", action: "Mark served" },
  { status: "Served", label: "Served" },
];

const initialOrders: LiveOrder[] = [
  {
    id: "ZUMA-4830",
    table: "Table 12",
    placedAt: "12 min ago",
    guest: "VIP guest",
    allergyNote: "No known allergies or special instructions.",
    items: [
      "1x Suya Spiced Ribeye",
      "2x Signature Cocktails",
      "1x Truffle Fries",
    ],
    status: "Pending",
  },
  {
    id: "ZUMA-4831",
    table: "Table 04",
    placedAt: "5 min ago",
    allergyNote: "No dairy — avoid butter, cream and cheese.",
    items: ["3x Oysters Rockefeller", "1x Lobster Bisque · No dairy"],
    status: "Pending",
  },
  {
    id: "ZUMA-4828",
    table: "Table 22",
    placedAt: "18 min ago",
    allergyNote: "Shellfish allergy noted for a guest at the table.",
    items: ["2x Appetizer Platter", "2x Pan-Seared Scallops"],
    status: "Preparing",
  },
  {
    id: "ZUMA-4826",
    table: "Table 08",
    placedAt: "21 min ago",
    allergyNote: "No known allergies or special instructions.",
    items: ["4x Matcha Tiramisu", "2x Ginger Citrus Fizz"],
    status: "Ready",
  },
];

function nextStatus(status: OrderStatus): OrderStatus | undefined {
  return columns[columns.findIndex((column) => column.status === status) + 1]
    ?.status;
}

export function LiveOrderBoard() {
  const [orders, setOrders] = useState(initialOrders);
  const [draggedOrder, setDraggedOrder] = useState<string>();
  const [selectedOrder, setSelectedOrder] = useState<LiveOrder>();

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedOrder(undefined);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  function moveOrder(id: string, status: OrderStatus) {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  }

  return (
    <section className="live-order-board" aria-label="Live order board">
      {columns.map((column) => {
        const columnOrders = orders.filter(
          (order) => order.status === column.status,
        );
        return (
          <section
            key={column.status}
            className="order-column"
            data-status={column.status}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggedOrder) moveOrder(draggedOrder, column.status);
              setDraggedOrder(undefined);
            }}
          >
            <header>
              <h2>{column.label}</h2>
              <span>{columnOrders.length}</span>
            </header>
            <div className="order-list">
              {columnOrders.map((order) => (
                <article
                  key={order.id}
                  className="live-order-card"
                  draggable
                  tabIndex={0}
                  aria-label={`View ${order.id} details`}
                  onClick={() => setSelectedOrder(order)}
                  onDragEnd={() => setDraggedOrder(undefined)}
                  onDragStart={() => setDraggedOrder(order.id)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedOrder(order);
                    }
                  }}
                >
                  <div className="order-meta">
                    <span>{order.table}</span>
                    <small>{order.placedAt}</small>
                  </div>
                  <div className="order-id">
                    <strong>#{order.id}</strong>
                    {order.guest && <em>{order.guest}</em>}
                  </div>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {column.action && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        const status = nextStatus(order.status);
                        if (status) moveOrder(order.id, status);
                      }}
                    >
                      {column.action} →
                    </button>
                  )}
                </article>
              ))}
              {!columnOrders.length && (
                <p className="order-column-empty">Drop an order here</p>
              )}
            </div>
          </section>
        );
      })}
      {selectedOrder && (
        <div
          className="order-detail-overlay"
          onClick={() => setSelectedOrder(undefined)}
        >
          <section
            className="order-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="order-detail-close"
              aria-label="Close order details"
              onClick={() => setSelectedOrder(undefined)}
            >
              ×
            </button>
            <p>{selectedOrder.table}</p>
            <h2 id="order-detail-title">#{selectedOrder.id}</h2>
            <small>
              {selectedOrder.placedAt} · {selectedOrder.status}
            </small>
            <section>
              <h3>Order details</h3>
              <ul>
                {selectedOrder.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section className="order-allergy-note">
              <h3>Dietary notes</h3>
              <p>{selectedOrder.allergyNote}</p>
            </section>
          </section>
        </div>
      )}
    </section>
  );
}

import "./dashboard-page.css";

const summary = [
  ["Today's sales", "₦432,500", "+12.4% from yesterday"],
  ["Active orders", "13", "4 new · 6 preparing · 3 ready"],
  ["Guests served", "42", "Across 18 completed orders"],
  ["Average order", "₦24,028", "+6.8% this week"],
] as const;

const service = [
  { label: "New", count: 4, progress: 31, tone: "new" },
  { label: "Preparing", count: 6, progress: 46, tone: "preparing" },
  { label: "Ready", count: 3, progress: 23, tone: "ready" },
] as const;

const recentOrders = [
  ["#1032", "Table 07", "Truffle Mushroom Pasta", "2 mins ago", "New"],
  ["#1031", "Table 12", "Grilled Salmon", "4 mins ago", "New"],
  ["#1028", "Table 05", "Jollof Rice", "10 mins ago", "Preparing"],
  ["#1024", "Table 01", "Grilled Chicken", "18 mins ago", "Ready"],
] as const;

export function DashboardPage({ onOpenKitchen }: { onOpenKitchen: () => void }) {
  return (
    <main className="restaurant-dashboard">
      <header className="dashboard-heading">
        <div>
          <p>Tuesday, 11 August</p>
          <h1>Good afternoon, Amina</h1>
          <span>Zuma Grill Maitama is open and service is moving steadily.</span>
        </div>
        <button type="button" onClick={onOpenKitchen}>Open Kitchen</button>
      </header>

      <section className="dashboard-summary" aria-label="Today at a glance">
        {summary.map(([label, value, note]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </section>

      <div className="dashboard-layout">
        <section className="dashboard-section dashboard-service">
          <header>
            <div><h2>Live service</h2><p>Orders currently moving through the kitchen.</p></div>
            <button type="button" onClick={onOpenKitchen}>View all orders →</button>
          </header>
          <div className="dashboard-status-list">
            {service.map((item) => (
              <div className="dashboard-status-row" key={item.label}>
                <span><i className={item.tone} />{item.label}</span>
                <div aria-hidden="true"><i className={item.tone} style={{ width: `${item.progress}%` }} /></div>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
          <p className="dashboard-service-note"><i />Average preparation time is 14 minutes. No delayed orders.</p>
        </section>

        <aside className="dashboard-attention">
          <header><h2>Needs attention</h2><span>3</span></header>
          <button type="button" onClick={onOpenKitchen}><strong>Allergy note on Table 12</strong><small>Confirm dairy-free preparation with the kitchen.</small></button>
          <button type="button"><strong>Three dishes are unavailable</strong><small>Review stock before the evening service.</small></button>
          <button type="button"><strong>Two pending invitations</strong><small>New team members have not responded.</small></button>
        </aside>

        <section className="dashboard-section dashboard-recent">
          <header><div><h2>Recent orders</h2><p>The latest activity across dine-in and takeaway.</p></div></header>
          <div className="dashboard-order-head"><span>Order</span><span>Location</span><span>Item</span><span>Placed</span><span>Status</span></div>
          {recentOrders.map(([order, table, item, placed, status]) => (
            <button type="button" key={order} onClick={onOpenKitchen}>
              <strong>{order}</strong><span>{table}</span><span>{item}</span><time>{placed}</time><em className={status.toLowerCase()}>{status}</em>
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}

import { useState, type ReactNode } from "react";
import {
  DonutChart,
  Heatmap,
  HorizontalBars,
  LineChart,
  VerticalBars,
} from "./analytics-charts";
import "./analytics-dashboard.css";

export type AnalyticsSection =
  | "Overview"
  | "Sales"
  | "Orders"
  | "Menu"
  | "Customers"
  | "Staff"
  | "Reports";

const sections: AnalyticsSection[] = [
  "Overview",
  "Sales",
  "Orders",
  "Menu",
  "Customers",
  "Staff",
  "Reports",
];

const sectionCopy: Record<AnalyticsSection, string> = {
  Overview: "Track performance and grow your restaurant.",
  Sales: "Track and understand your sales performance.",
  Orders: "Track and analyze your order flow.",
  Menu: "Understand item performance and menu popularity.",
  Customers: "Understand your customers and their behavior.",
  Staff: "Track staff performance and productivity.",
  Reports: "Generate and download detailed reports.",
};

type Metric = {
  label: string;
  value: string;
  change?: string;
  note?: string;
  icon?: string;
  negative?: boolean;
};

const metrics: Record<Exclude<AnalyticsSection, "Reports">, Metric[]> = {
  Overview: [
    { label: "Total sales", value: "₦1,250,000", change: "↑ 18.6%", note: "vs May 5 – May 11, 2024", icon: "↗" },
    { label: "Orders", value: "320", change: "↑ 14.2%", note: "vs May 5 – May 11, 2024", icon: "□" },
    { label: "Average order value", value: "₦3,906", change: "↑ 6.8%", note: "vs May 5 – May 11, 2024", icon: "▣" },
    { label: "Customers", value: "256", change: "↑ 11.3%", note: "vs May 5 – May 11, 2024", icon: "◎" },
  ],
  Sales: [
    { label: "Total sales", value: "₦1,250,000", change: "↑ 10.4%", note: "vs previous period" },
    { label: "Gross sales", value: "₦1,350,000", change: "↑ 16.6%", note: "vs previous period" },
    { label: "Discounts", value: "₦62,500", change: "↑ 5.2%", note: "vs previous period", negative: true },
    { label: "Net sales", value: "₦1,287,500", change: "↑ 19.2%", note: "vs previous period" },
  ],
  Orders: [
    { label: "Total orders", value: "320", change: "↑ 14.2%", note: "vs previous period" },
    { label: "Completed", value: "280", change: "87.5%", note: "completion rate" },
    { label: "Cancelled", value: "18", change: "5.6%", note: "of all orders", negative: true },
    { label: "Average order value", value: "₦3,906", change: "↑ 6.8%", note: "vs previous period" },
  ],
  Menu: [
    { label: "Total items", value: "48" },
    { label: "Items sold", value: "1,248", change: "↑ 12.4%", note: "vs previous period" },
    { label: "Menu revenue", value: "₦962,500", change: "↑ 15.3%", note: "vs previous period" },
    { label: "Average item price", value: "₦3,450", change: "↑ 3.4%", note: "vs previous period" },
  ],
  Customers: [
    { label: "Total customers", value: "256", change: "↑ 11.2%", note: "vs previous period" },
    { label: "New customers", value: "32", change: "↑ 18.6%", note: "vs previous period" },
    { label: "Returning customers", value: "224", change: "87.6%", note: "returning share" },
    { label: "Avg. spend per customer", value: "₦5,020", change: "↑ 7.1%", note: "vs previous period" },
  ],
  Staff: [
    { label: "Total staff", value: "18" },
    { label: "Total hours worked", value: "512h", change: "↑ 0.4%", note: "vs previous period" },
    { label: "Sales per staff", value: "₦71,389", change: "↑ 11.2%", note: "vs previous period" },
    { label: "Tips collected", value: "₦128,750", change: "↑ 14.1%", note: "vs previous period" },
  ],
};

const topItems = [
  { label: "Grilled Chicken", value: 142, detail: "142" },
  { label: "Jollof Rice", value: 98, detail: "98" },
  { label: "Beef Burger", value: 76, detail: "76" },
  { label: "Chicken Alfredo", value: 64, detail: "64" },
  { label: "Lemonade", value: 60, detail: "60" },
];

function SectionIcon({ section }: { section: AnalyticsSection }) {
  const symbols: Record<AnalyticsSection, string> = {
    Overview: "◔",
    Sales: "↗",
    Orders: "□",
    Menu: "▤",
    Customers: "◎",
    Staff: "♙",
    Reports: "▧",
  };
  return <span aria-hidden="true">{symbols[section]}</span>;
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className="analytics-metric">
      <div>
        <span>{metric.label}</span>
        <strong>{metric.value}</strong>
        {metric.change && (
          <small className={metric.negative ? "negative" : ""}>{metric.change}</small>
        )}
        {metric.note && <p>{metric.note}</p>}
      </div>
      {metric.icon && <i aria-hidden="true">{metric.icon}</i>}
    </article>
  );
}

function MetricGrid({ section }: { section: Exclude<AnalyticsSection, "Reports"> }) {
  return (
    <section className="analytics-metrics" aria-label={`${section} metrics`}>
      {metrics[section].map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </section>
  );
}

function Panel({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`analytics-panel ${className}`}>
      <header>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

function SalesSummary() {
  return (
    <dl className="analytics-summary-list">
      <div><dt>Gross sales</dt><dd>₦1,250,000</dd></div>
      <div><dt>Discounts</dt><dd className="negative">−₦62,500</dd></div>
      <div><dt>Taxes</dt><dd>₦93,750</dd></div>
      <div className="total"><dt>Net sales</dt><dd>₦1,281,250</dd></div>
    </dl>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<string | ReactNode>>;
}) {
  return (
    <div className="analytics-table-wrap">
      <table className="analytics-table">
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>{row.map((cell, index) => <td key={index}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OverviewSection() {
  return (
    <>
      <MetricGrid section="Overview" />
      <div className="analytics-grid analytics-overview-grid">
        <Panel title="Sales overview" subtitle="Daily sales performance" className="wide">
          <LineChart primary={[130, 205, 245, 240, 180, 240, 165]} secondary={[70, 120, 160, 135, 95, 168, 125]} ariaLabel="Sales this week compared with last week" />
        </Panel>
        <Panel title="Sales by channel" subtitle="Breakdown of sales by channel">
          <DonutChart total="₦1,250,000" label="Sales by channel" segments={[
            { label: "Dine-in", value: 65, detail: "₦812,500", tone: "accent" },
            { label: "Takeaway", value: 20, detail: "₦250,000", tone: "gold" },
            { label: "Delivery", value: 15, detail: "₦187,500", tone: "muted" },
          ]} />
        </Panel>
        <Panel title="Sales by time" subtitle="Busiest times of the day"><Heatmap /></Panel>
        <Panel title="Top selling items" subtitle="By quantity sold"><HorizontalBars items={topItems} /></Panel>
        <Panel title="Sales summary" subtitle="Key metrics summary"><SalesSummary /></Panel>
      </div>
    </>
  );
}

function SalesSection() {
  return (
    <>
      <MetricGrid section="Sales" />
      <div className="analytics-grid analytics-two-column">
        <Panel title="Sales over time" subtitle="This week vs last week">
          <LineChart primary={[165, 190, 175, 235, 230, 170, 235, 220, 165]} secondary={[110, 145, 120, 165, 160, 130, 175, 160, 135]} labels={["Mon", "", "Tue", "Wed", "Thu", "Fri", "Sat", "", "Sun"]} ariaLabel="Sales over time" />
        </Panel>
        <Panel title="Sales by payment method" subtitle="Breakdown of sales">
          <DonutChart total="₦1,250,000" label="Sales by payment method" segments={[
            { label: "Card", value: 60, detail: "₦750,000", tone: "accent" },
            { label: "Cash", value: 30, detail: "₦375,000", tone: "gold" },
            { label: "Transfer", value: 10, detail: "₦125,000", tone: "muted" },
          ]} />
        </Panel>
        <Panel title="Sales summary" className="table-panel">
          <DataTable headers={["Channel", "Gross sales", "Discounts", "Taxes", "Net sales"]} rows={[
            ["Dine-in", "₦812,500", "−₦37,500", "₦60,875", "₦835,875"],
            ["Takeaway", "₦250,000", "−₦12,000", "₦18,500", "₦256,500"],
            ["Delivery", "₦187,500", "−₦13,000", "₦14,375", "₦188,875"],
            [<strong>Total</strong>, <strong>₦1,250,000</strong>, "−₦62,500", "₦93,750", <strong>₦1,281,250</strong>],
          ]} />
        </Panel>
        <Panel title="Top selling items" subtitle="By quantity sold"><HorizontalBars items={topItems} /></Panel>
      </div>
    </>
  );
}

function OrdersSection() {
  return (
    <>
      <MetricGrid section="Orders" />
      <div className="analytics-grid analytics-two-column">
        <Panel title="Orders over time" subtitle="This week vs last week">
          <LineChart primary={[32, 41, 34, 52, 55, 38, 49, 37, 46, 34]} secondary={[24, 28, 26, 36, 39, 28, 35, 29, 34, 27]} labels={["Mon", "", "Tue", "Wed", "", "Thu", "Fri", "", "Sat", "Sun"]} ariaLabel="Orders over time" />
        </Panel>
        <Panel title="Orders by channel" subtitle="Breakdown of orders">
          <DonutChart total="320" label="Orders by channel" segments={[
            { label: "Dine-in", value: 55, detail: "176", tone: "accent" },
            { label: "Takeaway", value: 25, detail: "80", tone: "gold" },
            { label: "Delivery", value: 20, detail: "64", tone: "muted" },
          ]} />
        </Panel>
        <Panel title="Order status" className="table-panel">
          <DataTable headers={["Status", "Orders", "%"]} rows={[
            ["Completed", "280", <span className="positive">87.5%</span>],
            ["Cancelled", "18", <span className="negative">5.6%</span>],
            ["Refunded", "10", "3.1%"],
            ["Pending", "12", "3.8%"],
            [<strong>Total</strong>, <strong>320</strong>, "100%"],
          ]} />
        </Panel>
        <Panel title="Peak order times" subtitle="Busiest times of the day"><Heatmap title="Peak order times" /></Panel>
      </div>
    </>
  );
}

function MenuSection() {
  const menuRows = [
    ["Grilled Chicken", "Main course", "142", "₦227,200", "23.6%"],
    ["Jollof Rice", "Main course", "98", "₦114,800", "16.3%"],
    ["Beef Burger", "Main course", "76", "₦90,100", "13.4%"],
    ["Chicken Alfredo", "Main course", "64", "₦100,400", "10.4%"],
    ["Suya Platter", "Starters", "58", "₦87,000", "9.0%"],
  ];
  return (
    <>
      <MetricGrid section="Menu" />
      <div className="analytics-grid analytics-menu-grid">
        <Panel title="Top performing items" subtitle="By revenue" className="table-panel">
          <DataTable headers={["Item", "Category", "Items sold", "Revenue", "% of sales"]} rows={menuRows} />
          <button className="analytics-link-button">View all items →</button>
        </Panel>
        <Panel title="Sales by category" subtitle="By revenue">
          <DonutChart total="₦962,500" label="Sales by menu category" segments={[
            { label: "Main course", value: 60, detail: "₦577,500", tone: "accent" },
            { label: "Drinks", value: 20, detail: "₦192,500", tone: "gold" },
            { label: "Starters", value: 10, detail: "₦96,250", tone: "muted" },
            { label: "Desserts", value: 10, detail: "₦96,250", tone: "line" },
          ]} />
        </Panel>
      </div>
    </>
  );
}

function CustomersSection() {
  return (
    <>
      <MetricGrid section="Customers" />
      <div className="analytics-grid analytics-two-column">
        <Panel title="Customer growth" subtitle="New customers over time">
          <LineChart primary={[14, 25, 18, 20, 31, 19, 32]} ariaLabel="Customer growth" />
        </Panel>
        <Panel title="Customers by source" subtitle="Where your customers came from">
          <DonutChart total="256" label="Customers by source" segments={[
            { label: "Walk-in", value: 50, detail: "128", tone: "accent" },
            { label: "Social media", value: 25, detail: "64", tone: "gold" },
            { label: "Referrals", value: 15, detail: "38", tone: "muted" },
            { label: "Other", value: 10, detail: "26", tone: "line" },
          ]} />
        </Panel>
        <Panel title="Top customers" subtitle="By total spend" className="table-panel">
          <DataTable headers={["Customer", "Total spend"]} rows={[
            ["Adaobi O.", "₦46,600"], ["Chyoma E.", "₦38,750"], ["Tunde A.", "₦32,900"], ["Amaka R.", "₦27,000"], ["James U.", "₦25,400"],
          ]} />
        </Panel>
        <Panel title="Customer segments" subtitle="By lifetime value">
          <HorizontalBars items={[
            { label: "High value", value: 32, detail: "32" },
            { label: "Medium value", value: 96, detail: "96" },
            { label: "Low value", value: 128, detail: "128" },
          ]} />
        </Panel>
      </div>
    </>
  );
}

function StaffSection() {
  return (
    <>
      <MetricGrid section="Staff" />
      <div className="analytics-grid analytics-two-column">
        <Panel title="Top performing staff" subtitle="By sales generated" className="table-panel">
          <DataTable headers={["Staff member", "Role", "Sales", "Orders", "Tips"]} rows={[
            ["John Doe", "Manager", "₦240,600", "82", "₦24,300"],
            ["Mary Chukor", "Server", "₦160,300", "65", "₦18,750"],
            ["Tunde Lawal", "Server", "₦167,800", "58", "₦16,300"],
            ["Aisha Bello", "Cashier", "₦142,000", "0", "₦12,300"],
            ["Samuel U.", "Server", "₦110,600", "42", "₦11,450"],
          ]} />
          <button className="analytics-link-button">View all staff →</button>
        </Panel>
        <Panel title="Hours worked over time" subtitle="Total hours per day">
          <VerticalBars values={[78, 54, 61, 65, 81, 92, 66]} ariaLabel="Hours worked by day" />
        </Panel>
      </div>
    </>
  );
}

const reportRows = [
  ["Sales report", "May 18, 2024", "May 1 – May 18, 2024", "PDF", "↓"],
  ["Orders report", "May 18, 2024", "May 1 – May 18, 2024", "CSV", "↓"],
  ["Menu performance", "May 17, 2024", "May 1 – May 17, 2024", "PDF", "↓"],
  ["Staff performance", "May 17, 2024", "May 1 – May 17, 2024", "CSV", "↓"],
  ["Customer report", "May 16, 2024", "May 1 – May 16, 2024", "PDF", "↓"],
];

function downloadReport(name = "analytics-overview") {
  const content = "Tably.ng analytics report\nPeriod,May 12 – May 18 2024\nTotal sales,1250000\nOrders,320\nCustomers,256\n";
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function ReportsSection() {
  const popular: Array<[string, string]> = [
    ["Sales report", "Detailed sales breakdown and analytics."],
    ["Orders report", "All orders with status and amounts."],
    ["Menu performance", "Menu items performance and popularity."],
    ["Staff productivity", "Staff performance and activity."],
    ["Customer report", "Customer data and purchase behavior."],
  ];
  return (
    <div className="analytics-grid analytics-reports-grid">
      <Panel title="Popular reports">
        <ul className="analytics-report-list">
          {popular.map(([name, description]) => (
            <li key={name}>
              <div><strong>{name}</strong><span>{description}</span></div>
              <button onClick={() => downloadReport(name.toLowerCase().replaceAll(" ", "-"))}>Generate</button>
            </li>
          ))}
        </ul>
        <button className="analytics-link-button">View all reports →</button>
      </Panel>
      <Panel title="Recent reports" className="table-panel">
        <DataTable headers={["Report name", "Generated on", "Period", "Format", "Action"]} rows={reportRows.map((row) => row.map((cell, index) => index === 4 ? <button className="analytics-download" onClick={() => downloadReport(String(row[0]).toLowerCase().replaceAll(" ", "-"))}>{cell}</button> : cell))} />
      </Panel>
    </div>
  );
}

function SectionContent({ section }: { section: AnalyticsSection }) {
  if (section === "Overview") return <OverviewSection />;
  if (section === "Sales") return <SalesSection />;
  if (section === "Orders") return <OrdersSection />;
  if (section === "Menu") return <MenuSection />;
  if (section === "Customers") return <CustomersSection />;
  if (section === "Staff") return <StaffSection />;
  return <ReportsSection />;
}

export function AnalyticsDashboard() {
  const [section, setSection] = useState<AnalyticsSection>("Overview");

  return (
    <section className="analytics-dashboard">
      <aside className="analytics-sidebar">
        <nav aria-label="Analytics sections">
          {sections.map((item) => (
            <button
              key={item}
              className={item === section ? "active" : ""}
              aria-current={item === section ? "page" : undefined}
              onClick={() => setSection(item)}
            >
              <SectionIcon section={item} />
              {item}
            </button>
          ))}
        </nav>
        <label>
          <span>Compare with</span>
          <select defaultValue="previous-week">
            <option value="previous-week">May 5 – May 11, 2024</option>
            <option value="previous-month">April 2024</option>
            <option value="previous-year">May 2023</option>
          </select>
        </label>
      </aside>
      <main className="analytics-content">
        <header className="analytics-heading">
          <div>
            <h1>{section}</h1>
            <p>{sectionCopy[section]}</p>
          </div>
          <button className="analytics-date" type="button">
            May 12 – May 18, 2024 <span aria-hidden="true">▣</span>
          </button>
        </header>
        <SectionContent section={section} />
      </main>
      <footer className="analytics-footer">
        <span><i aria-hidden="true" /> Live</span>
        <small>Data is updated every 5 minutes</small>
        <button onClick={() => downloadReport()}>↓ Export report</button>
      </footer>
    </section>
  );
}

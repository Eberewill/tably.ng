import { useEffect, useMemo, useState, type FormEvent } from "react";
import QRCode from "qrcode";
import "./table-management.css";

type TableStatus = "Available" | "Occupied" | "Cleaning";
type TableView = "grid" | "list";

type RestaurantTable = {
  id: string;
  name: string;
  area: string;
  seats: number;
  status: TableStatus;
  qrVersion: number;
};

const areas = ["Main Dining Room", "Outdoor Terrace", "Private Dining"];
const statusByNumber: Record<number, TableStatus> = {
  2: "Occupied",
  4: "Cleaning",
  7: "Occupied",
  11: "Cleaning",
  12: "Occupied",
  20: "Occupied",
};
const seatPattern = [2, 4, 2, 6, 4, 2, 2, 6];
const storageKey = "tably.restaurant.tables.v1";

const initialTables: RestaurantTable[] = Array.from({ length: 24 }, (_, index) => {
  const number = index + 1;
  return {
    id: `table-${number}`,
    name: `Table ${number}`,
    area: areas[Math.floor(index / 8)] ?? "Main Dining Room",
    seats: seatPattern[index % seatPattern.length] ?? 2,
    status: statusByNumber[number] ?? "Available",
    qrVersion: 1,
  };
});

const recentOrders = [
  ["Suya Spiced Ribeye", "₦18,500", "Preparing"],
  ["Seafood Okra", "₦14,200", "Served"],
  ["Ginger Citrus Fizz", "₦3,600", "Served"],
] as const;

type IconName = "table" | "print" | "search" | "grid" | "list" | "view" | "edit" | "refresh" | "close";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    table: <path d="M4 8h16v6H4zM7 14v6M17 14v6M2 11h2M20 11h2M7 8V5h10v3" />,
    print: <><path d="M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><path d="M7 14h10v6H7zM17 12h.01" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></>,
    list: <><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></>,
    view: <><path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" /><circle cx="12" cy="12" r="2.5" /></>,
    edit: <><path d="m4 20 4.2-1 10.6-10.6a2 2 0 0 0-2.8-2.8L5.4 16.2 4 20Z" /><path d="m14.5 7.1 2.8 2.8" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 8.5A7 7 0 0 1 18.8 7M17.9 15.5A7 7 0 0 1 5.2 17" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

function loadTables() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    return Array.isArray(stored) && stored.length ? stored as RestaurantTable[] : initialTables;
  } catch {
    return initialTables;
  }
}

function escapeHtml(value: string | number) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

function printDocument(title: string, content: string) {
  const frame = document.createElement("iframe");
  frame.title = title;
  frame.style.cssText = "position:fixed;left:-9999px;width:1px;height:1px;border:0";
  frame.onload = () => {
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
    window.setTimeout(() => frame.remove(), 1_000);
  };
  frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>@page{margin:18mm}*{box-sizing:border-box}body{margin:0;color:#1c1c18;font-family:Poppins,Arial,sans-serif}header{margin-bottom:28px}h1,h2,p{margin:0}h1{font-size:24px;font-weight:600}header p,article p{margin-top:5px;color:#6f685f;font-size:12px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}article{break-inside:avoid;text-align:center;padding:18px 8px;border-top:1px solid #ded8ce}article h2{font-size:16px;font-weight:600}img{display:block;width:180px;height:180px;margin:14px auto 0}@media(max-width:700px){main{grid-template-columns:repeat(2,1fr)}}</style></head><body>${content}</body></html>`;
  document.body.append(frame);
}

function tableUrl(table: RestaurantTable) {
  return `https://tably.ng/r/zuma-grill-maitama/${table.id}?v=${table.qrVersion}`;
}

export function TableManagement() {
  const [tables, setTables] = useState<RestaurantTable[]>(loadTables);
  const [selectedId, setSelectedId] = useState("table-14");
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All Areas");
  const [status, setStatus] = useState<TableStatus | "All Status">("All Status");
  const [view, setView] = useState<TableView>("grid");
  const [detailTab, setDetailTab] = useState<"details" | "history">("details");
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({ name: "", area: areas[0] ?? "Main Dining Room", seats: 2, status: "Available" as TableStatus });

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(tables)), [tables]);

  useEffect(() => {
    let active = true;
    Promise.all(tables.map(async (table) => [table.id, await QRCode.toDataURL(tableUrl(table), {
      width: 220,
      margin: 1,
      color: { dark: "#1c1c18", light: "#ffffff" },
    })] as const)).then((entries) => active && setQrCodes(Object.fromEntries(entries)));
    return () => { active = false; };
  }, [tables]);

  const selectedTable = tables.find((table) => table.id === selectedId);
  const counts = useMemo(() => ({
    available: tables.filter((table) => table.status === "Available").length,
    occupied: tables.filter((table) => table.status === "Occupied").length,
    cleaning: tables.filter((table) => table.status === "Cleaning").length,
  }), [tables]);
  const filteredTables = tables.filter((table) => {
    const search = `${table.name} ${table.area}`.toLowerCase();
    return search.includes(query.trim().toLowerCase()) && (area === "All Areas" || table.area === area) && (status === "All Status" || table.status === status);
  });

  function openAdd() {
    const nextNumber = Math.max(...tables.map((table) => Number(table.id.replace("table-", ""))), 0) + 1;
    setForm({ name: `Table ${nextNumber}`, area: areas[0] ?? "Main Dining Room", seats: 2, status: "Available" });
    setModal("add");
  }

  function openEdit(table: RestaurantTable) {
    setSelectedId(table.id);
    setForm({ name: table.name, area: table.area, seats: table.seats, status: table.status });
    setModal("edit");
  }

  function saveTable(event: FormEvent) {
    event.preventDefault();
    if (modal === "edit" && selectedTable) {
      setTables((current) => current.map((table) => table.id === selectedTable.id ? { ...table, ...form } : table));
    } else {
      const nextNumber = Math.max(...tables.map((table) => Number(table.id.replace("table-", ""))), 0) + 1;
      const table = { id: `table-${nextNumber}`, ...form, qrVersion: 1 };
      setTables((current) => [...current, table]);
      setSelectedId(table.id);
    }
    setModal(null);
  }

  function regenerate(table: RestaurantTable) {
    setTables((current) => current.map((item) => item.id === table.id ? { ...item, qrVersion: item.qrVersion + 1 } : item));
  }

  function changeStatus(table: RestaurantTable) {
    const next: Record<TableStatus, TableStatus> = { Available: "Occupied", Occupied: "Cleaning", Cleaning: "Available" };
    setTables((current) => current.map((item) => item.id === table.id ? { ...item, status: next[item.status] } : item));
  }

  function printQr(table: RestaurantTable) {
    const qrCode = qrCodes[table.id];
    if (!qrCode) return;
    printDocument(`${table.name} QR code`, `<header><h1>Zuma Grill Maitama</h1><p>Scan to open the Tably menu</p></header><main><article><h2>${escapeHtml(table.name)}</h2><p>${escapeHtml(table.area)} · ${table.seats} seats</p><img src="${qrCode}" alt="${escapeHtml(table.name)} QR code"></article></main>`);
  }

  function printAll() {
    const cards = tables.map((table) => `<article><h2>${escapeHtml(table.name)}</h2><p>${escapeHtml(table.area)} · ${table.seats} seats</p><img src="${qrCodes[table.id] ?? ""}" alt="${escapeHtml(table.name)} QR code"></article>`).join("");
    printDocument("Zuma Grill table QR codes", `<header><h1>Zuma Grill Maitama</h1><p>Table QR codes · ${tables.length} tables</p></header><main>${cards}</main>`);
  }

  return (
    <main className="table-management">
      <header className="table-heading">
        <div><h1>Table Management</h1><p>Manage restaurant tables, QR codes and availability.</p></div>
        <div><button type="button" onClick={printAll}><Icon name="print" />Print all QR codes</button><button className="primary" type="button" onClick={openAdd}>+ Add new table</button></div>
      </header>

      <section className="table-metrics" aria-label="Table summary">
        <article><i><Icon name="table" /></i><span>Total tables<strong>{tables.length}</strong></span></article>
        <article><i className="available"><Icon name="table" /></i><span>Available<strong>{counts.available}</strong></span></article>
        <article><i className="occupied"><Icon name="table" /></i><span>Occupied<strong>{counts.occupied}</strong></span></article>
        <article><i className="cleaning"><Icon name="refresh" /></i><span>Cleaning<strong>{counts.cleaning}</strong></span></article>
      </section>

      <div className={`table-workspace${selectedTable ? " with-details" : ""}`}>
        <section className="table-browser">
          <div className="table-toolbar">
            <label><Icon name="search" /><span className="sr-only">Search tables</span><input type="search" placeholder="Search table or location…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            <select aria-label="Filter by area" value={area} onChange={(event) => setArea(event.target.value)}><option>All Areas</option>{areas.map((item) => <option key={item}>{item}</option>)}</select>
            <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value as TableStatus | "All Status")}><option>All Status</option><option>Available</option><option>Occupied</option><option>Cleaning</option></select>
            <span className="table-view-toggle"><button className={view === "grid" ? "active" : ""} type="button" aria-label="Grid view" onClick={() => setView("grid")}><Icon name="grid" /></button><button className={view === "list" ? "active" : ""} type="button" aria-label="List view" onClick={() => setView("list")}><Icon name="list" /></button></span>
          </div>

          {areas.map((areaName) => {
            const areaTables = filteredTables.filter((table) => table.area === areaName);
            if (!areaTables.length) return null;
            return <section className="table-area" key={areaName}><h2>{areaName}<span>{areaTables.length}</span></h2><div className="table-grid" data-view={view}>{areaTables.map((table) => <article className={table.id === selectedId ? "selected" : ""} key={table.id} tabIndex={0} aria-label={`View ${table.name}`} onClick={() => { setSelectedId(table.id); setDetailTab("details"); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { setSelectedId(table.id); setDetailTab("details"); } }}>
              <header><strong>{table.name}</strong><button type="button" aria-label={`Edit ${table.name}`} onClick={(event) => { event.stopPropagation(); openEdit(table); }}><Icon name="edit" /></button></header>
              <img src={qrCodes[table.id]} alt={`${table.name} QR code`} />
              <div className="table-card-meta"><span className={`table-status ${table.status.toLowerCase()}`}><i />{table.status}</span><span>{table.seats} seats</span></div>
              <footer><button type="button" onClick={(event) => { event.stopPropagation(); setSelectedId(table.id); }}><Icon name="view" />View</button><button type="button" onClick={(event) => { event.stopPropagation(); regenerate(table); }}><Icon name="refresh" />Regenerate</button></footer>
            </article>)}</div></section>;
          })}
          {!filteredTables.length && <p className="table-empty">No tables match these filters.</p>}
        </section>

        {selectedTable && <aside className="table-details">
          <header><div><h2>{selectedTable.name}</h2><span className={`table-status ${selectedTable.status.toLowerCase()}`}><i />{selectedTable.status}</span><p>{selectedTable.area} · {selectedTable.seats} seats</p></div><button type="button" aria-label="Close table details" onClick={() => setSelectedId("")}><Icon name="close" /></button></header>
          <nav><button className={detailTab === "details" ? "active" : ""} type="button" onClick={() => setDetailTab("details")}>Table details</button><button className={detailTab === "history" ? "active" : ""} type="button" onClick={() => setDetailTab("history")}>Order history</button></nav>
          {detailTab === "details" ? <>
            <section className="table-qr-detail"><div><h3>QR code</h3><img src={qrCodes[selectedTable.id]} alt={`${selectedTable.name} QR code`} /><button type="button" onClick={() => printQr(selectedTable)}><Icon name="print" />Print QR code</button><button className="regenerate" type="button" onClick={() => regenerate(selectedTable)}><Icon name="refresh" />Regenerate code</button></div><dl><div><dt>Table name</dt><dd>{selectedTable.name}</dd></div><div><dt>Area</dt><dd>{selectedTable.area}</dd></div><div><dt>Capacity</dt><dd>{selectedTable.seats} seats</dd></div><div><dt>Status</dt><dd><span className={`table-status ${selectedTable.status.toLowerCase()}`}><i />{selectedTable.status}</span></dd></div></dl></section>
            <section className="table-session"><h3>Current session</h3>{selectedTable.status === "Occupied" ? <dl><div><dt>Current party</dt><dd>2 guests</dd></div><div><dt>Seated</dt><dd>7:15 PM</dd></div><div><dt>Ordered items</dt><dd>3 items</dd></div></dl> : <p>No active party at this table.</p>}<button type="button" onClick={() => changeStatus(selectedTable)}>{selectedTable.status === "Available" ? "Mark as occupied" : selectedTable.status === "Occupied" ? "Mark for cleaning" : "Mark as available"}</button></section>
            <section className="table-recent-orders"><header><h3>Recent orders</h3><button type="button" onClick={() => setDetailTab("history")}>View all</button></header>{recentOrders.map(([name, price, orderStatus]) => <article key={name}><span><strong>{name}</strong><small>Today · Dine in</small></span><span><b>{price}</b><em>{orderStatus}</em></span></article>)}</section>
          </> : <section className="table-history"><h3>Order history</h3>{recentOrders.concat(recentOrders).map(([name, price, orderStatus], index) => <article key={`${name}-${index}`}><span><strong>{name}</strong><small>{index < 3 ? "Today" : "Yesterday"} · Dine in</small></span><span><b>{price}</b><em>{orderStatus}</em></span></article>)}</section>}
        </aside>}
      </div>

      {modal && <div className="table-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}><form className="table-modal" role="dialog" aria-modal="true" aria-labelledby="table-modal-title" onSubmit={saveTable}><header><div><h2 id="table-modal-title">{modal === "add" ? "Add new table" : "Edit table"}</h2><p>Set the table identity, location and service status.</p></div><button type="button" aria-label="Close dialog" onClick={() => setModal(null)}><Icon name="close" /></button></header><div><label><span>Table name</span><input required autoFocus value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label><label><span>Area</span><select value={form.area} onChange={(event) => setForm((current) => ({ ...current, area: event.target.value }))}>{areas.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Seats</span><input required min="1" max="30" type="number" value={form.seats} onChange={(event) => setForm((current) => ({ ...current, seats: Number(event.target.value) }))} /></label><label><span>Status</span><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TableStatus }))}><option>Available</option><option>Occupied</option><option>Cleaning</option></select></label></div><footer><button type="button" onClick={() => setModal(null)}>Cancel</button><button className="primary" type="submit">{modal === "add" ? "Add table" : "Save changes"}</button></footer></form></div>}
    </main>
  );
}

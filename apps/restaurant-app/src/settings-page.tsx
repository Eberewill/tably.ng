import { useEffect, useMemo, useState } from "react";
import "./settings-page.css";

type SettingsSection = "profile" | "business" | "ordering" | "payments" | "notifications" | "devices" | "menu" | "integrations" | "security" | "data";

type SettingsState = {
  restaurantName: string;
  restaurantType: string;
  phone: string;
  email: string;
  address: string;
  timezone: string;
  currency: string;
  language: string;
  receiptPrefix: string;
  receiptNumber: string;
  registrationNumber: string;
  taxId: string;
  serviceCharge: boolean;
  futureOrders: boolean;
  pricesIncludeTax: boolean;
  lowStockAlerts: boolean;
  dineIn: boolean;
  tableOrdering: boolean;
  autoAssignTable: boolean;
  holdTime: number;
  minimumOrder: number;
  notificationNewOrder: boolean;
  notificationStatus: boolean;
  notificationSummary: boolean;
  notificationStock: boolean;
  notificationSystem: boolean;
};

const initialSettings: SettingsState = {
  restaurantName: "Zuma Grill",
  restaurantType: "Fine Dining",
  phone: "+234 801 234 5678",
  email: "hello@zumagrill.ng",
  address: "Maitama, Abuja, Nigeria",
  timezone: "(GMT+1) West Africa Time",
  currency: "NGN – Nigerian Naira (₦)",
  language: "English",
  receiptPrefix: "ZG",
  receiptNumber: "ZG-000011",
  registrationNumber: "RC 1234567",
  taxId: "12345678901",
  serviceCharge: true,
  futureOrders: true,
  pricesIncludeTax: false,
  lowStockAlerts: true,
  dineIn: true,
  tableOrdering: true,
  autoAssignTable: false,
  holdTime: 15,
  minimumOrder: 0,
  notificationNewOrder: true,
  notificationStatus: true,
  notificationSummary: true,
  notificationStock: true,
  notificationSystem: false,
};

const sections: Array<{ id: SettingsSection; title: string; description: string; icon: IconName }> = [
  { id: "profile", title: "Restaurant Profile", description: "Basic information, contact & location", icon: "store" },
  { id: "business", title: "Business Settings", description: "General business preferences", icon: "sliders" },
  { id: "ordering", title: "Ordering Settings", description: "Dine in, takeaway and delivery options", icon: "bag" },
  { id: "payments", title: "Payment & Taxes", description: "Payment methods, taxes & charges", icon: "card" },
  { id: "notifications", title: "Notifications", description: "Email, SMS and in-app alerts", icon: "bell" },
  { id: "devices", title: "Printer & KDS", description: "Printers and kitchen display settings", icon: "printer" },
  { id: "menu", title: "Menu Settings", description: "Categories, modifiers & tags", icon: "menu" },
  { id: "integrations", title: "Integrations", description: "Third-party integrations", icon: "plug" },
  { id: "security", title: "Security", description: "Password, 2FA & sessions", icon: "shield" },
  { id: "data", title: "Data & Backup", description: "Backup, export and data tools", icon: "data" },
];

type IconName = "store" | "sliders" | "bag" | "card" | "bell" | "printer" | "menu" | "plug" | "shield" | "data" | "search" | "edit" | "clock" | "close";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    store: <><path d="M4 9h16l-1-5H5L4 9Z" /><path d="M5 9v11h14V9M9 20v-6h6v6M4 9c0 2 3 2 4 0 1 2 3 2 4 0 1 2 3 2 4 0 1 2 4 2 4 0" /></>,
    sliders: <><path d="M4 6h5M13 6h7M4 12h9M17 12h3M4 18h3M11 18h9" /><circle cx="11" cy="6" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="9" cy="18" r="2" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18M7 15h4" /></>,
    bell: <><path d="M6 17h12l-1.5-2.5V10a4.5 4.5 0 0 0-9 0v4.5L6 17Z" /><path d="M10 20h4" /></>,
    printer: <><path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7z" /><path d="M17 11h1" /></>,
    menu: <><path d="M6 3v8M3 3v5c0 2 6 2 6 0V3M6 11v10M16 3v18M16 3c4 2 4 8 0 10" /></>,
    plug: <><path d="m8 12 8-8M5 9l4 4M11 3l4 4M9 13l2 2-6 6M15 7l2 2-3 3" /></>,
    shield: <path d="M12 3 5 6v5c0 5 3 8.3 7 10 4-1.7 7-5 7-10V6l-7-3Zm0 4v10M8.5 10l3.5 2 3.5-2" />,
    data: <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 1.7 3 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3 3 7 3s7-1.3 7-3v-7" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
    edit: <><path d="m4 20 4.2-1 10.7-10.7-3.2-3.2L5 15.8 4 20Z" /><path d="m14.5 6.3 3.2 3.2" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

function readSettings() {
  try {
    return { ...initialSettings, ...JSON.parse(localStorage.getItem("tably.restaurant-settings") ?? "{}") } as SettingsState;
  } catch {
    return initialSettings;
  }
}

function SwitchRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="settings-switch-row"><span><strong>{title}</strong><small>{description}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>;
}

const paymentMethods: Array<[string, string, string]> = [
  ["Cash", "Active", "Manual"], ["Card", "Active", "Online"], ["Bank Transfer", "Active", "Manual"], ["USSD", "Inactive", "Online"], ["Mobile Money", "Inactive", "Online"],
];
const printers: Array<[string, string, string, string]> = [["Kitchen Printer", "Kitchen", "Thermal", "Online"], ["Bar Printer", "Bar", "Thermal", "Online"], ["Receipt Printer", "Front Desk", "Thermal", "Online"], ["Label Printer", "Storage", "Label", "Offline"]];
const menuCategories: Array<[string, string, string]> = [["Starters", "12", "Active"], ["Soups", "8", "Active"], ["Main Course", "24", "Active"], ["Grills", "16", "Active"], ["Desserts", "10", "Inactive"]];
const integrations: Array<[string, string, string]> = [["Accounting", "QuickBooks", "Connected"], ["Delivery Partners", "Bolt, Chowdeck", "Connected"], ["Payment Gateway", "Paystack", "Connected"], ["Marketing Tools", "Mailchimp", "Disconnected"]];

export function SettingsPage() {
  const [active, setActive] = useState<SettingsSection>("profile");
  const [settings, setSettings] = useState(readSettings);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [hoursEditing, setHoursEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [orderingTab, setOrderingTab] = useState<"Dine In" | "Takeaway" | "Delivery">("Dine In");
  const [notificationTab, setNotificationTab] = useState<"Email" | "SMS" | "In-app">("Email");
  const [dataTab, setDataTab] = useState<"Backup" | "Export Data">("Backup");
  const [integrationState, setIntegrationState] = useState<Record<string, boolean>>({ Accounting: true, "Delivery Partners": true, "Payment Gateway": true, "Marketing Tools": false });
  const [hours, setHours] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => ({ day, time: day === "Saturday" ? "9:00 AM – 11:00 PM" : day === "Sunday" ? "9:00 AM – 10:00 PM" : day === "Friday" ? "8:00 AM – 11:00 PM" : "8:00 AM – 10:00 PM", closed: day === "Sunday" })));

  const filteredSections = useMemo(() => sections.filter((section) => `${section.title} ${section.description}`.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const currentSection = sections.find((section) => section.id === active)!;

  useEffect(() => {
    // ponytail: local persistence keeps the settings prototype useful until the settings API lands.
    localStorage.setItem("tably.restaurant-settings", JSON.stringify(settings));
  }, [settings]);

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function sectionHeader(action = "Edit") {
    return <header className="settings-section-heading"><div><h2>{currentSection.title}</h2><p>{currentSection.description}.</p></div><button type="button" onClick={() => { setEditing((current) => !current); setNotice(editing ? "Settings saved." : ""); }}><Icon name="edit" />{editing ? "Save" : action}</button></header>;
  }

  function profileSection() {
    return <>
      <section className="settings-panel">{sectionHeader()}<div className="profile-form"><div className="restaurant-logo-field"><span>Restaurant logo</span><i>ZG</i><div><button type="button">Change Logo</button><button type="button" className="danger">Remove</button></div></div><div className="settings-field-grid"><label><span>Restaurant name</span><input disabled={!editing} value={settings.restaurantName} onChange={(event) => update("restaurantName", event.target.value)} /></label><label><span>Restaurant type</span><select disabled={!editing} value={settings.restaurantType} onChange={(event) => update("restaurantType", event.target.value)}><option>Fine Dining</option><option>Casual Dining</option><option>Quick Service</option><option>Cafe</option></select></label><label><span>Phone number</span><input disabled={!editing} value={settings.phone} onChange={(event) => update("phone", event.target.value)} /></label><label><span>Email address</span><input disabled={!editing} type="email" value={settings.email} onChange={(event) => update("email", event.target.value)} /></label><label><span>Address</span><input disabled={!editing} value={settings.address} onChange={(event) => update("address", event.target.value)} /></label><label><span>Time zone</span><select disabled={!editing} value={settings.timezone} onChange={(event) => update("timezone", event.target.value)}><option>(GMT+1) West Africa Time</option><option>(GMT) Greenwich Mean Time</option><option>(GMT+2) Central Africa Time</option></select></label></div></div></section>
      <section className="settings-panel"><header className="settings-section-heading"><div><h2>Business Hours</h2><p>Manage your restaurant operating hours.</p></div><button type="button" onClick={() => setHoursEditing((current) => !current)}><Icon name="clock" />{hoursEditing ? "Done" : "Edit Hours"}</button></header><div className="business-hours">{hours.map((item) => <button key={item.day} type="button" className={item.closed ? "closed" : ""} disabled={!hoursEditing} onClick={() => setHours((current) => current.map((day) => day.day === item.day ? { ...day, closed: !day.closed } : day))}><strong>{item.day}</strong><span>{item.time}</span>{item.closed && <em>Closed</em>}</button>)}</div></section>
      <section className="settings-panel"><header className="settings-section-heading"><div><h2>Currency & Regional Settings</h2><p>Set currency, dates and regional preferences.</p></div></header><div className="regional-grid"><label><span>Currency</span><select value={settings.currency} onChange={(event) => update("currency", event.target.value)}><option>NGN – Nigerian Naira (₦)</option><option>USD – US Dollar ($)</option><option>GBP – British Pound (£)</option></select></label><label><span>Date format</span><select><option>DD MMM, YYYY</option><option>MM/DD/YYYY</option></select></label><label><span>Time format</span><select><option>12 Hour (AM/PM)</option><option>24 Hour</option></select></label><label><span>Number format</span><select><option>1,234.56</option><option>1.234,56</option></select></label></div></section>
      <section className="settings-panel"><header className="settings-section-heading"><div><h2>Other Preferences</h2><p>Configure additional preferences for your restaurant.</p></div></header><div className="settings-switch-grid"><SwitchRow title="Enable Service Charge" description="Add service charge to orders" checked={settings.serviceCharge} onChange={(value) => update("serviceCharge", value)} /><SwitchRow title="Show Prices Including Tax" description="Display menu prices including tax" checked={settings.pricesIncludeTax} onChange={(value) => update("pricesIncludeTax", value)} /><SwitchRow title="Allow Future Orders" description="Allow customers to place future orders" checked={settings.futureOrders} onChange={(value) => update("futureOrders", value)} /><SwitchRow title="Low Stock Alerts" description="Get notified when stock is running low" checked={settings.lowStockAlerts} onChange={(value) => update("lowStockAlerts", value)} /></div></section>
    </>;
  }

  function businessSection() {
    return <section className="settings-panel">{sectionHeader()}<div className="settings-field-grid business-fields"><label><span>Business currency</span><select value={settings.currency} onChange={(event) => update("currency", event.target.value)}><option>NGN – Nigerian Naira (₦)</option><option>USD – US Dollar ($)</option></select></label><label><span>Language</span><select value={settings.language} onChange={(event) => update("language", event.target.value)}><option>English</option><option>French</option></select></label><label><span>Receipt prefix</span><input value={settings.receiptPrefix} onChange={(event) => update("receiptPrefix", event.target.value)} /></label><label><span>Receipt number format</span><input value={settings.receiptNumber} onChange={(event) => update("receiptNumber", event.target.value)} /></label><label><span>Business registration number</span><input value={settings.registrationNumber} onChange={(event) => update("registrationNumber", event.target.value)} /></label><label><span>VAT / Tax ID</span><input value={settings.taxId} onChange={(event) => update("taxId", event.target.value)} /></label></div><div className="settings-switch-grid"><SwitchRow title="Service Charge" description="Apply service charge to orders" checked={settings.serviceCharge} onChange={(value) => update("serviceCharge", value)} /><SwitchRow title="Round Off" description="Round off order totals" checked={false} onChange={() => setNotice("Round-off preference updated.")} /></div></section>;
  }

  function orderingSection() {
    return <section className="settings-panel">{sectionHeader()}<nav className="settings-subtabs">{(["Dine In", "Takeaway", "Delivery"] as const).map((item) => <button key={item} className={orderingTab === item ? "active" : ""} type="button" onClick={() => setOrderingTab(item)}>{item}</button>)}</nav><div className="settings-list"><SwitchRow title={`${orderingTab} Orders`} description={`Allow customers to place ${orderingTab.toLowerCase()} orders`} checked={settings.dineIn} onChange={(value) => update("dineIn", value)} /><SwitchRow title="Table Ordering" description="Allow guests to order from their table" checked={settings.tableOrdering} onChange={(value) => update("tableOrdering", value)} /><SwitchRow title="Auto Assign Table" description="Automatically assign available tables" checked={settings.autoAssignTable} onChange={(value) => update("autoAssignTable", value)} /><label className="settings-value-row"><span><strong>Hold Time</strong><small>Time to hold a table before marking it available</small></span><input type="number" min="0" value={settings.holdTime} onChange={(event) => update("holdTime", Number(event.target.value))} /></label><label className="settings-value-row"><span><strong>Minimum Order Amount</strong><small>Minimum order amount for this channel</small></span><input type="number" min="0" value={settings.minimumOrder} onChange={(event) => update("minimumOrder", Number(event.target.value))} /></label></div></section>;
  }

  function paymentsSection() {
    return <section className="settings-panel"><header className="settings-section-heading"><div><h2>Payment & Taxes</h2><p>Manage payment methods, taxes and charges.</p></div><button type="button" onClick={() => setNotice("A new inactive payment method was added.")}>+ Add Method</button></header><nav className="settings-subtabs"><button className="active" type="button">Payment Methods</button><button type="button">Taxes</button><button type="button">Service Charges</button><button type="button">Other Charges</button></nav><div className="settings-table payment-table"><header><span>Method</span><span>Status</span><span>Type</span><span>Actions</span></header>{paymentMethods.map(([name, status, type]) => <article key={name}><strong>{name}</strong><span className={`settings-status ${status.toLowerCase()}`}>{status}</span><span>{type}</span><button type="button" onClick={() => setNotice(`${name} settings opened.`)}><Icon name="edit" /></button></article>)}</div></section>;
  }

  function notificationsSection() {
    const rows: Array<[keyof SettingsState, string, string]> = [["notificationNewOrder", "New Order", "Receive an alert when a new order is placed"], ["notificationStatus", "Order Status Update", "Receive alerts when order status changes"], ["notificationSummary", "Daily Summary", "Receive a daily sales summary"], ["notificationStock", "Low Stock Alert", "Receive alerts when stock is running low"], ["notificationSystem", "System Updates", "Receive important system updates"]];
    return <section className="settings-panel">{sectionHeader()}<nav className="settings-subtabs">{(["Email", "SMS", "In-app"] as const).map((item) => <button key={item} className={notificationTab === item ? "active" : ""} type="button" onClick={() => setNotificationTab(item)}>{item}</button>)}</nav><div className="settings-list">{rows.map(([key, title, description]) => <SwitchRow key={key} title={title} description={`${description} via ${notificationTab.toLowerCase()}`} checked={settings[key] as boolean} onChange={(value) => update(key, value)} />)}</div></section>;
  }

  function devicesSection() {
    return <section className="settings-panel"><header className="settings-section-heading"><div><h2>Printer & KDS</h2><p>Manage printers and kitchen display systems.</p></div><button type="button" onClick={() => setNotice("Printer discovery started.")}>+ Add Printer</button></header><nav className="settings-subtabs"><button className="active" type="button">Printers</button><button type="button">KDS</button></nav><div className="settings-table device-table"><header><span>Printer name</span><span>Location</span><span>Type</span><span>Status</span><span>Actions</span></header>{printers.map(([name, location, type, status]) => <article key={name}><strong>{name}</strong><span>{location}</span><span>{type}</span><span className={`settings-status ${status.toLowerCase()}`}>{status}</span><button type="button" onClick={() => setNotice(`${name} settings opened.`)}><Icon name="edit" /></button></article>)}</div></section>;
  }

  function menuSection() {
    return <section className="settings-panel"><header className="settings-section-heading"><div><h2>Menu Settings</h2><p>Manage menu categories, modifiers and tags.</p></div><button type="button" onClick={() => setNotice("A new category can now be configured in Menu Management.")}>+ Add Category</button></header><nav className="settings-subtabs"><button className="active" type="button">Categories</button><button type="button">Modifiers</button><button type="button">Tags</button></nav><div className="settings-table menu-settings-table"><header><span>Category</span><span>Items</span><span>Status</span><span>Actions</span></header>{menuCategories.map(([name, items, status]) => <article key={name}><strong>⋮⋮ &nbsp; {name}</strong><span>{items} items</span><span className={`settings-status ${status.toLowerCase()}`}>{status}</span><button type="button" onClick={() => setNotice(`${name} category opened.`)}><Icon name="edit" /></button></article>)}</div></section>;
  }

  function integrationsSection() {
    return <section className="settings-panel">{sectionHeader("Manage")}<div className="integration-list">{integrations.map(([name, provider]) => { const connected = integrationState[name]; return <article key={name}><i><Icon name="plug" /></i><span><strong>{name}</strong><small>Connect and manage {name.toLowerCase()}</small></span><b>{provider}</b><em className={connected ? "connected" : ""}>{connected ? "Connected" : "Disconnected"}</em><button type="button" onClick={() => setIntegrationState((current) => ({ ...current, [name]: !connected }))}>{connected ? "Disconnect" : "Connect"}</button></article>; })}</div></section>;
  }

  function securitySection() {
    return <section className="settings-panel">{sectionHeader("Review")}<div className="security-list"><article><i><Icon name="shield" /></i><span><strong>Password</strong><small>Update your account password</small></span><button type="button" onClick={() => setNotice("Password reset instructions prepared.")}>Change Password</button></article><article><i><Icon name="shield" /></i><span><strong>Two-Factor Authentication</strong><small>Add an extra layer of security</small></span><button type="button" onClick={() => setNotice("Two-factor authentication enabled.")}>Enable 2FA</button></article><article><i><Icon name="data" /></i><span><strong>Active Sessions</strong><small>Manage active sessions across devices</small></span><button type="button" onClick={() => setNotice("You have one active desktop session.")}>View Sessions</button></article></div></section>;
  }

  function dataSection() {
    return <section className="settings-panel">{sectionHeader("Manage")}<nav className="settings-subtabs"><button className={dataTab === "Backup" ? "active" : ""} type="button" onClick={() => setDataTab("Backup")}>Backup</button><button className={dataTab === "Export Data" ? "active" : ""} type="button" onClick={() => setDataTab("Export Data")}>Export Data</button></nav>{dataTab === "Backup" ? <div className="settings-list"><SwitchRow title="Automatic Backup" description="Automatically back up your data daily" checked={true} onChange={() => setNotice("Automatic backup preference updated.")} /><div className="settings-action-row"><span><strong>Last Backup</strong><small>Today, 02:00 AM</small></span><button type="button" onClick={() => setNotice("Backup log opened.")}>View Logs</button></div><div className="settings-action-row"><span><strong>Manual Backup</strong><small>Create a backup of your data</small></span><button type="button" onClick={() => setNotice("Manual backup completed.")}>Create Backup</button></div></div> : <div className="settings-list">{["Orders", "Customers", "Menu", "Sales Report"].map((item) => <div className="settings-action-row" key={item}><span><strong>{item}</strong><small>Export all {item.toLowerCase()} data</small></span><button type="button" onClick={() => setNotice(`${item} export prepared.`)}>Export</button></div>)}</div>}</section>;
  }

  const content = active === "profile" ? profileSection() : active === "business" ? businessSection() : active === "ordering" ? orderingSection() : active === "payments" ? paymentsSection() : active === "notifications" ? notificationsSection() : active === "devices" ? devicesSection() : active === "menu" ? menuSection() : active === "integrations" ? integrationsSection() : active === "security" ? securitySection() : dataSection();

  return <section className="settings-page"><header className="settings-heading"><div><h1>Settings</h1><p>Manage your restaurant configuration and preferences.</p></div><label><Icon name="search" /><span className="sr-only">Search settings</span><input type="search" placeholder="Search settings…" value={query} onChange={(event) => setQuery(event.target.value)} /></label></header>{notice && <p className="settings-notice" aria-live="polite">{notice}</p>}<div className="settings-workspace"><aside className="settings-sidebar" aria-label="Settings categories">{filteredSections.map((section) => <button key={section.id} type="button" className={active === section.id ? "active" : ""} onClick={() => { setActive(section.id); setQuery(""); setNotice(""); setEditing(false); }}><i><Icon name={section.icon} /></i><span><strong>{section.title}</strong><small>{section.description}</small></span><b>›</b></button>)}{!filteredSections.length && <p>No settings match your search.</p>}</aside><main className="settings-content">{content}</main></div></section>;
}

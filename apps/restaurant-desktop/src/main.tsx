import { useState } from "react";
import { createRoot } from "react-dom/client";
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { LiveOrderBoard } from "@tably/ui";
import "@tably/ui/tokens.css";
import { OrdersOverview } from "./orders-overview";
import "./style.css";

type DesktopPage = "orders" | "kitchen";

type NavigationIcon =
  | "orders"
  | "kitchen"
  | "menu"
  | "history"
  | "analytics"
  | "team"
  | "settings";

const navigation: ReadonlyArray<{
  icon: NavigationIcon;
  label: string;
  page?: DesktopPage;
}> = [
  { icon: "orders", label: "Orders", page: "orders" },
  { icon: "kitchen", label: "Kitchen", page: "kitchen" },
  { icon: "menu", label: "Menu" },
  { icon: "history", label: "Order history" },
  { icon: "analytics", label: "Analytics" },
  { icon: "team", label: "Team" },
  { icon: "settings", label: "Settings" },
];

function NavigationIcon({ name }: { name: NavigationIcon }) {
  const paths: Record<NavigationIcon, React.ReactNode> = {
    orders: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    kitchen: (
      <>
        <path d="M4 16a8 8 0 0 1 16 0" />
        <path d="M2.5 16h19M5 19h14M12 8V5" />
        <circle cx="12" cy="4" r="1" />
      </>
    ),
    menu: (
      <>
        <path d="M5 8h14l1 13H4L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    history: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 3h6v4H9zM9 11h6M9 15h6M9 19h4" />
      </>
    ),
    analytics: (
      <>
        <path d="M4 20v-6h4v6M10 20V9h4v11M16 20V4h4v16M3 20h18" />
        <path d="m4 10 5-4 4 1 6-5" />
      </>
    ),
    team: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M14 14a4.5 4.5 0 0 1 6.5 4v2" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}

function WindowControls() {
  const runWindowAction = (
    action: (appWindow: ReturnType<typeof getCurrentWindow>) => Promise<void>,
  ) => {
    if (isTauri()) void action(getCurrentWindow());
  };

  return (
    <div className="window-controls" aria-label="Window controls">
      <button
        className="window-close"
        aria-label="Close window"
        onClick={() => runWindowAction((appWindow) => appWindow.close())}
      />
      <button
        className="window-minimize"
        aria-label="Minimize window"
        onClick={() => runWindowAction((appWindow) => appWindow.minimize())}
      />
      <button
        className="window-maximize"
        aria-label="Maximize window"
        onClick={() =>
          runWindowAction((appWindow) => appWindow.toggleMaximize())
        }
      />
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState<DesktopPage>("orders");

  return (
    <main className="desktop-order-board">
      <header
        className="desktop-navigation"
        data-tauri-drag-region=""
        onDoubleClick={(event) => {
          if (event.target === event.currentTarget) {
            if (isTauri()) void getCurrentWindow().toggleMaximize();
          }
        }}
      >
        <WindowControls />
        <nav aria-label="Restaurant navigation">
          {navigation.map(({ icon, label, page }) => (
            <button
              key={label}
              className={page === activePage ? "active" : ""}
              aria-current={page === activePage ? "page" : undefined}
              aria-label={label}
              title={label}
              onClick={() => page && setActivePage(page)}
            >
              <NavigationIcon name={icon} />
            </button>
          ))}
        </nav>
        <span className="navigation-spacer" aria-hidden="true" />
      </header>
      {activePage === "orders" ? (
        <OrdersOverview />
      ) : (
        <section className="desktop-board-content">
          <header className="desktop-board-heading">
            <div>
              <p>Kitchen display</p>
              <h1>Live order feed</h1>
            </div>
            <span>Zuma Grill · Maitama branch</span>
          </header>
          <LiveOrderBoard />
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

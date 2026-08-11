import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { isTauri } from "@tauri-apps/api/core";
import { AuthFlow, BrandMark } from "@tably/ui";
import "@tably/ui/tokens.css";
import { AnalyticsDashboard } from "./analytics/analytics-dashboard";
import { OrdersOverview } from "./orders-overview";
import "./style.css";

type AppPage = "orders" | "analytics";

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
  page?: AppPage;
}> = [
  { icon: "orders", label: "Orders", page: "orders" },
  { icon: "kitchen", label: "Kitchen" },
  { icon: "menu", label: "Menu" },
  { icon: "history", label: "Order history" },
  { icon: "analytics", label: "Analytics", page: "analytics" },
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

function UserMenu({ onSignOut }: { onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div className="desktop-user-menu" ref={menuRef}>
      <button
        className="desktop-user-trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="desktop-user-avatar" aria-hidden="true">AY</span>
        <span className="desktop-user-copy">
          <strong>Amina Yusuf</strong>
          <small>Zuma Grill · Manager</small>
        </span>
        <span className="desktop-user-chevron" aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="desktop-user-dropdown" role="menu">
          <header>
            <strong>Amina Yusuf</strong>
            <span>amina@zumagrill.ng</span>
          </header>
          <button type="button" role="menuitem">Account settings</button>
          <button type="button" role="menuitem">Switch restaurant</button>
          <button type="button" role="menuitem" onClick={onSignOut}>Sign out</button>
        </div>
      )}
    </div>
  );
}

function RestaurantApp({ onSignOut }: { onSignOut: () => void }) {
  const [activePage, setActivePage] = useState<AppPage>("orders");

  return (
    <div className="desktop-order-board">
      <header className="desktop-navigation">
        <BrandMark />
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
        <UserMenu onSignOut={onSignOut} />
      </header>
      {activePage === "analytics" ? <AnalyticsDashboard /> : <OrdersOverview />}
    </div>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return authenticated ? (
    <RestaurantApp onSignOut={() => setAuthenticated(false)} />
  ) : (
    <AuthFlow
      nativeRuntime={isTauri()}
      onAuthenticated={() => setAuthenticated(true)}
    />
  );
}

createRoot(document.getElementById("root")!).render(<App />);

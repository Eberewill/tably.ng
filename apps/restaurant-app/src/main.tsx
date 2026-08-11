import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { isTauri } from "@tauri-apps/api/core";
import { AuthFlow, BrandMark } from "@tably/ui";
import "@tably/ui/tokens.css";
import { AnalyticsDashboard } from "./analytics/analytics-dashboard";
import { DashboardPage } from "./dashboard-page";
import { MenuManagement } from "./menu-management";
import { OrdersOverview } from "./orders-overview";
import { SettingsPage } from "./settings-page";
import { TableManagement } from "./table-management";
import { TeamManagement } from "./team-management";
import "./style.css";

type AppPage = "dashboard" | "kitchen" | "menu" | "tables" | "analytics" | "team" | "settings";

type NavigationIcon =
  | "dashboard"
  | "kitchen"
  | "menu"
  | "tables"
  | "analytics"
  | "team"
  | "settings"
  | "notifications"
  | "help"
  | "logout";

const navigation: ReadonlyArray<{
  icon: NavigationIcon;
  label: string;
  page?: AppPage;
}> = [
  { icon: "dashboard", label: "Dashboard", page: "dashboard" },
  { icon: "kitchen", label: "Kitchen", page: "kitchen" },
  { icon: "menu", label: "Menu", page: "menu" },
  { icon: "tables", label: "Tables", page: "tables" },
  { icon: "analytics", label: "Analytics", page: "analytics" },
  { icon: "team", label: "Team", page: "team" },
  { icon: "settings", label: "Settings", page: "settings" },
];

function NavigationIcon({ name }: { name: NavigationIcon }) {
  const paths: Record<NavigationIcon, React.ReactNode> = {
    dashboard: (
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
    tables: (
      <>
        <path d="M4 8h16v6H4zM7 14v6M17 14v6M2 11h2M20 11h2M7 8V5h10v3" />
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
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
      </>
    ),
    notifications: (
      <>
        <path d="M6 17h12l-1.5-2v-4a4.5 4.5 0 0 0-9 0v4L6 17Z" />
        <path d="M10 20h4" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.2.9-1.2 1.8M12 17h.01" />
      </>
    ),
    logout: (
      <>
        <path d="M14 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3" />
        <path d="M10 12h11M18 9l3 3-3 3" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}

function UserMenu({ onNavigate, onSignOut }: { onNavigate: (page: AppPage) => void; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function navigate(page: AppPage) {
    onNavigate(page);
    setOpen(false);
  }

  return (
    <div className="desktop-user-menu" ref={menuRef}>
      <button
        className="desktop-user-trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="desktop-user-avatar" aria-hidden="true">ZG</span>
        <span className="desktop-user-copy">
          <strong>Zuma Grill Maitama</strong>
        </span>
        <span className="desktop-user-chevron" aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="desktop-user-dropdown" role="menu">
          <button className="desktop-user-profile" type="button" role="menuitem" onClick={() => navigate("settings")}>
            <span className="desktop-user-avatar" aria-hidden="true">ZG</span>
            <span><strong>Zuma Grill Maitama</strong><small>Restaurant Owner</small></span>
            <b aria-hidden="true">›</b>
          </button>
          <div className="desktop-user-links">
            <button type="button" role="menuitem" onClick={() => navigate("settings")}><NavigationIcon name="settings" />Restaurant settings</button>
            <button type="button" role="menuitem" onClick={() => navigate("team")}><NavigationIcon name="team" />Team management</button>
            <button type="button" role="menuitem" onClick={() => navigate("settings")}><NavigationIcon name="notifications" />Notifications</button>
            <button type="button" role="menuitem" onClick={() => setOpen(false)}><NavigationIcon name="help" />Help &amp; support</button>
          </div>
          <button className="desktop-user-logout" type="button" role="menuitem" onClick={onSignOut}><NavigationIcon name="logout" />Log out</button>
        </div>
      )}
    </div>
  );
}

function RestaurantApp({ onSignOut }: { onSignOut: () => void }) {
  const [activePage, setActivePage] = useState<AppPage>("dashboard");

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
        <UserMenu onNavigate={setActivePage} onSignOut={onSignOut} />
      </header>
      {activePage === "dashboard" ? <DashboardPage onOpenKitchen={() => setActivePage("kitchen")} /> : activePage === "kitchen" ? <OrdersOverview /> : activePage === "tables" ? <TableManagement /> : activePage === "analytics" ? <AnalyticsDashboard /> : activePage === "menu" ? <MenuManagement /> : activePage === "team" ? <TeamManagement /> : <SettingsPage />}
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

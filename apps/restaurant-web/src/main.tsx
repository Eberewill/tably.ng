import { createRoot } from "react-dom/client";
import { BrandMark, LiveOrderBoard } from "@tably/ui";
import "@tably/ui/tokens.css";
import "./style.css";

const navigation = [
  "Menu management",
  "Live orders",
  "Floor plan",
  "Team",
  "Analytics",
];

function App() {
  return (
    <div className="restaurant-shell">
      <aside className="restaurant-sidebar">
        <BrandMark />
        <p>Premium management</p>
        <nav aria-label="Restaurant navigation">
          {navigation.map((item) => (
            <button
              key={item}
              className={item === "Live orders" ? "active" : ""}
            >
              {item}
            </button>
          ))}
        </nav>
        <button className="new-reservation">+ New reservation</button>
        <footer>
          <button>Settings</button>
          <button>Support</button>
        </footer>
      </aside>
      <section className="restaurant-workspace">
        <header className="restaurant-header">
          <div>
            <h1>
              <i aria-hidden="true" />
              Live order feed
            </h1>
            <p>Zuma Grill · Maitama branch</p>
          </div>
          <nav aria-label="Service areas">
            <button className="active">Main hall</button>
            <button>Patio</button>
            <button>Bar</button>
          </nav>
        </header>
        <main>
          <LiveOrderBoard />
        </main>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

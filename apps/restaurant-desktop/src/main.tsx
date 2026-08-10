import React from "react";
import { createRoot } from "react-dom/client";
import { BrandMark } from "@tably/ui";
import "@tably/ui/tokens.css";
import "./style.css";

function App() {
  return (
    <main className="desktop-shell">
      <header><BrandMark /><span>MAITAMA BRANCH</span></header>
      <h1>Restaurant operations</h1>
      <p>Desktop device services are ready to connect: printing, offline sync, and hardware integrations.</p>
      <section className="desktop-status" aria-label="Device service status">
        <article><span>Printing</span><strong>Ready to connect</strong></article>
        <article><span>Offline sync</span><strong>Standing by</strong></article>
        <article><span>Hardware</span><strong>Ready to connect</strong></article>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

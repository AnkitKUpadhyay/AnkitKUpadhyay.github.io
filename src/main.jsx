import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { currentPage, pages } from "./pages";
import "./styles.css";

async function start() {
  const view = currentPage(location.pathname);
  const { default: Page } = await pages[view].load();
  const root = document.getElementById("root");
  const app = <App view={view} Page={Page} />;
  if (root.dataset.page === view && root.hasChildNodes()) {
    hydrateRoot(root, app);
  } else {
    document.title = pages[view].title;
    createRoot(root).render(app);
  }
}
start();

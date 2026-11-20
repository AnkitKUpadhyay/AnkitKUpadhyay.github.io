import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { pages } from "./pages";

export async function renderPages() {
  return Promise.all(
    Object.entries(pages).map(async ([view, page]) => {
      const { default: Page } = await page.load();
      return { ...page, view, markup: renderToString(<App view={view} Page={Page} />) };
    }),
  );
}

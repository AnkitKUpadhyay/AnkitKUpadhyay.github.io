import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";

const site = "https://ankitkupadhyay.github.io";
const htmlShell = await readFile("dist/index.html", "utf8");
const headSlot = /<!--page-head-->[\s\S]*?<!--\/page-head-->/;
const bodySlot = '<div id="root"></div>';
if (!headSlot.test(htmlShell) || !htmlShell.includes(bodySlot)) {
  throw new Error("The HTML template is missing its page head or app root.");
}

const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: "custom",
});
function escape(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}
function renderHead(page) {
  const url = site + page.path;
  const title = escape(page.title);
  const description = escape(page.description);
  const color = ["home", "news"].includes(page.view) ? "#082d35" : "#f4f1e6";
  const image = page.image ?? "/assets/atlas/open-ocean.webp";
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<meta name="theme-color" content="${color}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${site}${image}">`,
    `<link rel="canonical" href="${url}">`,
  ].join("\n    ");
}

try {
  const { renderPages } = await server.ssrLoadModule("/src/entry-server.jsx");
  for (const page of await renderPages()) {
    const directory = path.join("dist", page.path);
    const html = htmlShell
      .replace(headSlot, () => renderHead(page))
      .replace(bodySlot, () => `<div id="root" data-page="${page.view}">${page.markup}</div>`);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), html);
    console.log("Rendered", page.path);
  }
} finally {
  await server.close();
}

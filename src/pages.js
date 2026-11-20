export const pages = {
  home: {
    path: "/",
    title: "Ankit Upadhyay · Computer vision for biodiversity",
    description:
      "Ankit Upadhyay is a computer science PhD researcher at Rensselaer Polytechnic Institute. Explore his wildlife research, publications, and field notes.",
    load: () => import("./components/HomePage"),
  },
  news: {
    image: "/assets/atlas/seagrass-shelf.webp",
    path: "/news/",
    title: "Latest news · Ankit Upadhyay",
    description: "Recent publications, conference presentations, and awards from Ankit Upadhyay.",
    load: () => import("./components/NewsSection"),
  },
  publications: {
    image: "/assets/atlas/daybreak.webp",
    path: "/publications/",
    title: "Publications · Ankit Upadhyay",
    description:
      "Papers and manuscripts on individual animal identification, wildlife behavior, multilingual AI, and evidence grounding.",
    load: () => import("./components/PublicationsSection"),
  },
  about: {
    image: "/assets/atlas/troy-map.webp",
    path: "/about/",
    title: "About & contact · Ankit Upadhyay",
    description:
      "Meet Ankit Upadhyay, a computer science PhD researcher at RPI in Troy, New York. Find his contact information, academic profiles, and CV.",
    load: () => import("./components/AboutPage"),
  },
};

export function currentPage(pathname) {
  const path = pathname.replace(/index\.html$/, "").replace(/\/$/, "") + "/";
  return Object.keys(pages).find((key) => pages[key].path === path) ?? "home";
}

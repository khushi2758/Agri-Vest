import { navbarSteps } from "./navbar";

export const exploreSteps = [
  ...navbarSteps,

  {
    target: "#search",
    content: "Search farmland.",
  },

  {
    target: "#filters",
    content: "Filter results.",
  },

  {
    target: "#farm-card",
    content: "View farmland details.",
  },
];
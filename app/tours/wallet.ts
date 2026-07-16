import { navbarSteps } from "./navbar";

export const walletSteps = [
  ...navbarSteps,

  {
    target: "#balance",
    content: "Current balance.",
  },

  {
    target: "#deposit",
    content: "Add money.",
  },

  {
    target: "#withdraw",
    content: "Withdraw funds.",
  },
];
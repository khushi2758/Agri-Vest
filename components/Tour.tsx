"use client";

import { Step } from "react-joyride";
import { usePathname } from "next/navigation";
import { useTour } from "@/app/context/TourContext";
import {Joyride} from "react-joyride";

import {
  homeSteps,
  exploreSteps,
  walletSteps,
  portfolioSteps,
} from "@/app/tours";

export default function Tour() {
  const pathname = usePathname();

  const { runTour, setRunTour } = useTour();

 let steps: Step[] = [];

  switch (pathname) {
    case "/HomePage":
      steps = homeSteps;
      break;

    case "/Explore":
      steps = exploreSteps;
      break;

    case "/Wallet":
      steps = walletSteps;
      break;

    case "/Portfolio":
      steps = portfolioSteps;
      break;

    default:
      steps = [];
  }

  return (
    <Joyride
      run={runTour}
      steps={steps}
      continuous
      showProgress
      showSkipButton
      callback={() => setRunTour(false)}
    />
  );
}
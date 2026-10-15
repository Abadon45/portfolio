import type { Metadata } from "next";
import { NightcurrentPage } from "./_components/NightcurrentPage";

export const metadata: Metadata = {
  title: "Nightcurrent | An Original Narrative Exploration",
  description:
    "Discover Tideglass Island, its abandoned weather station, and the " +
    "signal Mara Venn was sent to investigate.",
  alternates: { canonical: "/nightcurrent" },
};

export default function NightcurrentRoute() {
  return <NightcurrentPage />;
}

import type { Metadata } from "next";
import { NightcurrentPage } from "./_components/NightcurrentPage";

export const metadata: Metadata = {
  title: "Nightcurrent | Archive recovery and original rebrand study",
  description:
    "An original narrative-game web experience built from an archive recovery study, featuring layered parallax, responsive storytelling, and a documented modernization approach.",
};

export default function NightcurrentRoute() {
  return <NightcurrentPage />;
}

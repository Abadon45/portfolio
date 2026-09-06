"use client";

import type { PortfolioUser } from "../../../lib/portfolioAuth";
import { ClientHomepage } from "./ClientHomepage";
import { PortfolioShell } from "./PortfolioShell";

export function PortfolioPage({
  initialUser,
}: {
  initialUser?: PortfolioUser | null;
}) {
  return (
    <PortfolioShell initialUser={initialUser}>
      <ClientHomepage />
    </PortfolioShell>
  );
}

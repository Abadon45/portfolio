import { getCurrentPortfolioUser } from "../lib/portfolioAuth";
import { PortfolioPage } from "./components/portfolio/PortfolioPage";

export default async function Home() {
  let user: Awaited<ReturnType<typeof getCurrentPortfolioUser>> | undefined;
  try {
    user = await getCurrentPortfolioUser();
  } catch {
    user = undefined;
  }

  return <PortfolioPage initialUser={user} />;
}

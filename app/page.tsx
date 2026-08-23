import { getCurrentPortfolioUser } from "../lib/portfolioAuth";
import { PortfolioPage } from "./components/portfolio/PortfolioPage";

export default async function Home() {
  let user = null;
  try {
    user = await getCurrentPortfolioUser();
  } catch {
    user = null;
  }

  return <PortfolioPage initialUser={user} />;
}

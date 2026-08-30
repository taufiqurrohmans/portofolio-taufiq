import { getPortfolioData } from "@/lib/portfolio-data";

export async function GET() {
  const portfolio = await getPortfolioData();
  return Response.json(portfolio, {
    headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
  });
}

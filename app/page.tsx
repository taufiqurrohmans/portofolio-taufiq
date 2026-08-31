import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import { PortfolioSite } from "@/components/portfolio-site";
import { getPortfolioData } from "@/lib/portfolio-data";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPortfolioData();
  const keywords = seo.keywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  const siteUrl = safeSiteUrl(env.PUBLIC_SITE_URL);
  const ogImage = absoluteAssetUrl(seo.ogImageUrl, siteUrl);

  return {
    ...(siteUrl ? { metadataBase: siteUrl } : {}),
    title: seo.title,
    description: seo.description,
    keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      ...(siteUrl ? { url: siteUrl } : {}),
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

function safeSiteUrl(value: unknown): URL | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : undefined;
  } catch {
    return undefined;
  }
}

function absoluteAssetUrl(value: string | undefined, base: URL | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = base ? new URL(value, base) : new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export default async function Home() {
  const portfolio = await getPortfolioData();
  const publicPortfolio = {
    ...portfolio,
    projects: portfolio.projects.filter(p => p.status === "published" || !p.status)
  };
  return <PortfolioSite initialData={publicPortfolio} />;
}

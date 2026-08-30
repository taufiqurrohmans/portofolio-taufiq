import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function text(path) {
  return readFile(new URL(path, root), "utf8");
}

test("hosting manifest declares D1 and R2 bindings", async () => {
  const manifest = JSON.parse(await text(".openai/hosting.json"));
  assert.equal(manifest.d1, "DB");
  assert.equal(manifest.r2, "BUCKET");
  assert.match(manifest.project_id, /^appgprj_/);
});

test("database migrations include every CMS table and case-study column", async () => {
  const files = (await readdir(new URL("drizzle/", root))).filter((file) => file.endsWith(".sql")).sort();
  const migrations = (await Promise.all(files.map((file) => text(`drizzle/${file}`)))).join("\n");
  for (const table of ["site_content", "projects", "contact_messages", "contact_rate_limits", "media_assets", "audit_logs"]) {
    assert.match(migrations, new RegExp(`(?:CREATE TABLE|ALTER TABLE).*${table}`));
  }
  for (const column of ["problem", "solution", "dataset", "method", "evaluation", "gallery_json"]) {
    assert.match(migrations, new RegExp(column));
  }
});

test("public, admin, media, contact, and project routes exist", async () => {
  const paths = [
    "app/page.tsx",
    "app/admin/page.tsx",
    "app/projects/[slug]/page.tsx",
    "app/api/public/portfolio/route.ts",
    "app/api/contact/route.ts",
    "app/api/admin/content/route.ts",
    "app/api/admin/projects/route.ts",
    "app/api/admin/media/route.ts",
    "app/api/admin/messages/route.ts",
    "app/media/[...key]/route.ts",
  ];
  await Promise.all(paths.map((path) => access(new URL(path, root))));
});

test("asset and deployment guides contain the required practical details", async () => {
  const assetGuide = await text("docs/PANDUAN-ASET-DAN-IKON.md");
  const deployGuide = await text("docs/PANDUAN-DEPLOY.md");
  assert.match(assetGuide, /1600 × 2000 px/);
  assert.match(assetGuide, /1600 × 1000 px/);
  assert.match(assetGuide, /750 × 1624 px/);
  assert.match(assetGuide, /prefers-reduced-motion/);
  assert.match(assetGuide, /Alt text/);
  assert.match(deployGuide, /ADMIN_EMAILS/);
  assert.match(deployGuide, /npm test/);
});

test("responsive styles expose mobile navigation and single-column content", async () => {
  const css = await text("app/globals.css");
  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /\.menu-button \{ display: flex; \}/);
  assert.match(css, /\.nav-links\.is-open \{ display: flex; \}/);
  assert.match(css, /@media \(max-width: 600px\)/);
  assert.match(css, /\.skill-grid, \.project-grid \{ grid-template-columns: 1fr; \}/);
  assert.match(css, /\.project-filters button \{ min-height: 44px;/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("admin authorization fails closed and public data excludes drafts", async () => {
  const [adminAuth, portfolioData, mediaRoute] = await Promise.all([
    text("lib/admin-auth.ts"),
    text("lib/portfolio-data.ts"),
    text("app/api/admin/media/route.ts"),
  ]);
  assert.match(adminAuth, /allowlist\.length === 0/);
  assert.match(portfolioData, /project\.status === "published"/);
  assert.match(mediaRoute, /Media masih digunakan oleh konten atau proyek/);
});

test("environment example is safe and complete", async () => {
  const envExample = await text(".env.example");
  assert.match(envExample, /^ADMIN_EMAILS=your-email@example\.com$/m);
  assert.match(envExample, /^PUBLIC_SITE_URL=https:\/\/your-portfolio\.example\.com$/m);
  assert.doesNotMatch(envExample, /(?:sk-|BEGIN PRIVATE KEY|service_role)/i);
});

test("production source contains no temporary QA route or starter example", async () => {
  const productionPaths = ["app", "components", "lib"];
  const files = (await Promise.all(productionPaths.map((path) => readdir(new URL(`${path}/`, root), { recursive: true })))).flat();
  assert.equal(files.some((file) => /(?:^|\/)(?:qa|debug|harness)(?:\/|\.|$)/i.test(file)), false);
  await assert.rejects(access(new URL("examples/d1/app/api/notes/route.ts", root)));
});

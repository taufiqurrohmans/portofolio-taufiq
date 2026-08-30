import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("build emits a deployable worker, assets, and hosting metadata", async () => {
  const workerUrl = new URL("dist/server/index.js", root);
  const clientManifestUrl = new URL("dist/client/.vite/manifest.json", root);
  const hostingUrl = new URL("dist/.openai/hosting.json", root);

  await Promise.all([access(workerUrl), access(clientManifestUrl), access(hostingUrl)]);

  const workerSource = await readFile(workerUrl, "utf8");
  const clientManifest = JSON.parse(await readFile(clientManifestUrl, "utf8"));
  const hosting = JSON.parse(await readFile(hostingUrl, "utf8"));

  assert.match(workerSource, /cloudflare:workers/);
  assert.equal(hosting.d1, "DB");
  assert.equal(hosting.r2, "BUCKET");

  const manifestText = JSON.stringify(clientManifest);
  assert.match(manifestText, /portfolio-site/);
  assert.match(manifestText, /admin-dashboard/);
});

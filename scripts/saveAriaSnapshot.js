import { chromium } from "playwright";
import fs from "fs";
import path from "path";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 👉 Замініть на потрібну URL
  await page.goto(
    "https://www.google.com/search?q=rent+car&oq=rent+&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GIAEGIoFMg4IABBFGCcYOxiABBiKBTIGCAEQRRhAMgYIAhBFGDkyBggDEEUYOzIHCAQQABiABDIJCAUQABgKGIAEMgcIBhAAGIAEMgcIBxAAGIAE0gEJNTg1N2owajE1qAIAsAIA&sourceid=chrome&ie=UTF-8",
    { waitUntil: "domcontentloaded" },
  );

  const snapshot = await page.accessibility.snapshot();

  const outputDir = "./snapshots/manual";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, "example-aria-snapshot.json");
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), "utf-8");

  console.log(`✅ Snapshot saved to: ${filePath}`);
  await browser.close();
})();

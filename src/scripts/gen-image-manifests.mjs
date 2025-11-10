// scripts/gen-image-manifests.mjs
import { readdir, stat, mkdir, writeFile, rm } from "fs/promises";
import { join, extname } from "path";
import sizeOf from "image-size";
import chokidar from "chokidar";

const ROOT = "public/images";
const OUT_DIR = "src/image-manifests";

// Only keep .webp as the "base" file
const VALID_EXTS = [".webp"];

async function walk(dir, baseDir) {
  const files = await readdir(dir, { withFileTypes: true });
  let list = [];

  for (const file of files) {
    const fullPath = join(dir, file.name);
    if (file.isDirectory()) {
      const sub = await walk(fullPath, baseDir);
      list = list.concat(sub);
    } else if (VALID_EXTS.includes(extname(file.name).toLowerCase())) {
      const stats = await stat(fullPath);
      let dims = {};
      try {
        dims = sizeOf(fullPath);
      } catch {
        dims = {};
      }
      // Normalize folder and path to POSIX web paths
      let folderPath = dir.replace(baseDir, "").replace(/\\/g, "/");
      if (!folderPath) folderPath = "/";
      let webPath = fullPath.replace(/\\/g, "/");
      webPath = webPath.replace(/^public/i, "");
      if (!webPath.startsWith("/")) webPath = "/" + webPath;

      list.push({
        file: file.name,
        folder: folderPath,
        path: webPath, // served URL (POSIX)
        sizeKB: Math.round(stats.size / 1024),
        width: dims.width,
        height: dims.height,
      });
    }
  }
  return list;
}

async function buildManifests() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  // Branding, studio, webpages buckets
  const staticBuckets = ["branding", "studio", "webpages"];
  for (const bucket of staticBuckets) {
    const target = join(ROOT, bucket);
    try {
      const images = await walk(target, ROOT);
      await writeFile(
        `${OUT_DIR}/${bucket}.json`,
        JSON.stringify(images, null, 2),
        "utf8"
      );
      console.log(`✓ Wrote ${bucket}.json (${images.length} images)`);
    } catch {
      console.warn(`⚠️ No folder found: ${bucket}`);
    }
  }

  // Artist subfolders
  const artistRoot = join(ROOT, "artists");
  try {
    const entries = await readdir(artistRoot, { withFileTypes: true });
    for (const d of entries) {
      if (d.isDirectory()) {
        const slug = d.name;
        const target = join(artistRoot, slug);
        const images = await walk(target, ROOT);
        await writeFile(
          `${OUT_DIR}/${slug}.json`,
          JSON.stringify(images, null, 2),
          "utf8"
        );
        console.log(`✓ Wrote ${slug}.json (${images.length} images)`);
      }
    }
  } catch {
    console.warn("⚠️ No artists folder found.");
  }
}

// Run once at startup
await buildManifests();

// If --watch is passed, keep watching
if (process.argv.includes("--watch")) {
  console.log("👀 Watching for changes in", ROOT);
  chokidar.watch(ROOT, { ignoreInitial: true }).on("all", async () => {
    console.log("🔄 Change detected, regenerating manifests...");
    await buildManifests();
  });
}

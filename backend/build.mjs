import * as esbuild from "esbuild";

import fs from "fs";
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const dbPkg = JSON.parse(fs.readFileSync("../lib/db/package.json", "utf-8"));
const externals = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(dbPkg.dependencies || {})
].filter(dep => !dep.startsWith("@workspace/"));

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outdir: "dist",
  outExtension: { ".js": ".mjs" },
  sourcemap: true,
  external: externals,
});

console.log("Backend build complete!");

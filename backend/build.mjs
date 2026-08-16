import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outdir: "dist",
  outExtension: { ".js": ".mjs" },
  sourcemap: true,
  external: ["express", "cors", "cookie-parser", "pino"],
});

console.log("Backend build complete!");

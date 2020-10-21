const { resolve } = require("path");
const fs = require("fs");
const esbuild = require("esbuild");

const env = process.argv[2] == "dev" ? "dev" : "production";
const srcPath = "src";
const publicPath = "public";
const distPath = "dist";

const buildOpts = {
  entryPoints: [resolve(srcPath, "index.tsx")],
  outfile: resolve(distPath, "index.js"),
  bundle: true,
  platform: "browser",
  sourcemap: env == "dev" ? "inline" : false,
  define: {
    "process.env.NODE_ENV": `"${env}"`,
    "process.env.GITHUB_SHA": `"${process.env["GITHUB_SHA"] || "xxxxxxxxxx"}"`,
    "process.env.BUILD_TIME": `"${Date.now().toString()}"`,
  },
  loader: {
    ".png": "file",
  },
};

// first build
esbuild.buildSync(buildOpts);
fs.readdirSync(resolve(publicPath)).forEach((path) => {
  fs.copyFileSync(resolve(publicPath, path), resolve(distPath, path));
});
if (env != "dev") {
  // remove livereload tag
  const file = resolve(distPath, "index.html");
  const raw = fs.readFileSync(file).toString();
  const cleaned = raw.replace(/\n.*livereload\.js.*\n/, "\n");
  fs.writeFileSync(file, cleaned);
}

if (env == "dev") {
  const chokidar = require("chokidar");
  const sirv = require("sirv");
  const http = require("http");
  const livereload = require("livereload");

  const { hrtime, stdout, stderr } = process;

  // watch & build
  chokidar.watch(resolve(srcPath)).on("change", async () => {
    const service = await esbuild.startService();
    try {
      stdout.write(`building...`);
      const start = hrtime();
      await service.build(buildOpts);
      const ms = (hrtime(start)[1] / 1e6).toFixed(1);
      stdout.write(`done, elapsed ${ms} ms\n`);
    } catch (e) {
      stderr.write(`[ERROR]: ${e}\n`);
    } finally {
      service.stop();
    }
  });

  // watch & serve files
  const port = 3000;
  const host = "0.0.0.0";
  const dir = resolve(distPath);
  const opts = { dev: true, single: true };

  http.createServer(sirv(dir, opts)).listen(port, host, (err) => {
    if (err) throw err;
    stdout.write(`dev server is ready on ${host}:${port}\n`);
  });

  livereload.createServer().watch(dir);
}

const { resolve } = require("path");
const fs = require("fs");
const esbuild = require("esbuild");
const postcss = require("postcss");
const tailwind = require("tailwindcss");

const env = process.argv[2] == "dev" ? "dev" : "production";
const srcPath = "src";
const publicPath = "public";
const distPath = "dist";
const cssPath = resolve(srcPath, "styles.css");
const cssOutPath = resolve(srcPath, "_index.css");

const buildOpts = {
  entryPoints: [resolve(srcPath, "index.tsx")],
  outfile: resolve(distPath, "index.js"),
  bundle: true,
  platform: "browser",
  minify: env == "production",
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

const tailwindOpts = {
  autoprefixer: true,
  future: {
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: env == "production",
    content: ["./src/**/*.tsx"],
  },
};

async function buildCSS(from, to) {
  const plugins = [tailwind(tailwindOpts)];
  const input = fs.readFileSync(from);

  const result = await postcss(plugins).process(input, { from, to });
  fs.writeFileSync(to, result.css);
}

async function lap(name, func) {
  const { hrtime, stdout } = process;
  stdout.write(`${name} building...`);
  const start = hrtime();
  await func();
  const ms = (hrtime(start)[1] / 1e6).toFixed(1);
  stdout.write(`done, elapsed ${ms} ms\n`);
}

(async () => {
  // first build
  await buildCSS(cssPath, cssOutPath);
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

    // watch & build
    chokidar.watch(resolve(srcPath)).on("change", async (path) => {
      const service = await esbuild.startService();
      try {
        if (path == cssPath) {
          await lap("css", () => buildCSS(cssPath, cssOutPath));
        } else {
          await lap("src", () => service.build(buildOpts));
        }
      } catch (e) {
        process.stderr.write(`[ERROR]: ${e}\n`);
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
})();

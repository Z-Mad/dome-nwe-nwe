import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const root = process.cwd();
const distDir = path.join(root, "dist");
const indexHtmlPath = path.join(distDir, "index.html");
const maxInitialJsKb = Number(process.env.PERF_MAX_INITIAL_JS_KB ?? 150);
const minLighthouseScore = Number(process.env.PERF_LIGHTHOUSE_MIN ?? 95);
const maxTtiMs = Number(process.env.PERF_MAX_TTI_MS ?? 1500);
const lighthouseUrl = process.env.LIGHTHOUSE_URL;

if (!fs.existsSync(indexHtmlPath)) {
  throw new Error("未找到 dist/index.html，请先执行构建。");
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");
const scriptMatches = [...indexHtml.matchAll(/<script[^>]*src="([^"]+\.js)"[^>]*>/g)];
const jsFiles = scriptMatches.map((match) => match[1].replace(/^\//, ""));

let initialJsGzipBytes = 0;
for (const file of jsFiles) {
  const absoluteFile = path.join(distDir, file);
  if (!fs.existsSync(absoluteFile)) {
    continue;
  }
  const source = fs.readFileSync(absoluteFile);
  initialJsGzipBytes += gzipSync(source).byteLength;
}

const initialJsKb = initialJsGzipBytes / 1024;
console.log(`Initial JS(gzip): ${initialJsKb.toFixed(2)} KB`);
if (initialJsKb > maxInitialJsKb) {
  throw new Error(`首屏 JS(gzip) 超预算：${initialJsKb.toFixed(2)} KB > ${maxInitialJsKb} KB`);
}

if (!lighthouseUrl) {
  console.log("未提供 LIGHTHOUSE_URL，跳过 Lighthouse/TTI 基准检查。");
  process.exit(0);
}

const chrome = await launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
const options = { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance"] };
const runnerResult = await lighthouse(lighthouseUrl, options);
await chrome.kill();

const lhr = runnerResult?.lhr;
if (!lhr) {
  throw new Error("Lighthouse 运行失败。");
}

const perfScore = Math.round((lhr.categories.performance.score || 0) * 100);
const tti = Number(lhr.audits.interactive.numericValue || 0);
console.log(`Lighthouse Performance: ${perfScore}`);
console.log(`TTI: ${tti.toFixed(0)} ms`);
console.log("FPS 基准需通过浏览器渲染轨迹采集，当前脚本未直接产出 FPS 指标。");

if (perfScore < minLighthouseScore) {
  throw new Error(`Lighthouse 分数未达标：${perfScore} < ${minLighthouseScore}`);
}

if (tti > maxTtiMs) {
  throw new Error(`TTI 未达标：${tti.toFixed(0)} ms > ${maxTtiMs} ms`);
}

// Review evidence sheets for AC-034. Run render-ac-033-manrope.mjs and
// render-ac-034-manrope.mjs first; this reads their exports.
//
// Corrected under ADR-461: labels used the shared "Manrope Cover" alias at
// weight 800, which resolved to the 200 default of the variable font. Face
// selection now comes from cover-fonts.mjs.
//
// Extended under ADR-462: the placement sheet now shows the real 400px and 320px
// exports for both covers, unscaled, on the light and dark page backgrounds, so
// the fitted headline sizes are judged at the widths readers actually get.
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { HEADLINE, registerCoverFonts, useFace } from "./cover-fonts.mjs";

const LIGHT = "#fffdf8";
const DARK = "#171b23";

const out = resolve(import.meta.dirname, "exports");
registerCoverFonts();
await mkdir(out, { recursive: true });

const label = (ctx, text, x, y, color, size = 18) => {
  useFace(ctx, HEADLINE, size, 0);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};
const write = (canvas, file) => writeFile(resolve(out, file), canvas.toBuffer("image/png"));
const [ac033, ac034] = await Promise.all([
  loadImage(resolve(out, "ac-033-manrope-baseline.png")),
  loadImage(resolve(out, "ac-034-manrope-baseline.png")),
]);

const comparison = createCanvas(2400, 670);
const cc = comparison.getContext("2d");
cc.fillStyle = "#fff";
cc.fillRect(0, 0, 2400, 670);
cc.drawImage(ac033, 0, 40, 1200, 630);
cc.drawImage(ac034, 1200, 40, 1200, 630);
label(cc, "AC-033 Manrope master — headline 86px, fits the x=583 box", 32, 28, DARK, 24);
label(cc, "AC-034 Manrope master — headline 107px, fits the x=583 box", 1232, 28, DARK, 24);
await write(comparison, "ac-034-side-by-side.png");
await write(comparison, "ac-034-illustration-ac033-comparison.png");

const placement = createCanvas(1600, 1000);
const pc = placement.getContext("2d");
pc.fillStyle = "#e7e2d8";
pc.fillRect(0, 0, 1600, 1000);
const panel = (x, y, theme, text) => {
  pc.fillStyle = theme;
  pc.fillRect(x, y, 500, 460);
  label(pc, text, x + 20, y + 30, theme === DARK ? "#fff7df" : DARK);
  pc.drawImage(ac034, x + 20, y + 55, 460, 242);
};
panel(20, 20, LIGHT, "Article cover / light");
panel(550, 20, DARK, "Article cover / dark");
panel(1080, 20, LIGHT, "Ideas thumbnail / light");
panel(20, 520, DARK, "Ideas thumbnail / dark");
panel(550, 520, LIGHT, "Social share / light");
panel(1080, 520, DARK, "Social share / dark");
await write(placement, "ac-034-theme-placement-check.png");

// ADR-462 fit evidence: the committed 400px and 320px exports at their true
// pixel size, so nothing here is rescaled on the way into the sheet.
for (const width of [400, 320]) {
  const [small033, small034] = await Promise.all([
    loadImage(resolve(out, `ac-033-manrope-${width}.png`)),
    loadImage(resolve(out, `ac-034-manrope-${width}.png`)),
  ]);
  const height = Math.round((width * 630) / 1200);
  const pad = 28;
  const cellW = width + pad * 2;
  const cellH = height + pad + 46;
  const sheet = createCanvas(cellW * 2, cellH * 2 + 44);
  const sc = sheet.getContext("2d");
  sc.fillStyle = "#e7e2d8";
  sc.fillRect(0, 0, sheet.width, sheet.height);
  // Sized to the narrowest sheet so the caption never runs off the 320px board.
  label(sc, `Cover placement at ${width}px — AC-033 86px, AC-034 107px, both inside x=583`, pad, 30, DARK, 15);
  const cells = [
    [small033, LIGHT, `AC-033 / light / ${width}px`],
    [small034, LIGHT, `AC-034 / light / ${width}px`],
    [small033, DARK, `AC-033 / dark / ${width}px`],
    [small034, DARK, `AC-034 / dark / ${width}px`],
  ];
  cells.forEach(([image, theme, text], index) => {
    const x = (index % 2) * cellW;
    const y = 44 + Math.floor(index / 2) * cellH;
    sc.fillStyle = theme;
    sc.fillRect(x, y, cellW, cellH);
    label(sc, text, x + pad, y + 26, theme === DARK ? "#fff7df" : DARK, 15);
    sc.drawImage(image, x + pad, y + 38, width, height);
  });
  await write(sheet, `ac-034-placement-${width}.png`);
}

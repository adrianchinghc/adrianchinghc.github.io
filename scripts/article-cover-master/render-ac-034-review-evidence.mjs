// Review evidence sheets for AC-034. Run render-ac-033-manrope.mjs and
// render-ac-034-manrope.mjs first; this reads their exports.
//
// Corrected under ADR-461: labels used the shared "Manrope Cover" alias at
// weight 800, which resolved to the 200 default of the variable font. Face
// selection now comes from cover-fonts.mjs.
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { HEADLINE, registerCoverFonts, useFace } from "./cover-fonts.mjs";

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
label(cc, "AC-033 Manrope master (headline HELD: overruns the locked box)", 32, 28, "#171b23", 24);
label(cc, "AC-034 Manrope master", 1232, 28, "#171b23", 24);
await write(comparison, "ac-034-side-by-side.png");
await write(comparison, "ac-034-illustration-ac033-comparison.png");

const placement = createCanvas(1600, 1000);
const pc = placement.getContext("2d");
pc.fillStyle = "#e7e2d8";
pc.fillRect(0, 0, 1600, 1000);
const panel = (x, y, theme, text) => {
  pc.fillStyle = theme;
  pc.fillRect(x, y, 500, 460);
  label(pc, text, x + 20, y + 30, theme === "#171b23" ? "#fff7df" : "#171b23");
  pc.drawImage(ac034, x + 20, y + 55, 460, 242);
};
panel(20, 20, "#fffdf8", "Article cover / light");
panel(550, 20, "#171b23", "Article cover / dark");
panel(1080, 20, "#fffdf8", "Ideas thumbnail / light");
panel(20, 520, "#171b23", "Ideas thumbnail / dark");
panel(550, 520, "#fffdf8", "Social share / light");
panel(1080, 520, "#171b23", "Social share / dark");
await write(placement, "ac-034-theme-placement-check.png");

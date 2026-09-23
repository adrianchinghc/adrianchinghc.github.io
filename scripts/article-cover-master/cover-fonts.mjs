// Single source of truth for the article-cover type faces.
//
// scripts/assets/manrope-extrabold.ttf is misnamed: it is the Manrope *variable*
// font (fvar wght 200-800) whose default instance is ExtraLight 200. A CSS weight
// token alone does not instance it — @napi-rs/canvas returns the 200 default for
// `200`, `400`, `600` and `800` alike. The axis has to be set explicitly.
//
// The previous build also registered the headline file and the author file under
// one shared alias ("Manrope Cover"), so a request for weight 800 resolved to the
// registered 600 face. Each face now gets its own alias.
import { GlobalFonts } from "@napi-rs/canvas";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const project = resolve(import.meta.dirname, "../..");

export const HEADLINE = {
  alias: "AC Cover ExtraBold",
  file: "scripts/assets/manrope-extrabold.ttf",
  weight: 800,
  // Explicit variable-font axis. Without this the file renders ExtraLight 200.
  variationSettings: "'wght' 800",
};

export const AUTHOR = {
  alias: "AC Cover SemiBold",
  file: "scripts/assets/manrope-semibold.ttf",
  weight: 600,
  // Static wght=600 instance: it carries no fvar table, so no axis is set.
  variationSettings: "",
};

const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

/** Register both faces under distinct aliases and return their provenance. */
export const registerCoverFonts = () => {
  const faces = {};
  for (const face of [HEADLINE, AUTHOR]) {
    const path = resolve(project, face.file);
    if (!GlobalFonts.registerFromPath(path, face.alias)) {
      throw new Error(`Failed to register ${face.file} as "${face.alias}".`);
    }
    faces[face.alias] = {
      file: face.file,
      sha256: sha256(readFileSync(path)),
      registeredFamily: face.alias,
      weight: face.weight,
      variableAxes: GlobalFonts.getVariationAxes(face.alias, face.weight, 5, 0).map(axis => ({
        tag: String.fromCharCode(axis.tag >> 24, (axis.tag >> 16) & 0xff, (axis.tag >> 8) & 0xff, axis.tag & 0xff),
        min: axis.min,
        max: axis.max,
        defaultValue: axis.def,
      })),
      pinnedTo: face.variationSettings || "static instance, no axis",
    };
  }
  return faces;
};

/** Select a face on a 2D context. Always sets the axis, never inherits it. */
export const useFace = (ctx, face, sizePx, trackingPx) => {
  ctx.font = `${face.weight} ${sizePx}px "${face.alias}"`;
  ctx.fontVariationSettings = face.variationSettings;
  ctx.letterSpacing = `${trackingPx}px`;
};

/**
 * Refuse to emit a cover unless the headline face is genuinely heavier than the
 * 600 and 200 instances of the same font. This is the regression the ADR-459
 * audit caught; it now fails the build instead of shipping.
 */
export const assertHeadlineIsExtraBold = (ctx, probe = "bottleneck", sizePx = 112) => {
  const advanceWith = settings => {
    ctx.font = `${HEADLINE.weight} ${sizePx}px "${HEADLINE.alias}"`;
    ctx.fontVariationSettings = settings;
    ctx.letterSpacing = "0px";
    return +ctx.measureText(probe).width.toFixed(2);
  };
  // What the renderer will actually draw, using HEADLINE exactly as configured.
  useFace(ctx, HEADLINE, sizePx, 0);
  const asConfigured = +ctx.measureText(probe).width.toFixed(2);
  const at800 = advanceWith("'wght' 800");
  const at600 = advanceWith("'wght' 600");
  const at200 = advanceWith("'wght' 200");
  if (!(at800 > at600 && at600 > at200)) {
    throw new Error(
      `The headline alias "${HEADLINE.alias}" does not resolve to a variable Manrope face. Advances for ` +
        `"${probe}" at ${sizePx}px: 800=${at800}, 600=${at600}, 200=${at200}. Expected 800 > 600 > 200. ` +
        "Identical advances mean the alias is shared with another face, so the weight request is ignored.",
    );
  }
  if (asConfigured !== at800) {
    throw new Error(
      `The headline face is configured to render at advance ${asConfigured} for "${probe}" at ${sizePx}px, ` +
        `but ExtraBold 800 measures ${at800} (600 measures ${at600}, 200 measures ${at200}). ` +
        "The wght axis is not pinned to 800 at render time.",
    );
  }
  return { probe, sizePx, advanceAsConfigured: asConfigured, advanceAt800: at800, advanceAt600: at600, advanceAt200: at200 };
};

/** Ink extent of one rendered line, measured from pixels rather than claimed. */
export const measureInk = (createCanvas, text, face, sizePx, trackingPx, originX) => {
  const width = 1400;
  const height = Math.ceil(sizePx * 2);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  useFace(ctx, face, sizePx, trackingPx);
  ctx.fillStyle = "#fff";
  ctx.fillText(text, originX, sizePx * 1.4);
  const advance = ctx.measureText(text).width;
  const { data } = ctx.getImageData(0, 0, width, height);
  let left = Infinity;
  let right = -Infinity;
  let ink = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4] > 8) {
        ink++;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  return {
    text,
    advancePx: +advance.toFixed(2),
    advanceRightEdgeX: +(originX + advance).toFixed(2),
    inkLeftX: left,
    inkRightX: right,
    inkPixels: ink,
  };
};

export const fontSha256 = file => sha256(readFileSync(resolve(project, file)));
export { project as projectRoot };

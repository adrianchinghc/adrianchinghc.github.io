// Renders the AC-033 explanatory diagrams to standalone SVG files under
// src/assets/images/posts/. Re-run after editing the data below. Referenced
// through a plain <img>, so unlike the site's inline article SVGs of old,
// each one scales as a single opaque image (viewBox-relative type sized well
// above the 5%-of-width legibility floor) rather than as part of the page's
// live DOM and CSS. See the "Explanatory visuals" section of scripts/ARTICLES.md.
import { writeFile } from "node:fs/promises";

const INK = "#22231f", MUTED = "#5e6259", PAPER = "#fafaf7", WHITE = "#ffffff", LINE = "#d8dad1", SIGNAL = "#a53b29";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const escape = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Greedy word wrap using an average-character-width estimate, not measured
// glyphs: conservative on purpose so a wider fallback font never overflows
// its box.
function wrapLines(str, maxChars) {
  const words = str.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function text(x, y, str, { size, color = INK, weight = 400, anchor = "start" }) {
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${escape(str)}</text>`;
}

const W = 1200;
const PAD = 80;

function moneyVersusProof() {
  const PLOT = 900, YLABEL_W = 100;
  const plotLeft = PAD + YLABEL_W, plotTop = 70, plotBottom = plotTop + PLOT, plotRight = plotLeft + PLOT;
  const points = [
    { n: 1, name: "Fix the process", money: 4, proof: 4, watch: false },
    { n: 2, name: "Buy a CRM add-on", money: 4, proof: 3, watch: false },
    { n: 3, name: "Automate with AI", money: 5, proof: 3, watch: false },
    { n: 4, name: "Build custom", money: 5, proof: 2, watch: true },
    { n: 5, name: "Do nothing", money: 0, proof: 5, watch: false },
  ];
  const px = proof => plotLeft + (proof / 5) * PLOT;
  const py = money => plotBottom - (money / 5) * PLOT;

  let gridLines = "";
  for (let i = 0; i <= 5; i++) {
    const x = plotLeft + (i / 5) * PLOT, y = plotTop + (i / 5) * PLOT;
    gridLines += `<line x1="${x}" y1="${plotTop}" x2="${x}" y2="${plotBottom}" stroke="${LINE}" stroke-width="2"/>`;
    gridLines += `<line x1="${plotLeft}" y1="${y}" x2="${plotRight}" y2="${y}" stroke="${LINE}" stroke-width="2"/>`;
  }
  const zoneW = PLOT * 0.4, zoneH = PLOT * 0.4;

  let body = "";
  body += `<rect x="${plotLeft}" y="${plotTop}" width="${zoneW}" height="${zoneH}" fill="${SIGNAL}" opacity="0.09"/>`;
  body += gridLines;
  body += `<rect x="${plotLeft}" y="${plotTop}" width="${PLOT}" height="${PLOT}" fill="none" stroke="${INK}" stroke-width="3"/>`;
  body += text(plotLeft + PLOT / 2, plotBottom + 60, "Proof, 0 to 5 — how much of the number is fact, not hope", { size: 34, color: MUTED, anchor: "middle" });
  body += `<text x="${PAD + YLABEL_W / 2}" y="${plotTop + PLOT / 2}" font-family="${FONT}" font-size="34" fill="${MUTED}" text-anchor="middle" transform="rotate(-90 ${PAD + YLABEL_W / 2} ${plotTop + PLOT / 2})">Money, 0 to 5</text>`;
  body += text(plotLeft - 16, plotBottom + 12, "0", { size: 28, color: MUTED, anchor: "end" });
  body += text(plotRight, plotBottom + 42, "5", { size: 28, color: MUTED, anchor: "middle" });

  for (const p of points) {
    const cx = px(p.proof), cy = py(p.money), r = 30;
    body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.watch ? SIGNAL : PAPER}" stroke="${p.watch ? SIGNAL : INK}" stroke-width="3"/>`;
    body += text(cx, cy + 10, String(p.n), { size: 30, color: p.watch ? WHITE : INK, weight: 700, anchor: "middle" });
  }

  let cursorY = plotBottom + 100;
  const keyLeft = PAD, keyWidth = W - PAD * 2, badgeD = 64, rowGap = 90;
  for (const p of points) {
    const rowTop = cursorY;
    const cy = rowTop + badgeD / 2;
    body += `<circle cx="${keyLeft + badgeD / 2}" cy="${cy}" r="${badgeD / 2 - 2}" fill="${p.watch ? SIGNAL : PAPER}" stroke="${p.watch ? SIGNAL : INK}" stroke-width="3"/>`;
    body += text(keyLeft + badgeD / 2, cy + 10, String(p.n), { size: 28, color: p.watch ? WHITE : INK, weight: 700, anchor: "middle" });
    const textLeft = keyLeft + badgeD + 28;
    body += text(textLeft, rowTop + 26, p.name, { size: 38, weight: 700 });
    body += text(textLeft, rowTop + 62, `Money ${p.money} · Proof ${p.proof}`, { size: 32, color: MUTED });
    cursorY = rowTop + rowGap;
  }

  const H = cursorY + 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Five options plotted by proof against money">
<rect width="${W}" height="${H}" fill="${PAPER}"/>
${body}
</svg>`;
}

function decisionPath() {
  const boxWidth = W - PAD * 2, badgeD = 76, boxPad = 32;
  const textWidth = boxWidth - boxPad * 2 - badgeD - 28;
  const maxChars = Math.floor(textWidth / 25.5);
  const lineHeight = 54, fontSize = 44;
  const steps = [
    "Ask where the business loses money",
    "Pull the real numbers",
    "Sort them: facts, fair guesses, unknowns",
    "Write down all five options",
    "Score every option, money against proof",
    "Choose, and write down why",
    "Run one 90-day test with a stop rule",
    "Ask six questions before you approve spend",
  ];

  let body = "";
  let cursorY = 50;
  const centerX = PAD + boxWidth / 2;

  function arrow(top, gap) {
    return `<path d="M${centerX} ${top}V${top + gap}" stroke="${LINE}" stroke-width="3"/>` +
      `<path d="M${centerX - 8} ${top + gap - 10}L${centerX} ${top + gap}L${centerX + 8} ${top + gap - 10}" fill="none" stroke="${LINE}" stroke-width="3"/>`;
  }

  for (let i = 0; i < steps.length; i++) {
    const lines = wrapLines(steps[i], maxChars);
    const boxHeight = Math.round(Math.max(badgeD + boxPad, lines.length * lineHeight + boxPad * 1.3));
    const boxTop = cursorY;

    body += `<rect x="${PAD}" y="${boxTop}" width="${boxWidth}" height="${boxHeight}" rx="14" fill="${WHITE}" stroke="${LINE}" stroke-width="3"/>`;
    const badgeCy = boxTop + boxHeight / 2;
    body += `<circle cx="${PAD + boxPad + badgeD / 2}" cy="${badgeCy}" r="${badgeD / 2 - 2}" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>`;
    body += text(PAD + boxPad + badgeD / 2, badgeCy + 10, String(i + 1), { size: 32, weight: 700, anchor: "middle" });

    const textLeft = PAD + boxPad + badgeD + 28;
    const textTop = boxTop + (boxHeight - lines.length * lineHeight) / 2 + lineHeight * 0.68;
    lines.forEach((line, li) => { body += text(textLeft, textTop + li * lineHeight, line, { size: fontSize, weight: 700 }); });

    cursorY = boxTop + boxHeight;

    if (i === 5) {
      const exitGap = 30, exitTop = cursorY + exitGap, exitTextWidth = boxWidth - boxPad * 2;
      const exitMaxChars = Math.floor(exitTextWidth / 24);
      const exitLines = [["Nothing clears the bar?", true], ...wrapLines("Stop. Say so out loud.", exitMaxChars).map(l => [l, false])];
      const exitHeight = Math.round(exitLines.length * lineHeight + boxPad * 1.3);
      body += `<rect x="${PAD}" y="${exitTop}" width="${boxWidth}" height="${exitHeight}" rx="14" fill="none" stroke="${SIGNAL}" stroke-width="3" stroke-dasharray="10 8"/>`;
      exitLines.forEach(([line, bold], li) => {
        body += text(PAD + boxPad, exitTop + boxPad + lineHeight * 0.68 + li * lineHeight, line, { size: fontSize - 2, color: SIGNAL, weight: bold ? 700 : 400 });
      });
      body += arrow(cursorY - 10, exitGap + 20);
      cursorY = exitTop + exitHeight;
    }

    if (i < steps.length - 1) {
      const gap = 46;
      body += arrow(cursorY - 10, gap + 20);
      cursorY += gap;
    } else {
      cursorY += 30;
    }
  }

  const H = cursorY + 20;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Eight steps from finding the leak to approving spend">
<rect width="${W}" height="${H}" fill="${PAPER}"/>
${body}
</svg>`;
}

await writeFile("src/assets/images/posts/ac-033-money-versus-proof.svg", moneyVersusProof());
await writeFile("src/assets/images/posts/ac-033-decision-path.svg", decisionPath());

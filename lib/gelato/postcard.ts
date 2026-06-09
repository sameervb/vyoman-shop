import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const POSTCARD_BACK_WIDTH = 1748; // A6 landscape at 300 DPI
const POSTCARD_BACK_HEIGHT = 1240;
const MESSAGE_ZONE_WIDTH = 820;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Wrap text into lines that fit within a given pixel width.
 * Uses approximate character count for the font size.
 */
function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length <= maxCharsPerLine) {
      current = (current + " " + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Generate the postcard back PNG.
 * Returns a Buffer (PNG, A6 landscape, 300 DPI = 1748 × 1240px).
 *
 * The right half contains: address box, stamp box, Vyoman logo text.
 * The left half contains: optional personal message in a clean serif-style font.
 */
export async function generatePostcardBack(
  message: string | undefined,
  photoTitle: string
): Promise<Buffer> {
  // Try to load a designed template file from public assets
  const templatePath = path.join(
    process.cwd(),
    "public",
    "postcard-back-template.png"
  );

  let baseBuffer: Buffer;

  try {
    baseBuffer = await fs.readFile(templatePath);
  } catch {
    // Template not yet designed — generate a clean blank background
    baseBuffer = await sharp({
      create: {
        width: POSTCARD_BACK_WIDTH,
        height: POSTCARD_BACK_HEIGHT,
        channels: 4,
        background: { r: 248, g: 248, b: 245, alpha: 1 }, // warm off-white
      },
    })
      .png()
      .toBuffer();
  }

  // Build SVG overlay: right half structure + optional left-half message
  const overlays: sharp.OverlayOptions[] = [];

  // Right half: structural elements (address box, stamp box, photo title, Vyoman credit)
  const rightSvg = `
    <svg width="${POSTCARD_BACK_WIDTH}" height="${POSTCARD_BACK_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <!-- Dividing line between message area and address area -->
      <line x1="${MESSAGE_ZONE_WIDTH}" y1="80" x2="${MESSAGE_ZONE_WIDTH}" y2="${POSTCARD_BACK_HEIGHT - 80}"
            stroke="#cccccc" stroke-width="2" stroke-dasharray="8,6"/>

      <!-- Stamp box: top-right -->
      <rect x="${POSTCARD_BACK_WIDTH - 280}" y="60"
            width="200" height="140"
            fill="none" stroke="#bbbbbb" stroke-width="2"/>

      <!-- Address lines: right half, below stamp -->
      <line x1="${MESSAGE_ZONE_WIDTH + 40}" y1="280" x2="${POSTCARD_BACK_WIDTH - 60}" y2="280"
            stroke="#cccccc" stroke-width="1.5"/>
      <line x1="${MESSAGE_ZONE_WIDTH + 40}" y1="360" x2="${POSTCARD_BACK_WIDTH - 60}" y2="360"
            stroke="#cccccc" stroke-width="1.5"/>
      <line x1="${MESSAGE_ZONE_WIDTH + 40}" y1="440" x2="${POSTCARD_BACK_WIDTH - 60}" y2="440"
            stroke="#cccccc" stroke-width="1.5"/>
      <line x1="${MESSAGE_ZONE_WIDTH + 40}" y1="520" x2="${POSTCARD_BACK_WIDTH - 60}" y2="520"
            stroke="#cccccc" stroke-width="1.5"/>

      <!-- Vyoman credit: bottom-left -->
      <text x="60" y="${POSTCARD_BACK_HEIGHT - 60}"
            font-family="Georgia, serif" font-size="28" fill="#999999" letter-spacing="3">
        VYOMAN
      </text>
      <text x="60" y="${POSTCARD_BACK_HEIGHT - 30}"
            font-family="Georgia, serif" font-size="20" fill="#bbbbbb">
        ${escapeXml(photoTitle)} · vyomanaerials.com
      </text>
    </svg>
  `;

  overlays.push({
    input: Buffer.from(rightSvg),
    top: 0,
    left: 0,
  });

  // Left half: personal message (if provided)
  if (message && message.trim().length > 0) {
    const lines = wrapText(message.trim(), 38); // ~38 chars per line at 32pt in 760px
    const lineHeight = 52;
    const startY = 120;

    const tspans = lines
      .map(
        (line, i) =>
          `<tspan x="60" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
      )
      .join("\n");

    const messageSvg = `
      <svg width="${MESSAGE_ZONE_WIDTH}" height="${POSTCARD_BACK_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <text x="60" y="${startY}"
              font-family="Georgia, 'Times New Roman', serif"
              font-size="32" fill="#1a1a1a" line-height="${lineHeight}">
          ${tspans}
        </text>
      </svg>
    `;

    overlays.push({
      input: Buffer.from(messageSvg),
      top: 0,
      left: 0,
    });
  }

  const result = await sharp(baseBuffer)
    .composite(overlays)
    .png()
    .toBuffer();

  return result;
}

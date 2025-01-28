import sharp from "sharp";

export interface ImageColors {
  /** Average color of non-grayscale pixels, in #rrggbb hex. */
  averageColor: string;

  /** Most common non-grayscale color, in #rrggbb hex. */
  mostCommonColor: string;
}

/**
 * Fetches an image from the given URL, decodes it with Sharp,
 * then ignores grayscale-ish or near-black/near-white pixels.
 *
 * Returns the average and most-common color from the remaining pixels, as #rrggbb.
 */
export async function getImageColorsFromURL(imageUrl: string): Promise<ImageColors> {
  try {
    // 1. Fetch the image as a buffer
    console.log(imageUrl);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Network error when fetching image: ${response.statusText}`);
    }
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // 2. Read metadata (width, height)
    const metadata = await sharp(imageBuffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error("Could not determine image dimensions.");
    }
    const { width, height } = metadata;
    const pixelCount = width * height;

    // 3. Extract raw pixel data in RGBA format
    //    rawBuffer will be a Uint8Array of length (width * height * 4)
    const rawBuffer = await sharp(imageBuffer)
      .raw()
      .toBuffer();

    let rTotal = 0,
      gTotal = 0,
      bTotal = 0;
    let validPixelCount = 0;

    // For counting how many times each color appears
    const colorMap = new Map<string, number>();

    // 4. Iterate over each pixel
    //    The format is RGBA => i, i+1, i+2 are R,G,B channels, i+3 is alpha
    for (let i = 0; i < rawBuffer.length; i += 4) {
      const r = rawBuffer[i];
      const g = rawBuffer[i + 1];
      const b = rawBuffer[i + 2];
      const a = rawBuffer[i + 3]; // alpha if needed

      // If the pixel is fully transparent, you might skip it. (Optional)
      // if (a < 10) continue;

      // Decide what qualifies as "background grayscale".
      // Example approach #1: Skip if it's "mostly" grayscale (R≈G≈B).
      // Example approach #2: Also skip if it's too close to black or white.

      if (isTooDark(r, g, b) || isTooLight(r, g, b)) {
        // skip
        continue;
      }

      // If we want to include only those "non-grayscale" pixels in stats:
      rTotal += r;
      gTotal += g;
      bTotal += b;
      validPixelCount++;

      // Count for most common color
      const colorKey = `${r},${g},${b}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) ?? 0) + 1);
    }

    // If no valid pixels remain, you can decide to handle it differently
    if (validPixelCount === 0) {
      // Fallback or throw an error
      return {
        averageColor: "#000000",
        mostCommonColor: "#000000",
      };
    }

    // 5. Calculate average color (only from non-grayscale pixels)
    const avgR = Math.round(rTotal / validPixelCount);
    const avgG = Math.round(gTotal / validPixelCount);
    const avgB = Math.round(bTotal / validPixelCount);
    const averageColor = rgbToHex(avgR, avgG, avgB);

    // 6. Determine the most common color
    let mostCommonKey = "";
    let maxCount = 0;
    
    for (const [colorKey, count] of colorMap.entries()) {
      // Parse the colorKey into RGB values
      const [r, g, b] = colorKey.split(",").map(Number);
    
      // Skip black (0,0,0) and white (255,255,255)
      if ((r === 0 && g === 0 && b === 0) || (r === 255 && g === 255 && b === 255)) {
        continue;
      }
    
      if (count > maxCount) {
        maxCount = count;
        mostCommonKey = colorKey;
      }
    }
    
    const [rC, gC, bC] = mostCommonKey.split(",").map(Number);
    const mostCommonColor = rgbToHex(rC, gC, bC);

    return {
      averageColor,
      mostCommonColor,
    };
  } catch (error) {
    console.error(`Failed to fetch or parse image at ${imageUrl}`, error);
    throw new Error(`Error in getImageColorsFromURL: ${(error as Error).message}`);
  }
}

/**
 * Returns true if r,g,b are all within `threshold` of each other.
 * Example: threshold=10 => r,g,b can differ by up to ±10 and still be "grayscale."
 */
function isGrayish(r: number, g: number, b: number, threshold = 10): boolean {
  return (
    Math.abs(r - g) < threshold &&
    Math.abs(r - b) < threshold &&
    Math.abs(g - b) < threshold
  );
}

/**
 * Returns true if (r+g+b) is below some 'dark' cutoff, e.g. 45
 * (meaning it's very close to black).
 */
function isTooDark(r: number, g: number, b: number, cutoff = 20): boolean {
  return r + g + b < cutoff;
}

/**
 * Returns true if (r+g+b) is above some 'light' cutoff, e.g. 720
 * (meaning it's very close to white).
 */
function isTooLight(r: number, g: number, b: number, cutoff = 920): boolean {
  return r + g + b > cutoff;
}

/**
 * Converts (r,g,b) in [0..255] range to a #rrggbb string.
 */
function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, val));
  const red = clamp(r).toString(16).padStart(2, "0");
  const green = clamp(g).toString(16).padStart(2, "0");
  const blue = clamp(b).toString(16).padStart(2, "0");
  return `#${red}${green}${blue}`;
}
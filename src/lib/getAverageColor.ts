// function rgbToHex(r: number, g: number, b: number): string {
//     const toHex = (c: number) => c.toString(16).padStart(2, "0");
//     return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
//   }
  
//   /**
//    * Example helper to compute average and most common colors
//    * from a remote image on the server (Node) using `canvas`.
//    */
//   async function getImageColorsFromURL(url: string) {
//     try {
//       // node-canvas can load from a remote URL if `fetch` is available
//       // For Node <=17, install `node-fetch`. For Node >=18, fetch is built-in.
//       const img = await loadImage(url);
    
//       const canvas = createCanvas(img.width, img.height);
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0);
  
//       const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height);
  
//       let totalR = 0;
//       let totalG = 0;
//       let totalB = 0;
//       const colorCount = new Map<number, number>();
  
//       for (let i = 0; i < data.length; i += 4) {
//         const r = data[i + 0];
//         const g = data[i + 1];
//         const b = data[i + 2];
//         const a = data[i + 3];
  
//         if (a === 0) continue; // skip transparent pixels
  
//         totalR += r;
//         totalG += g;
//         totalB += b;
  
//         const colorKey = (r << 16) | (g << 8) | b;
//         colorCount.set(colorKey, (colorCount.get(colorKey) ?? 0) + 1);
//       }
  
//       // How many non-transparent pixels?
//       let pixelCount = 0;
//       for (const count of colorCount.values()) {
//         pixelCount += count;
//       }
  
//       if (pixelCount === 0) {
//         return null; // All pixels are transparent or something unexpected
//       }
  
//       // Compute average color
//       const avgR = Math.round(totalR / pixelCount);
//       const avgG = Math.round(totalG / pixelCount);
//       const avgB = Math.round(totalB / pixelCount);
//       const averageColor = rgbToHex(avgR, avgG, avgB);
  
//       // Find most common color
//       let maxCount = 0;
//       let mostCommonKey = 0;
//       for (const [key, count] of colorCount) {
//         if (count > maxCount) {
//           maxCount = count;
//           mostCommonKey = key;
//         }
//       }
  
//       const mcR = (mostCommonKey >> 16) & 0xff;
//       const mcG = (mostCommonKey >> 8) & 0xff;
//       const mcB = mostCommonKey & 0xff;
//       const mostCommonColor = rgbToHex(mcR, mcG, mcB);
  
//       return {
//         averageColor,
//         mostCommonColor
//       };
//     } catch (err) {
//       console.error("Failed to load or parse image:", err);
//       return null;
//     }
//   }
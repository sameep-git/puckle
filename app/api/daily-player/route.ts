// app/api/daily-player/route.ts
import { NextResponse } from "next/server";
import sharp from "sharp";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

async function generateSilhouette(headshotUrl: string): Promise<string | null> {
  try {
    // Fetch the image
    const response = await fetch(headshotUrl);
    if (!response.ok) return null;

    const imageBuffer = await response.arrayBuffer();

    // Process image to create solid black silhouette
    const silhouetteBuffer = await sharp(Buffer.from(imageBuffer))
      .ensureAlpha() // Ensure we have an alpha channel
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = silhouetteBuffer;
    const { width, height, channels } = info;

    // Create a new buffer where non-white pixels become black
    const newData = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = channels === 4 ? data[i + 3] : 255;

      // If pixel is not white/transparent (threshold for detecting player vs background)
      const isBackground = r > 220 && g > 220 && b > 220;

      if (!isBackground && a > 100) {
        // Make it solid black
        newData[i] = 0;     // R
        newData[i + 1] = 0; // G
        newData[i + 2] = 0; // B
        newData[i + 3] = 255; // A (fully opaque)
      } else {
        // Keep background transparent/white
        newData[i] = 237;     // R (platinum color)
        newData[i + 1] = 239; // G
        newData[i + 2] = 240; // B
        newData[i + 3] = 255; // A
      }
    }

    // Convert back to PNG
    const finalBuffer = await sharp(newData, {
      raw: {
        width,
        height,
        channels,
      },
    })
      .png()
      .toBuffer();

    // Convert to base64
    const base64 = finalBuffer.toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Failed to generate silhouette:", error);
    return null;
  }
}

export async function GET() {
  try {
    const daily = await convex.action(api.daily.getDailyPlayer);

    // Generate silhouette if headshot exists
    let silhouette = null;
    if (daily?.headshot) {
      silhouette = await generateSilhouette(daily.headshot);
    }

    return NextResponse.json({
      targetPlayerId: daily.targetPlayerId,
      date: daily.date,
      silhouette: silhouette,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load players" }, { status: 500 });
  }
}
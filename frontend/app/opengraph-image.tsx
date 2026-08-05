import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Métadonnées de l'image (réutilisées par Next pour og:image:width/height)
export const alt = "Chérie Cherry — Coffee shop & concept store";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Couleurs de la DA (cf. app/globals.css)
const CREAM = "#faf6f1";
const PINK_DEEP = "#d9709c";
const GREEN = "#406440";

export default async function Image() {
  const playfair = await readFile(
    join(process.cwd(), "assets/PlayfairDisplay-Bold.woff"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: CREAM,
          fontFamily: "Playfair",
        }}
      >
        <div
          style={{
            fontSize: 128,
            color: PINK_DEEP,
            letterSpacing: -1,
          }}
        >
          Chérie Cherry
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 40,
            color: GREEN,
          }}
        >
          Coffee shop &amp; concept store
        </div>
        <div
          style={{
            marginTop: 40,
            width: 120,
            height: 4,
            background: GREEN,
            borderRadius: 2,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair",
          data: playfair,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}

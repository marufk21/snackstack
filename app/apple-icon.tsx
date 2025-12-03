import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background:
            "linear-gradient(135deg, #3B82F6 0%, #A855F7 50%, #EC4899 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          borderRadius: "25%",
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  );
}

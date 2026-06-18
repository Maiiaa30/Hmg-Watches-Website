import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HMG Watches",
    short_name: "HMG",
    description:
      "Revenda de relógios de luxo em segunda mão — peças únicas, autenticadas e prontas a usar.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F2E8",
    theme_color: "#1A1814",
    lang: "pt-PT",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/uploads/logoFinal.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}

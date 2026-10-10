import { ogSize, renderOgImage } from "@/lib/og-image";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name}, ${siteConfig.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(siteConfig.name, "Data Science Student at UC San Diego");
}

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/chat/", "/notes/", "/practice/", "/profile/", "/admin/", "/school/"],
    },
    sitemap: "https://axom.ai/sitemap.xml",
  };
}

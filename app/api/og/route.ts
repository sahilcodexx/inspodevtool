import { NextResponse } from "next/server";
import ogs from "open-graph-scraper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const domain = new URL(targetUrl).hostname.replace(/^www\./, "");
    const defaultLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    const options = {
      url: targetUrl,
      timeout: 5000,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    };

    const { result, error } = await ogs(options);

    if (!error && result) {
      // Find highest resolution / primary og:image
      let ogImage: string | null = null;
      if (result.ogImage && result.ogImage.length > 0) {
        ogImage = result.ogImage[0].url || null;
      } else if (result.twitterImage && result.twitterImage.length > 0) {
        ogImage = result.twitterImage[0].url || null;
      }

      // Handle relative URLs
      if (ogImage && ogImage.startsWith("/")) {
        const u = new URL(targetUrl);
        ogImage = u.origin + ogImage;
      }

      const description = result.ogDescription || result.twitterDescription || "";
      const title = result.ogTitle || result.twitterTitle || "";
      const logo = (result.favicon && result.favicon.startsWith("http") ? result.favicon : null) || defaultLogo;

      return NextResponse.json(
        { ogImage, description, title, logo },
        {
          headers: {
            "Cache-Control":
              "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
          },
        }
      );
    }
  } catch (err) {
    // Return graceful fallback
  }

  const domain = new URL(targetUrl).hostname.replace(/^www\./, "");
  return NextResponse.json({
    ogImage: null,
    description: "",
    logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  });
}

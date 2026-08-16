const ogs = require("open-graph-scraper");

module.exports = async ({ req, res, log, error }) => {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (!url || !/^https?:\/\//i.test(url)) {
      return res.json({ error: "A valid http or https URL is required." }, 400);
    }

    const { result, error: scraperError } = await ogs({
      url,
      timeout: 8000,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; DesignBookmarkBot/1.0)",
      },
    });

    if (scraperError || !result) {
      log(`No Open Graph metadata found for ${url}`);
      return res.json({ ogImage: "", error: "No Open Graph metadata found." });
    }

    const firstImage = (value) => Array.isArray(value) ? value[0] : value;
    const image = firstImage(result.ogImage) || firstImage(result.twitterImage);
    let ogImage = typeof image === "string" ? image : image?.url || "";
    if (ogImage.startsWith("//")) ogImage = `https:${ogImage}`;
    if (ogImage && !/^https?:\/\//i.test(ogImage)) {
      ogImage = new URL(ogImage, url).toString();
    }

    return res.json({
      ogImage,
      title: result.ogTitle || result.twitterTitle || "",
      description: result.ogDescription || result.twitterDescription || "",
    });
  } catch (err) {
    error(err);
    log("OG metadata lookup failed; client will use its fallback image.");
    return res.json({ ogImage: "" });
  }
};

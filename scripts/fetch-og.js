const fs = require("fs");
const path = require("path");
const ogs = require("open-graph-scraper");

const dataPath = path.join(__dirname, "../app/data.ts");
const rawData = fs.readFileSync(dataPath, "utf-8");

const match = rawData.match(/export const toolsData: Tool\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find toolsData in data.ts");
  process.exit(1);
}

const tools = JSON.parse(match[1]);
console.log(`Starting open-graph-scraper for ${tools.length} bookmarks...`);

async function fetchWithOgs(url) {
  try {
    const options = {
      url,
      timeout: 5000,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    };
    const { result, error } = await ogs(options);
    if (!error && result) {
      let ogUrl = null;
      if (result.ogImage && result.ogImage.length > 0) {
        ogUrl = result.ogImage[0].url;
      } else if (result.twitterImage && result.twitterImage.length > 0) {
        ogUrl = result.twitterImage[0].url;
      }

      if (ogUrl) {
        if (ogUrl.startsWith("//")) {
          ogUrl = "https:" + ogUrl;
        } else if (ogUrl.startsWith("/")) {
          const u = new URL(url);
          ogUrl = u.origin + ogUrl;
        }
        return {
          ogImage: ogUrl,
          description: result.ogDescription || result.twitterDescription || "",
          title: result.ogTitle || result.twitterTitle || "",
        };
      }
    }
  } catch (e) {
    // ignore
  }

  return {
    ogImage: `https://image.thum.io/get/width/800/crop/500/noanimate/${url}`,
    description: "",
    title: "",
  };
}

async function run() {
  const batchSize = 10;
  for (let i = 0; i < tools.length; i += batchSize) {
    const batch = tools.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (tool) => {
        const ogData = await fetchWithOgs(tool.url);
        tool.ogImage = ogData.ogImage;
        if (ogData.description && (!tool.description || tool.description.length < 15)) {
          tool.description = ogData.description;
        }
        console.log(`[OK] ${tool.name} -> ${tool.ogImage.slice(0, 60)}...`);
      })
    );
  }

  const categories = ["All", "Design & UI", "Inspiration", "Portfolios", "Useful Tools"];
  const updatedCode = `export type Tool = {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  ogImage?: string;
  logo?: string;
  iconSymbol?: string;
};

export const categoriesList = ${JSON.stringify(categories, null, 2)};

export const toolsData: Tool[] = ${JSON.stringify(tools, null, 2)};
`;

  fs.writeFileSync(dataPath, updatedCode, "utf-8");
  console.log("Successfully updated app/data.ts using open-graph-scraper!");
}

run();

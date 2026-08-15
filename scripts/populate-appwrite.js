const { Client, Databases, ID } = require("appwrite");
const fs = require("fs");

const ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
const PROJECT_ID = "6a806fa6002023f196d2";
const DATABASE_ID = "6a8073ac00388157613c";
const COLLECTION_ID = "websiteurl";

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

const databases = new Databases(client);

// Load tools from data.ts
const content = fs.readFileSync("app/data.ts", "utf8");
const match = content.match(/export const toolsData: Tool\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not parse toolsData from app/data.ts");
  process.exit(1);
}
const tools = eval(match[1]);

function getAppwriteCategory(cat) {
  const c = (cat || "").toLowerCase();
  if (c.includes("portfolio") || c.includes("personal")) return "personal";
  if (c.includes("inspiration") || c.includes("gallery")) return "blog";
  if (c.includes("news")) return "news";
  return "business";
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function seed() {
  console.log(`Seeding remaining/all ${tools.length} tools into Appwrite collection '${COLLECTION_ID}' (DB: ${DATABASE_ID})...`);
  let count = 0;
  let skipped = 0;

  for (const tool of tools) {
    try {
      const docData = {
        url: tool.url,
        title: tool.name,
        description: (tool.description || "").slice(0, 990),
        category: getAppwriteCategory(tool.category),
        createdBy: "sahilcodex",
        logo: tool.logo || "",
        ogimage: tool.ogImage || "",
      };

      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        docData
      );
      count++;
      console.log(`[${count}/${tools.length}] Uploaded: ${tool.name} (${docData.category})`);
    } catch (err) {
      if (err.message.includes("Rate limit")) {
        console.log(`Rate limit hit on '${tool.name}', waiting 2.5s...`);
        await sleep(2500);
      } else {
        console.warn(`Skipped/Failed ${tool.name}:`, err.message);
        skipped++;
      }
    }
    await sleep(400);
  }

  console.log(`\n====================================`);
  console.log(`Appwrite Seeding Finished!`);
  console.log(`Uploaded: ${count} tools`);
  console.log(`Skipped/Failed: ${skipped} tools`);
  console.log(`====================================\n`);
}

seed();

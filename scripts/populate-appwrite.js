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

console.log(`Preparing to seed ${tools.length} tools to Appwrite table '${COLLECTION_ID}' (DB: ${DATABASE_ID})...`);

async function seed() {
  let count = 0;
  let skipped = 0;

  for (const tool of tools) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          name: tool.name,
          url: tool.url,
          category: tool.category,
          description: tool.description || "",
          ogImage: tool.ogImage || "",
          logo: tool.logo || "",
        }
      );
      count++;
      console.log(`[${count}/${tools.length}] Uploaded: ${tool.name}`);
    } catch (err) {
      console.warn(`Could not upload ${tool.name}:`, err.message);
      skipped++;
    }
  }

  console.log(`Finished! Successfully uploaded: ${count}, Skipped/Failed: ${skipped}`);
}

seed();

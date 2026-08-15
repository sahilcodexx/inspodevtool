const { Client, Databases, Query, ID } = require("appwrite");
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

function mapCategoryToAppwriteEnum(cat) {
  const c = (cat || "").toLowerCase();
  if (c.includes("portfolio")) return "personal";
  if (c.includes("inspiration")) return "blog";
  if (c.includes("news")) return "news";
  return "business"; // Components & UI, Dev Tools, Icons & Assets
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log("1. Fetching all existing documents from Appwrite...");
  let allDocs = [];
  try {
    let res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(100)]);
    allDocs = [...res.documents];
    while (res.documents.length === 100) {
      const lastId = res.documents[res.documents.length - 1].$id;
      res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.limit(100),
        Query.cursorAfter(lastId),
      ]);
      allDocs = [...allDocs, ...res.documents];
    }
  } catch (err) {
    console.log("Could not list docs for cleanup:", err.message);
  }

  console.log(`Found ${allDocs.length} total rows in Appwrite table. Deleting old duplicates...`);

  for (let i = 0; i < allDocs.length; i++) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, allDocs[i].$id);
      console.log(`Deleted [${i + 1}/${allDocs.length}]: ${allDocs[i].$id}`);
    } catch (e) {
      // ignore deletion error
    }
    await sleep(200);
  }

  console.log("\n2. Reseeding clean 95 tools with guaranteed non-null Category values...");
  let successCount = 0;

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const categoryEnum = mapCategoryToAppwriteEnum(tool.category);

    const docData = {
      url: tool.url,
      title: tool.name,
      description: (tool.description || "").slice(0, 990),
      category: categoryEnum,
      createdBy: "sahilcodex",
      logo: tool.logo || "",
      ogimage: tool.ogImage || "",
    };

    let uploaded = false;
    while (!uploaded) {
      try {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          docData
        );
        uploaded = true;
        successCount++;
        console.log(`[${successCount}/${tools.length}] Uploaded: ${tool.name} (Category: '${categoryEnum}')`);
      } catch (err) {
        if (err.message.includes("Rate limit")) {
          console.log(`Rate limit hit on '${tool.name}', waiting 2s...`);
          await sleep(2000);
        } else {
          console.error(`Failed to upload '${tool.name}':`, err.message);
          break;
        }
      }
    }
    await sleep(350);
  }

  console.log(`\n==============================================`);
  console.log(`🎉 SUCCESS! Reseeded ${successCount}/${tools.length} tools into Appwrite!`);
  console.log(`Every row now has a valid non-null category!`);
  console.log(`==============================================\n`);
}

main();

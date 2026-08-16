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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  console.log("1. Fetching all existing rows from Appwrite table...");
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
    console.log("Note on listing docs:", err.message);
  }

  if (allDocs.length > 0) {
    console.log(`Deleting ${allDocs.length} old documents from Appwrite...`);
    for (let i = 0; i < allDocs.length; i++) {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, allDocs[i].$id);
        console.log(`Deleted [${i + 1}/${allDocs.length}]: ${allDocs[i].$id}`);
      } catch (e) {
        // ignore
      }
      await sleep(150);
    }
  }

  console.log("\n2. Reseeding clean 95 tools with EXACT website categories (Components & UI, Inspiration, Icons & Assets, Dev Tools, Portfolios)...");
  let count = 0;

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];

    const docData = {
      url: tool.url,
      title: tool.name,
      description: (tool.description || "").slice(0, 990),
      category: tool.category, // Exact category string (e.g. "Components & UI", "Inspiration", etc.)
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
        count++;
        console.log(`[${count}/${tools.length}] Uploaded: ${tool.name} -> category: '${tool.category}'`);
      } catch (err) {
        if (err.message.includes("Rate limit")) {
          console.log(`Rate limit hit on '${tool.name}', waiting 2.5s...`);
          await sleep(2500);
        } else {
          console.error(`Failed to upload '${tool.name}':`, err.message);
          break;
        }
      }
    }
    await sleep(350);
  }

  console.log(`\n==============================================`);
  console.log(`🎉 Complete! Successfully uploaded ${count}/${tools.length} tools into Appwrite!`);
  console.log(`Category column now contains exact category strings!`);
  console.log(`==============================================\n`);
}

run();

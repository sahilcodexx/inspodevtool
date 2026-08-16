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

function getAppwriteEnumCategory(cat) {
  const c = (cat || "").toLowerCase();
  if (c.includes("portfolio")) return "personal";
  if (c.includes("inspiration")) return "blog";
  if (c.includes("news")) return "news";
  return "business";
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  console.log("1. Fetching current rows from Appwrite table to delete...");
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
    console.log("Error listing documents:", err.message);
  }

  console.log(`Deleting ${allDocs.length} old documents from Appwrite...`);
  for (let i = 0; i < allDocs.length; i++) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, allDocs[i].$id);
      console.log(`Deleted [${i + 1}/${allDocs.length}]: ${allDocs[i].$id}`);
    } catch (e) {
      // ignore deletion errors
    }
    await sleep(150);
  }

  console.log("\n2. Uploading all 95 tools with newly updated categories...");
  let count = 0;

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    let uploaded = false;

    while (!uploaded) {
      try {
        // Try uploading with exact website category string
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          {
            url: tool.url,
            title: tool.name,
            description: (tool.description || "").slice(0, 990),
            category: tool.category,
            createdBy: "sahilcodex",
            logo: tool.logo || "",
            ogimage: tool.ogImage || "",
          }
        );
        uploaded = true;
        count++;
        console.log(`[${count}/${tools.length}] Uploaded: ${tool.name} -> '${tool.category}'`);
      } catch (err) {
        if (err.message.includes("Rate limit")) {
          console.log(`Rate limit hit on '${tool.name}', waiting 2s...`);
          await sleep(2000);
        } else if (err.message.includes("Attribute \"category\" has invalid format")) {
          // If Appwrite enforces the enum (personal, business, blog, news)
          const fallbackEnum = getAppwriteEnumCategory(tool.category);
          try {
            await databases.createDocument(
              DATABASE_ID,
              COLLECTION_ID,
              ID.unique(),
              {
                url: tool.url,
                title: tool.name,
                description: (tool.description || "").slice(0, 990),
                category: fallbackEnum,
                createdBy: "sahilcodex",
                logo: tool.logo || "",
                ogimage: tool.ogImage || "",
              }
            );
            uploaded = true;
            count++;
            console.log(`[${count}/${tools.length}] Uploaded (enum mapping '${fallbackEnum}'): ${tool.name}`);
          } catch (err2) {
            console.error(`Failed fallback for '${tool.name}':`, err2.message);
            break;
          }
        } else {
          console.error(`Failed to upload '${tool.name}':`, err.message);
          break;
        }
      }
    }
    await sleep(350);
  }

  console.log(`\n==============================================`);
  console.log(`🎉 Complete! Reseeded ${count}/${tools.length} tools into Appwrite!`);
  console.log(`==============================================\n`);
}

run();

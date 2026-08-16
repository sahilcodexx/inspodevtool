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

async function main() {
  console.log("Checking Appwrite database schema...");

  // Test creating a document with real category string
  try {
    const testDoc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        url: "https://test.schema.check",
        title: "Test Schema Check",
        description: "Checking category string attribute support",
        category: "Components & UI",
        createdBy: "sahilcodex",
        logo: "",
        ogimage: "",
      }
    );
    console.log("✓ Schema check passed! 'category' column accepts string values!");
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, testDoc.$id);
  } catch (err) {
    if (err.message.includes("Attribute \"category\" has invalid format") || err.message.includes("Unknown attribute")) {
      console.error("\n❌ Appwrite schema error:", err.message);
      console.error("\nPlease update the 'category' column in Appwrite Console:");
      console.error("1. Open Appwrite Console -> Database '6a8073ac00388157613c' -> Table 'websiteurl' -> Columns tab.");
      console.error("2. Delete the 'category' Enum column.");
      console.error("3. Click '+ Create column' -> String -> Key: 'category', Size: 255.\n");
      process.exit(1);
    }
  }

  // 1. Delete existing rows
  console.log("Cleaning up old rows...");
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
  } catch (e) {}

  for (let i = 0; i < allDocs.length; i++) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, allDocs[i].$id);
    } catch (e) {}
    await sleep(150);
  }

  // 2. Reseed
  console.log(`Uploading all ${tools.length} tools into Appwrite websiteurl table...`);
  let count = 0;

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    let uploaded = false;
    while (!uploaded) {
      try {
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
        } else {
          console.error(`Failed to upload '${tool.name}':`, err.message);
          break;
        }
      }
    }
    await sleep(350);
  }

  console.log(`\n=================================================`);
  console.log(`🎉 SUCCESS! Uploaded ${count}/${tools.length} tools into Appwrite!`);
  console.log(`=================================================\n`);
}

main();

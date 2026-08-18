const { Client, Databases, Query } = require("appwrite");

const ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
const PROJECT_ID = "6a806fa6002023f196d2";
const DATABASE_ID = "6a8073ac00388157613c";
const COLLECTION_ID = "websiteurl";

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const databases = new Databases(client);

const groups = {
  "Portfolios": ["Chanhdai", "Aditya Sharma", "ItsJay", "Atharv", "Wall of Portfolios", "Shani Tiwari"],
  "AI & Automation": ["LobeHub", "Mintplex", "Synara", "agentcn", "UX Pilot", "Beautiful.ai", "youtube backend"],
  "Resources & Learning": ["ML Systems Textbook", "Zero University", "getdesign.md", "Interfaces Magazine", "OpenAlternative", "OpenSource Together"],
  "Marketing & Business": ["Wellfound", "Cobalt", "Headroom", "Fora", "Processing Your Request"],
  "Productivity": ["SHRTCTS", "Toolfolio", "Wonder", "Javii Tools"],
  "Motion & Animation": ["animos", "MotionSites", "Rive", "EffectSoup", "Kinetics"],
  "Icons & Assets": ["Get Waves", "Gradient Easy", "ColorFlow", "Glyphcast", "Majesticons", "Loftlyy", "Dot Matrix", "serif.sh", "Shake it to Shape it", "2026 FIFA WORLD CUP BALL TRIONDA"],
  "Components & UI": ["HextaUI", "Vantora UI", "Wigggle UI", "React Bits", "shieldcn", "Shoogle (Shadcn Search)", "CollectUI", "OGFolio", "Shadway", "Rare UI", "Originkit", "shadcncraft", "unlumen UI", "Bklit UI", "KokonutUI", "NumberFlow", "ForgeGUI", "Stylokit", "Name That UI", "Marto Mads"],
  "Dev Tools": ["Stage", "Shots.so", "Recordly", "Screenshot Studio", "Theme Toggle API", "OpenAlternative", "Mockup Freak", "Ditther", "Doppio", "Vira Theme", "Custom themes/CSS styling hack..."],
  "Websites & Showcases": ["SVG Shader Lab", "TheWide", "FinalLayer", "ossium", "Archway", "Curations Supply", "TMovie", "Hanzo (copy)", "Umanmade", "404s Design", "Landing.love", "Recent Design", "Cuelume", "Sections.wtf", "WebInspoo", "Pryzm", "SEESAW", "CTA.gallery", "Admire The Web", "Plex", "Fora"],
};

const categoryByName = new Map();
for (const [category, names] of Object.entries(groups)) {
  for (const name of names) categoryByName.set(name.toLowerCase(), category);
}

function categoryFor(document) {
  const name = String(document.title || document.name || "").trim().toLowerCase();
  return categoryByName.get(name) || "General & Miscellaneous";
}

async function listAll() {
  const documents = [];
  let cursor;
  do {
    const queries = [Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries);
    documents.push(...response.documents);
    cursor = response.documents.at(-1)?.$id;
    if (response.documents.length < 100) break;
  } while (cursor);
  return documents;
}

async function main() {
  const documents = await listAll();
  const updates = documents.map((document) => ({
    id: document.$id,
    name: document.title || document.name || "Untitled",
    from: document.category || "Uncategorized",
    to: categoryFor(document),
  }));

  const counts = updates.reduce((result, item) => {
    result[item.to] = (result[item.to] || 0) + 1;
    return result;
  }, {});

  console.log(`Found ${updates.length} Appwrite tools.`);
  console.table(counts);

  if (!process.argv.includes("--apply")) {
    console.log("Preview only. Run with --apply to update Appwrite.");
    return;
  }

  let updated = 0;
  for (const item of updates) {
    if (item.from === item.to) continue;
    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, item.id, { category: item.to });
    updated += 1;
    console.log(`Updated ${item.name}: ${item.from} -> ${item.to}`);
  }
  console.log(`Updated ${updated} categories.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});

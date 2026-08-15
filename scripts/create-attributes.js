const https = require("https");

const ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
const PROJECT_ID = "6a806fa6002023f196d2";
const DATABASE_ID = "6a8073ac00388157613c";
const COLLECTION_ID = "websiteurl";

const attributes = [
  { key: "name", size: 255, required: true },
  { key: "url", size: 2048, required: true },
  { key: "category", size: 255, required: true },
  { key: "description", size: 2048, required: false },
  { key: "ogImage", size: 2048, required: false },
  { key: "logo", size: 2048, required: false },
];

function createStringAttribute(attr) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      key: attr.key,
      size: attr.size,
      required: attr.required,
    });

    const url = new URL(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/attributes/string`);

    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": PROJECT_ID,
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              console.log(`✓ Column created: '${attr.key}'`);
            } else {
              console.log(`Attribute '${attr.key}' status:`, parsed.message || body);
            }
          } catch (e) {
            console.log(`Attribute '${attr.key}' raw status:`, body);
          }
          resolve();
        });
      }
    );

    req.on("error", (err) => {
      console.error(`Error creating '${attr.key}':`, err.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log(`Creating attributes/columns for collection '${COLLECTION_ID}' in DB '${DATABASE_ID}'...`);
  for (const attr of attributes) {
    await createStringAttribute(attr);
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log("Done creating attributes! Waiting 3 seconds for Appwrite to index columns...");
  await new Promise((r) => setTimeout(r, 3000));

  // Run seeder
  require("./populate-appwrite");
}

run();

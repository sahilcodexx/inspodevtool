const fs = require("fs");

const content = fs.readFileSync("app/data.ts", "utf8");
const match = content.match(/export const toolsData: Tool\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not parse toolsData");
  process.exit(1);
}

const tools = eval(match[1]);

function mapToolCategory(cat) {
  const c = (cat || "").toLowerCase();
  if (c.includes("portfolio") || c.includes("personal")) return "Personal";
  if (c.includes("inspiration") || c.includes("gallery")) return "Blog";
  if (c.includes("news")) return "News";
  return "Business";
}

const updatedTools = tools.map((t) => ({
  ...t,
  category: mapToolCategory(t.category),
}));

const categoriesList = ["All", "Personal", "Business", "Blog", "News"];

let updatedData = content.replace(
  /export const categoriesList = \[[\s\S]*?\];/,
  "export const categoriesList = " + JSON.stringify(categoriesList, null, 2) + ";"
);
updatedData = updatedData.replace(
  /export const toolsData: Tool\[\] = \[[\s\S]*?\];/,
  "export const toolsData: Tool[] = " + JSON.stringify(updatedTools, null, 2) + ";"
);

fs.writeFileSync("app/data.ts", updatedData, "utf8");
console.log("Updated website categories to:", categoriesList);

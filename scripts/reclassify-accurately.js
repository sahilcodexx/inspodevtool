const fs = require("fs");

const content = fs.readFileSync("app/data.ts", "utf8");
const match = content.match(/export const toolsData: Tool\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not parse toolsData from app/data.ts");
  process.exit(1);
}

const tools = eval(match[1]);

function categorizeTool(tool) {
  const name = (tool.name || "").toLowerCase();
  const desc = (tool.description || "").toLowerCase();
  const url = (tool.url || "").toLowerCase();

  // 1. Portfolios
  if (
    name.includes("chanhdai") ||
    name.includes("aditya") ||
    name.includes("shani tiwari") ||
    name.includes("itsjay") ||
    name.includes("atharv") ||
    name.includes("wall of portfolios") ||
    desc.includes("portfolio") ||
    desc.includes("full-stack developer") ||
    desc.includes("personal site")
  ) {
    return "Portfolios";
  }

  // 2. Icons & Assets
  if (
    name.includes("icon") ||
    name.includes("majesticons") ||
    name.includes("get waves") ||
    name.includes("gradient") ||
    name.includes("colorflow") ||
    name.includes("glyph") ||
    name.includes("loftlyy") ||
    name.includes("font") ||
    desc.includes("icon") ||
    desc.includes("svg wave") ||
    desc.includes("gradient") ||
    desc.includes("font")
  ) {
    return "Icons & Assets";
  }

  // 3. Components & UI
  if (
    name.includes("react bits") ||
    name.includes("ui") ||
    name.includes("component") ||
    name.includes("shadcn") ||
    name.includes("shieldcn") ||
    name.includes("shoogle") ||
    name.includes("kokonut") ||
    name.includes("hexta") ||
    name.includes("vantora") ||
    name.includes("wigggle") ||
    name.includes("javii") ||
    name.includes("stylokit") ||
    name.includes("marto mads") ||
    name.includes("kinetics") ||
    desc.includes("component") ||
    desc.includes("ui kit") ||
    desc.includes("library") ||
    desc.includes("framer template")
  ) {
    return "Components & UI";
  }

  // 4. Dev Tools
  if (
    name.includes("shots.so") ||
    name.includes("screenshot") ||
    name.includes("mockup") ||
    name.includes("morflax") ||
    name.includes("ux pilot") ||
    name.includes("beautiful.ai") ||
    name.includes("stage") ||
    name.includes("obeHub") ||
    name.includes("shrtcts") ||
    name.includes("ditther") ||
    name.includes("doppio") ||
    name.includes("forgegui") ||
    name.includes("vira") ||
    name.includes("recordly") ||
    name.includes("theme toggle") ||
    desc.includes("generator") ||
    desc.includes("tool") ||
    desc.includes("software") ||
    desc.includes("editor") ||
    desc.includes("dither") ||
    desc.includes("ai platform")
  ) {
    return "Dev Tools";
  }

  // 5. Inspiration (Default for showcases, galleries, collections, web design reviews)
  return "Inspiration";
}

const reclassifiedTools = tools.map((t) => ({
  ...t,
  category: categorizeTool(t),
}));

const categoriesList = ["All", "Components & UI", "Inspiration", "Icons & Assets", "Dev Tools", "Portfolios"];

const counts = {};
reclassifiedTools.forEach((t) => {
  counts[t.category] = (counts[t.category] || 0) + 1;
});

console.log("Accurate Reclassification Summary:");
console.log(counts);

let updatedContent = content.replace(
  /export const categoriesList = \[[\s\S]*?\];/,
  "export const categoriesList = " + JSON.stringify(categoriesList, null, 2) + ";"
);
updatedContent = updatedContent.replace(
  /export const toolsData: Tool\[\] = \[[\s\S]*?\];/,
  "export const toolsData: Tool[] = " + JSON.stringify(reclassifiedTools, null, 2) + ";"
);

fs.writeFileSync("app/data.ts", updatedContent, "utf8");
console.log("Successfully updated app/data.ts!");

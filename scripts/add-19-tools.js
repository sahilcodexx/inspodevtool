const fs = require("fs");

const newToolsList = [
  {
    name: "Javii Tools",
    url: "https://javii.tools/",
    category: "Components & UI",
    description: "chartlab — apple-style charts & visual components for web creators.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://javii.tools/"
  },
  {
    name: "ForgeGUI",
    url: "https://forgegui.com/",
    category: "Dev Tools",
    description: "ForgeGUI - The #1 AI Platform for Game Developers and UI artists.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://forgegui.com/"
  },
  {
    name: "Mockup Freak",
    url: "https://mockupfreak.com/",
    category: "Dev Tools",
    description: "Premium Phone Mockups | Upload, Preview, Download in 4K | Mockup Freak",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://mockupfreak.com/"
  },
  {
    name: "Umanmade",
    url: "https://www.umanmade.com/",
    category: "Inspiration",
    description: "Umanmade - Curated human design and digital craftsmanship showcase.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://www.umanmade.com/"
  },
  {
    name: "Ditther",
    url: "https://ditther.com/",
    category: "Dev Tools",
    description: "Ditther - Free Dither, Halftone & Pixel Effects Tool for web designers.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://ditther.com/"
  },
  {
    name: "Doppio",
    url: "https://doppio.live/",
    category: "Dev Tools",
    description: "Doppio - Create Stunning Interactive Content with Google Slides.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://doppio.live/"
  },
  {
    name: "Stylokit",
    url: "https://stylokit.com/",
    category: "Components & UI",
    description: "Stylokit - Premium Framer Templates and responsive web UI components.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://stylokit.com/"
  },
  {
    name: "UX Pilot",
    url: "https://uxpilot.ai/",
    category: "Dev Tools",
    description: "UX Pilot - Superfast UX/UI Design with AI generation and wireframing.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://uxpilot.ai/"
  },
  {
    name: "Beautiful.ai",
    url: "https://www.beautiful.ai/",
    category: "Dev Tools",
    description: "AI Presentation Software for Teams and digital product creators.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://www.beautiful.ai/"
  },
  {
    name: "Morflax Studio",
    url: "https://studio.morflax.com/",
    category: "Dev Tools",
    description: "Morflax Studio - 3D Mockups & Motion in Your Browser.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://studio.morflax.com/"
  },
  {
    name: "Admire The Web",
    url: "https://admiretheweb.com/",
    category: "Inspiration",
    description: "Admire The Web - The very best in web design inspiration.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://admiretheweb.com/"
  },
  {
    name: "Name That UI",
    url: "https://namethatui.com/",
    category: "Inspiration",
    description: "NameThatUI — What Is This UI Element Called? Visual dictionary for UI patterns.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://namethatui.com/"
  },
  {
    name: "OGFolio",
    url: "https://www.ogfolio.com/",
    category: "Inspiration",
    description: "OGFolio | Curated Library of Open Graph Images and social preview cards.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://www.ogfolio.com/"
  },
  {
    name: "Majesticons",
    url: "https://majesticons.com/",
    category: "Icons & Assets",
    description: "Majesticons — Premium SVG icon library with 11,000+ icons.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://majesticons.com/"
  },
  {
    name: "Kinetics",
    url: "https://kinetics.colorion.co/",
    category: "Components & UI",
    description: "Kinetics — Spring-physics motion for web interfaces & Framer Motion presets.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://kinetics.colorion.co/"
  },
  {
    name: "Marto Mads",
    url: "https://martomads.com/",
    category: "Components & UI",
    description: "Marto Mads — Launch your site with premium Framer templates.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://martomads.com/"
  },
  {
    name: "Vira Theme",
    url: "https://www.vira.build/",
    category: "Dev Tools",
    description: "Vira Theme — A coding experience you won’t want to leave.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://www.vira.build/"
  },
  {
    name: "SHRTCTS",
    url: "https://shrtcts.click/",
    category: "Dev Tools",
    description: "SHRTCTS — Know your developer & design application shortcuts.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://shrtcts.click/"
  },
  {
    name: "Loftlyy",
    url: "https://www.loftlyy.com/",
    category: "Icons & Assets",
    description: "Loftlyy — Discover and explore brand identities, logos, colors, and design systems.",
    ogImage: "https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://www.loftlyy.com/"
  }
];

const content = fs.readFileSync("app/data.ts", "utf8");
const match = content.match(/export const toolsData: Tool\[\] = (\[[\s\S]*?\]);/);
let existingTools = [];
if (match) {
  existingTools = eval(match[1]);
}

const existingDomains = new Set(existingTools.map(t => {
  try { return new URL(t.url).hostname.replace(/^www\./, ""); } catch(e) { return ""; }
}));

const toAdd = [];
for (const item of newToolsList) {
  const domain = new URL(item.url).hostname.replace(/^www\./, "");
  if (!existingDomains.has(domain)) {
    existingDomains.add(domain);
    toAdd.push(item);
  }
}

console.log(`Adding ${toAdd.length} new curated tools from user table!`);

const allTools = [...existingTools, ...toAdd].map((t, idx) => ({
  id: `tool-${idx + 1}`,
  name: t.name,
  url: t.url,
  category: t.category,
  description: t.description,
  ogImage: t.ogImage
}));

const categoriesList = ["All", "Components & UI", "Inspiration", "Icons & Assets", "Dev Tools", "Portfolios"];

let updatedContent = content.replace(
  /export const categoriesList = \[[\s\S]*?\];/,
  "export const categoriesList = " + JSON.stringify(categoriesList, null, 2) + ";"
);
updatedContent = updatedContent.replace(
  /export const toolsData: Tool\[\] = \[[\s\S]*?\];/,
  "export const toolsData: Tool[] = " + JSON.stringify(allTools, null, 2) + ";"
);

fs.writeFileSync("app/data.ts", updatedContent, "utf8");
console.log(`Total tools in app/data.ts is now: ${allTools.length}`);

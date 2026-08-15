const fs = require("fs");

// Extract all valid tool links provided by the user
const rawInput = `
https://60fps.design/
https://www.awwwards.com/
https://www.cosmos.so/
https://www.curated.design/
https://www.designspells.com/
https://www.gameuidatabase.com/
https://godly.website/
https://www.hudsandguis.com/
https://interfaceingame.com/
https://layers.to/explore
https://loadmo.re/
https://minimal.gallery/
https://mnmm.xyz/
https://mobbin.com/
https://www.rebrand.gallery/
https://saaspo.com/
https://same.energy/
https://searchsystem.co/
https://www.seesaw.website/
https://spiral.soot.com/spiral
https://www.supahero.io/
https://bolt.new/
https://claude.com/product/claude-code
https://cline.bot/
https://www.cursor.com/
https://openai.com/codex/
https://skills.sh/
https://v0.dev/
https://codeium.com/windsurf
https://zed.dev/agentic
https://21st.dev/
https://component.gallery/
https://cursify.vercel.app/
https://www.fancycomponents.dev/
https://framer.university/resources
https://motion-primitives.com/
https://number-flow.barvian.me/
https://www.reactbits.dev/
https://ui.shadcn.com/
https://color.review/
https://animejs.com/easing-editor
https://easings.net/
https://larsenwork.com/easing-gradients/
https://oklch.com/
https://ray.so/
https://regexr.com/
https://jakearchibald.github.io/svgomg/
https://ui.camera/
https://deskflow.org/
https://www.granola.ai/
https://localsend.org/
https://www.raycast.com/
https://www.warp.dev/
https://wisprflow.ai/
https://www.blackmagicdesign.com/products/davinciresolve
https://mifi.no/losslesscut/
https://obsproject.com/
https://opencut.app/
https://parsec.app/
https://recordly.dev/
https://screen.studio/
https://getsharex.com/
https://excalidraw.com/
https://miro.com/
https://museapp.com/
https://www.tldraw.com/
https://affine.pro/
https://www.are.na/
https://en.eagle.cool/
https://linear.app/
https://obsidian.md/
https://trello.com/
https://bestfreefonts.com/
https://fontsinuse.com/
https://www.fontshare.com/
https://www.freefaces.gallery/
https://uncut.wtf/
https://bitspace.sh/
https://cables.gl/
https://nodes.io/
https://nodetoy.co/
https://www.shadertoy.com/
https://derivative.ca/
https://www.unicorn.studio/
https://figma.com/
https://www.framer.com/
https://paper.design/
https://penpot.app/
https://rive.app/
https://cavalry.scenegroup.co/
https://jitter.video/
https://lottiefiles.com/lottie-creator
https://www.lottielab.com/
https://www.theatrejs.com/
https://elevenlabs.io/
https://www.fmod.com/
https://splice.com/features/sounds
https://www.depthkit.tv/
https://www.kiriengine.app/
https://lumalabs.ai/interactive-scenes
https://poly.cam/
https://www.unrealengine.com/en-US/realityscan
https://superspl.at/editor
https://www.bezi.com/
https://www.blender.org/
https://www.sidefx.com/
https://spline.design/
https://womp.com/
https://viewer.needle.tools/
https://www.clo3d.com/
https://www.marvelousdesigner.com/
https://chatgpt.com/
https://gemini.google.com/
https://notebooklm.google/
https://arc.net/
https://brave.com/
https://zen-browser.app/
https://makeemoji.com/
https://jmswrnr.com/?ref=designengineer.tools
https://designtools.fyi/
https://toy.studio/
https://toolfolio.com/
`;

// Extract clean domains and URLs
const lines = rawInput.split("\n").map(s => s.trim()).filter(Boolean);

function cleanUrl(raw) {
  try {
    const parsed = new URL(raw);
    // Keep root homepage or main clean path
    return `${parsed.protocol}//${parsed.hostname.replace(/^www\./, "")}/`;
  } catch (e) {
    return null;
  }
}

function getTitleFromDomain(domain) {
  const parts = domain.replace(/^www\./, "").split(".")[0];
  return parts.charAt(0).toUpperCase() + parts.slice(1);
}

function classify(urlStr, domain) {
  const u = urlStr.toLowerCase();
  const d = domain.toLowerCase();

  if (d.includes("component") || u.includes("shadcn") || d.includes("reactbits") || d.includes("fancycomponents") || d.includes("motion-primitives") || d.includes("21st")) {
    return "Components & UI";
  }
  if (d.includes("font") || d.includes("color") || d.includes("emoji") || d.includes("uncut") || d.includes("freefaces") || d.includes("oklch")) {
    return "Icons & Assets";
  }
  if (d.includes("cursor") || d.includes("warp") || d.includes("raycast") || d.includes("excalidraw") || d.includes("screen.studio") || d.includes("ray.so") || d.includes("bolt") || d.includes("v0")) {
    return "Dev Tools";
  }
  if (d.includes("jmswrnr") || u.includes("portfolio") || u.includes("me")) {
    return "Portfolios";
  }
  return "Inspiration";
}

const existingContent = fs.readFileSync("app/data.ts", "utf8");
const match = existingContent.match(/export const toolsData: Tool\[\] = (\[[\s\S]*?\]);/);
let existingTools = [];
if (match) {
  existingTools = eval(match[1]);
}

const existingDomains = new Set(existingTools.map(t => {
  try { return new URL(t.url).hostname.replace(/^www\./, ""); } catch(e) { return ""; }
}));

const newTools = [];

for (const rawUrl of lines) {
  const clean = cleanUrl(rawUrl);
  if (!clean) continue;
  
  const domain = new URL(clean).hostname.replace(/^www\./, "");
  if (existingDomains.has(domain)) continue;
  existingDomains.add(domain);

  const title = getTitleFromDomain(domain);
  const category = classify(clean, domain);

  newTools.push({
    id: `tool-${existingTools.length + newTools.length + 1}`,
    name: title,
    url: clean,
    category: category,
    description: `${title} - Curated design and development resource for design engineers.`,
    ogImage: `https://image.thum.io/get/width/1200/crop/630/auth/74032-design/https://${domain}`
  });
}

console.log(`Extracted ${newTools.length} new unique tools!`);

const allTools = [...existingTools, ...newTools].map((t, idx) => ({
  ...t,
  id: `tool-${idx + 1}`
}));

const categoriesList = ["All", "Components & UI", "Inspiration", "Icons & Assets", "Dev Tools", "Portfolios"];

let updatedData = existingContent.replace(
  /export const categoriesList = \[[\s\S]*?\];/,
  "export const categoriesList = " + JSON.stringify(categoriesList, null, 2) + ";"
);
updatedData = updatedData.replace(
  /export const toolsData: Tool\[\] = \[[\s\S]*?\];/,
  "export const toolsData: Tool[] = " + JSON.stringify(allTools, null, 2) + ";"
);

fs.writeFileSync("app/data.ts", updatedData, "utf8");
console.log(`Total tools count in app/data.ts is now: ${allTools.length}`);

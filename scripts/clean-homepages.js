const fs = require("fs");
const path = require("path");
const ogs = require("open-graph-scraper");

const dataPath = path.join(__dirname, "../app/data.ts");
const rawData = fs.readFileSync(dataPath, "utf-8");
const match = rawData.match(/export const toolsData: Tool\[\] = (\[[\s\S]*?\]);/);
const originalTools = JSON.parse(match[1]);

// Map of specific link cleanup & clean names
const domainCleanNames = {
  "wellfound.com": "Wellfound",
  "foundit.in": "foundit",
  "hextaui.com": "HextaUI",
  "vantoraui.vercel.app": "Vantora UI",
  "thewide.com": "TheWide",
  "app.thewide.com": "TheWide",
  "crichd.vip": "CricHD",
  "m.crichd.vip": "CricHD",
  "coquitts.com": "Coqui TTS",
  "kolejain.com": "Kolejain Resources",
  "shieldcn.dev": "shieldcn",
  "shoogle.dev": "Shoogle (Shadcn Search)",
  "wonder.so": "Wonder",
  "app.wonder.so": "Wonder",
  "shadway.online": "Shadway",
  "zero.university": "Zero University",
  "why.zero.university": "Zero University",
  "fora.so": "Fora",
  "plex.tv": "Plex",
  "watch.plex.tv": "Plex",
  "rive.app": "Rive",
  "fcksignups.com": "FckSignups",
  "effectsoup.com": "EffectSoup",
  "agentcn.run": "agentcn",
  "evlog.dev": "evlog",
  "openalternative.co": "OpenAlternative",
  "number-flow.barvian.me": "NumberFlow",
  "tolaria.md": "Tolaria",
  "opensource-together.com": "OpenSource Together",
  "nostalgiahits.in": "Nostalgia Hits",
  "streamcorner.vu": "StreamCorner",
  "shaders.evilrabbit.com": "SVG Shader Lab",
  "iamsajid.com": "UI Colors",
  "adityacodes.com": "Aditya Sharma",
  "headroom.com": "Headroom",
  "joincobalt.com": "Cobalt",
  "stagee.art": "Stage",
  "lobehub.com": "LobeHub",
  "getwaves.io": "Get Waves",
  "mlsysbook.ai": "ML Systems Textbook",
  "saad.works": "Saad",
  "finallayer.com": "FinalLayer",
  "shots.so": "Shots.so",
  "wigggle-ui.vercel.app": "Wigggle UI",
  "cards-dev.x.com": "X Card Validator",
  "archway.devsethi.site": "Archway",
  "vedant.works": "Vedant Lavale",
  "gradienteasy.com": "Gradient Easy",
  "curations.supply": "Curations Supply",
  "itsjay.us": "ItsJay",
  "reactbits.dev": "React Bits",
  "recordly.dev": "Recordly",
  "screenshot-studio.com": "Screenshot Studio",
  "zui.ooo": "ZUI Portfolio",
  "tmovie.in": "TMovie",
  "digital-arc.vercel.app": "DigitalArc",
  "atharv.is-a-good.dev": "Atharv",
  "compact-skill.dev": "Compact Landing",
  "cult-ui.com": "Cult UI",
  "trysynara.com": "Synara",
  "collectui.com": "CollectUI",
  "toolfolio.com": "Toolfolio",
  "shrtcts.click": "SHRTCTS",
  "umanmade.com": "Umanmade",
  "animos.app": "animos",
  "ogfolio.com": "OGFolio",
  "dotmatrix.zzzzshawn.cloud": "Dot Matrix",
  "serif.sh": "serif.sh",
  "shapes.tools": "Shake it to Shape it",
  "motionsites.ai": "MotionSites",
  "designengineer.tools": "Design Engineer Tools",
  "wallofportfolios.in": "Wall of Portfolios",
  "colorflow.ls.graphics": "ColorFlow",
  "theme-toggle.rdsx.dev": "Theme Toggle API",
  "404s.design": "404s Design",
  "landing.love": "Landing.love",
  "glyphcast.audoralabs.com": "Glyphcast",
  "shani-tiwari.framer.website": "Shani Tiwari",
  "recent.design": "Recent Design",
  "oreoui.com": "Oreo Design",
  "ripple-gl.vercel.app": "Ripple GL",
  "avatars.outpacestudios.com": "Gradient Avatars",
  "cuelume.dev": "Cuelume",
  "cuelume-site.pages.dev": "Cuelume",
  "rareui.com": "Rare UI",
  "sections.wtf": "Sections.wtf",
  "getdesign.md": "getdesign.md",
  "originkit.dev": "Originkit",
  "shadcncraft.com": "shadcncraft",
  "ui.unlumen.com": "unlumen UI",
  "interfaces.dev": "Interfaces Magazine",
  "webinspoo.com": "WebInspoo",
  "pryzm.design": "Pryzm",
  "amicro.vercel.app": "Amicro",
  "bklit.com": "Bklit UI",
  "kokonutui.com": "KokonutUI",
  "ui.flexnative.com": "Flexnative",
  "seesaw.website": "SEESAW",
  "cta.gallery": "CTA.gallery",
};

function normalizeUrl(rawUrl) {
  try {
    const u = new URL(rawUrl);
    
    // GitHub repositories -> clean repo link
    if (u.hostname === "github.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        return `https://github.com/${parts[0]}/${parts[1]}`;
      }
    }
    
    // Specific tool subdomains or root paths
    if (u.hostname === "app.thewide.com") return "https://thewide.com/";
    if (u.hostname === "app.wonder.so") return "https://wonder.so/";
    if (u.hostname === "cuelume-site.pages.dev") return "https://cuelume.dev/";
    
    // Remove query params & hash
    u.search = "";
    u.hash = "";
    
    const pathname = u.pathname.replace(/\/+$/, "");
    const keepSubpaths = ["/ui-colors", "/icons", "/components", "/docs", "/studio", "/3d-models", "/validator"];
    
    const shouldKeepPath = keepSubpaths.some(p => pathname.startsWith(p));
    
    if (!shouldKeepPath || pathname.split("/").length > 3) {
      return `${u.protocol}//${u.host}/`;
    }
    
    return `${u.protocol}//${u.host}${u.pathname}`;
  } catch {
    return rawUrl;
  }
}

const seenKeys = new Set();
const cleanedTools = [];

for (const tool of originalTools) {
  const cleanUrl = normalizeUrl(tool.url);
  const u = new URL(cleanUrl);
  const host = u.hostname.replace(/^www\./, "");
  
  // Deduplicate key by host or specific subpath
  const key = `${host}${u.pathname}`.replace(/\/+$/, "").toLowerCase();
  
  if (seenKeys.has(key) || seenKeys.has(host.toLowerCase())) {
    console.log(`[DEDUPE] Skipping duplicate: ${tool.name} -> ${cleanUrl}`);
    continue;
  }
  
  seenKeys.add(key);
  seenKeys.add(host.toLowerCase());
  
  const cleanName = domainCleanNames[host] || domainCleanNames[u.hostname] || tool.name;
  
  cleanedTools.push({
    id: `tool-${cleanedTools.length + 1}`,
    name: cleanName,
    url: cleanUrl,
    category: tool.category,
    description: tool.description && tool.description.length > 10 ? tool.description : `${cleanName} - Curated design & developer resource.`,
    ogImage: tool.ogImage
  });
}

console.log(`Deduplicated from ${originalTools.length} to ${cleanedTools.length} clean unique homepage tools!`);

async function fetchOg(url) {
  try {
    const { result, error } = await ogs({
      url,
      timeout: 4000,
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      }
    });
    if (!error && result) {
      let ogUrl = result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url;
      if (ogUrl) {
        if (ogUrl.startsWith("//")) ogUrl = "https:" + ogUrl;
        else if (ogUrl.startsWith("/")) {
          const u = new URL(url);
          ogUrl = u.origin + ogUrl;
        }
        return ogUrl;
      }
    }
  } catch (e) {}
  return `https://image.thum.io/get/width/800/crop/500/noanimate/${url}`;
}

async function run() {
  const batchSize = 10;
  for (let i = 0; i < cleanedTools.length; i += batchSize) {
    const batch = cleanedTools.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (tool) => {
        const ogImage = await fetchOg(tool.url);
        tool.ogImage = ogImage;
        console.log(`[SAVED] ${tool.name.padEnd(25)} -> ${tool.url}`);
      })
    );
  }

  const categories = ["All", "Design & UI", "Inspiration", "Portfolios", "Useful Tools"];
  const updatedCode = `export type Tool = {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  ogImage?: string;
  logo?: string;
  iconSymbol?: string;
};

export const categoriesList = ${JSON.stringify(categories, null, 2)};

export const toolsData: Tool[] = ${JSON.stringify(cleanedTools, null, 2)};
`;

  fs.writeFileSync(dataPath, updatedCode, "utf-8");
  console.log(`Successfully saved ${cleanedTools.length} clean, deduplicated homepage tools to app/data.ts!`);
}

run();

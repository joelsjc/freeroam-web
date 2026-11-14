require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const Parser = require('rss-parser');
const prisma = new PrismaClient();

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  timeout: 15000,
});

// ============ FONTES RSS ============
const RSS_SOURCES = [
  { url: "https://feeds.ign.com/ign/games-all", name: "IGN", confidence: "probable" },
  { url: "https://www.eurogamer.net/feed", name: "Eurogamer", confidence: "probable" },
  { url: "https://www.pushsquare.com/feeds/latest", name: "Push Square", confidence: "probable" },
  { url: "https://www.vg247.com/feed", name: "VG247", confidence: "probable" },
  { url: "https://www.gamesradar.com/feeds/all/", name: "GamesRadar", confidence: "probable" },
  { url: "https://www.pcgamer.com/rss/", name: "PC Gamer", confidence: "probable" },
  { url: "https://www.rockpapershotgun.com/feed", name: "Rock Paper Shotgun", confidence: "probable" },
  { url: "https://www.videogameschronicle.com/feed/", name: "VGC", confidence: "probable" },
  { url: "https://www.dexerto.com/feed/", name: "Dexerto", confidence: "probable" },
  { url: "https://gamerant.com/feed/", name: "Game Rant", confidence: "probable" },
  { url: "https://screenrant.com/feed/", name: "Screen Rant", confidence: "probable" },
  { url: "https://www.gamespot.com/feeds/game-news/", name: "GameSpot", confidence: "probable" },
  { url: "https://www.polygon.com/rss/index.xml", name: "Polygon", confidence: "probable" },
  { url: "https://www.thegamer.com/feed/", name: "The Gamer", confidence: "probable" },
];

const GOOGLE_NEWS = [
  { url: "https://news.google.com/rss/search?q=GTA+VI&hl=en-US&gl=US&ceid=US:en", name: "Google News (GTA VI)" },
  { url: "https://news.google.com/rss/search?q=GTA+6&hl=en-US&gl=US&ceid=US:en", name: "Google News (GTA 6)" },
  { url: "https://news.google.com/rss/search?q=Rockstar+Games&hl=en-US&gl=US&ceid=US:en", name: "Google News (Rockstar)" },
];

// ============ CANAIS DO YOUTUBE (IDs oficiais) ============
const YOUTUBE_CHANNELS = [
  { id: "UC2xwdcCKa-M8dFsRFkK0R7w", name: "GTA Series Videos" },
  { id: "UC2nB_RpcacZLgU9m8vNKKwQ", name: "MrBossFTW" },
  { id: "UCKy1dAqELo0zrOt1kf0eTMw", name: "IGN" },
  { id: "UCbu2SsF-Or3Rsn3NxqODImw", name: "GameSpot" },
];

function ehSobreGTA6(texto) {
  if (!texto) return false;
  const t = texto.toLowerCase();
  return t.includes("gta 6") || t.includes("gta vi") || t.includes("gta6") ||
         (t.includes("rockstar") && t.includes("gta")) ||
         t.includes("leonida") || t.includes("vice city");
}

async function coletarRSS() {
  console.log("\n🔍 Coletando RSS de sites de games...");
  for (const fonte of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(fonte.url);
      let contador = 0;
      for (const item of feed.items.slice(0, 15)) {
        const titulo = item.title || "";
        const resumo = item.contentSnippet || item.content || item.summary || "";
        if (!ehSobreGTA6(titulo + " " + resumo)) continue;
        const existe = await prisma.newsEvent.findFirst({ where: { title: titulo } });
        if (existe) continue;
        await prisma.newsEvent.create({
          data: {
            title: titulo.substring(0, 250),
            summary: resumo.substring(0, 500) || titulo,
            category: "geral",
            confidence: fonte.confidence,
            importance: "medium",
            sourceName: fonte.name,
            sourceUrl: item.link || fonte.url,
            imageUrl: item.enclosure?.url || null,
            videoUrl: null,
          },
        });
        contador++;
      }
      console.log(`✅ ${fonte.name}: ${contador} notícias novas`);
    } catch (e) {
      console.log(`⚠️  ${fonte.name}: ${e.message.substring(0, 60)}`);
    }
  }
}

async function coletarGoogleNews() {
  console.log("\n🔍 Coletando Google News...");
  for (const fonte of GOOGLE_NEWS) {
    try {
      const feed = await parser.parseURL(fonte.url);
      let contador = 0;
      for (const item of feed.items.slice(0, 15)) {
        const titulo = item.title || "";
        const resumo = item.contentSnippet || item.content || item.summary || "";
        if (!ehSobreGTA6(titulo + " " + resumo)) continue;
        const existe = await prisma.newsEvent.findFirst({ where: { title: titulo } });
        if (existe) continue;
        await prisma.newsEvent.create({
          data: {
            title: titulo.substring(0, 250),
            summary: resumo.substring(0, 500) || titulo,
            category: "geral",
            confidence: "probable",
            importance: "medium",
            sourceName: fonte.name,
            sourceUrl: item.link || fonte.url,
            imageUrl: null,
            videoUrl: null,
          },
        });
        contador++;
      }
      console.log(`✅ ${fonte.name}: ${contador} notícias novas`);
    } catch (e) {
      console.log(`⚠️  ${fonte.name}: ${e.message.substring(0, 60)}`);
    }
  }
}

async function coletarYouTube() {
  console.log("\n🔍 Coletando YouTube (API oficial)...");
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.log("⚠️  YOUTUBE_API_KEY não configurada. Pulando YouTube.");
    return;
  }

  for (const canal of YOUTUBE_CHANNELS) {
    try {
      // API oficial do YouTube Data v3
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${canal.id}&part=snippet,id&order=date&maxResults=5`;
      const res = await fetch(url);
      const json = await res.json();

      if (!json.items) {
        console.log(`⚠️  ${canal.name}: sem dados (verifique a cota da API)`);
        continue;
      }

      let contador = 0;
      for (const item of json.items) {
        if (item.id.kind !== "youtube#video") continue;
        
        const titulo = item.snippet.title.substring(0, 250);
        if (!ehSobreGTA6(titulo)) continue;

        const existe = await prisma.newsEvent.findFirst({ where: { title: titulo } });
        if (existe) continue;

        const videoId = item.id.videoId;
        const thumbUrl = item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url;

        await prisma.newsEvent.create({
          data: {
            title: titulo,
            summary: item.snippet.description.substring(0, 500) || titulo,
            category: "gameplay",
            confidence: "probable",
            importance: "medium",
            sourceName: canal.name,
            sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
            imageUrl: thumbUrl,
            videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          },
        });
        contador++;
      }
      console.log(`✅ ${canal.name}: ${contador} vídeos novos`);
    } catch (e) {
      console.log(`⚠️  ${canal.name}: ${e.message.substring(0, 60)}`);
    }
  }
}

async function main() {
  console.log("🚀 Freeroam Radar - Coletor iniciado em", new Date().toLocaleString("pt-BR"));
  await coletarRSS();
  await coletarGoogleNews();
  await coletarYouTube();
  const total = await prisma.newsEvent.count();
  console.log(`\n📊 Total de notícias no banco: ${total}`);
  console.log("✅ Coleta finalizada!\n");
}

main().catch(e => console.error("❌ Erro:", e)).finally(() => prisma.$disconnect());

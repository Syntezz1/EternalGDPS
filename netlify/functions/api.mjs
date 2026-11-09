import { getStore } from "@netlify/blobs";

const SEED = {
  cfg: {
    name: "GD Private Server",
    tag: "Свой сервер Geometry Dash: свои уровни, свой демонлист и своё сообщество.",
    discord: "", download: "", youtube: "",
    steps: "Вступи в наш Discord\nСкачай клиент игры\nЗарегистрируйся и заходи в игру",
  },
  levels: [
    { n: "Демо-уровень 1", by: "Creator1", ver: "Player1", cp: 3, likes: 120, vid: "", rec: [{ p: "Player1", pct: 100, v: "" }, { p: "Player2", pct: 64, v: "" }] },
    { n: "Демо-уровень 2", by: "Creator2", ver: "Player2", cp: 2, likes: 85, vid: "", rec: [{ p: "Player2", pct: 100, v: "" }] },
  ],
  news: [{ d: new Date().toISOString().slice(0, 10), t: "Сайт запущен", x: "Это демо-данные. Войдите в режим админа и замените их своими." }],
};

const str = (v, n) => String(v ?? "").slice(0, n);
const num = (v, lo, hi) => Math.min(hi, Math.max(lo, Number(v) || 0));

function clean(b) {
  const c = b?.cfg ?? {};
  return {
    cfg: {
      name: str(c.name, 80), tag: str(c.tag, 300), discord: str(c.discord, 300),
      download: str(c.download, 300), youtube: str(c.youtube, 300), steps: str(c.steps, 1000),
    },
    levels: (Array.isArray(b?.levels) ? b.levels : []).slice(0, 500).map((l) => ({
      n: str(l.n, 100), by: str(l.by, 60), ver: str(l.ver, 60),
      cp: num(l.cp, 0, 1000), likes: num(l.likes, 0, 1e9), vid: str(l.vid, 300),
      rec: (Array.isArray(l.rec) ? l.rec : []).slice(0, 500).map((r) => ({
        p: str(r.p, 60), pct: num(r.pct, 0, 100), v: str(r.v, 300),
      })),
    })),
    news: (Array.isArray(b?.news) ? b.news : []).slice(0, 200).map((n) => ({
      d: str(n.d, 10), t: str(n.t, 120), x: str(n.x, 4000),
    })),
  };
}

export default async (req) => {
  const store = getStore("gd-site");
  const route = new URL(req.url).pathname.replace(/^\/api\//, "");

  if (req.method === "GET" && route === "data") {
    const d = await store.get("state", { type: "json" });
    return Response.json(d || SEED, { headers: { "cache-control": "no-store" } });
  }

  if (req.method === "POST" && (route === "login" || route === "save")) {
    const pw = process.env.ADMIN_PASSWORD;
    if (!pw || req.headers.get("x-admin-password") !== pw) {
      return new Response("unauthorized", { status: 401 });
    }
    if (route === "login") return Response.json({ ok: true });
    let body;
    try { body = await req.json(); } catch { return new Response("bad json", { status: 400 }); }
    await store.setJSON("state", clean(body));
    return Response.json({ ok: true });
  }

  return new Response("not found", { status: 404 });
};

export const config = { path: "/api/*" };

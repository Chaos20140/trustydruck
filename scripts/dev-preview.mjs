// ============================================================
// Dev-Preview — Desktop + Mobile live preview with a Publish button.
// Portable: copy into any static project and adjust CONFIG below.
//   node scripts/dev-preview.mjs   →   http://127.0.0.1:4321/__preview
// Security: binds to localhost only; git runs via arg-arrays (no shell);
// static server is path-traversal safe; /__publish requires an X-Preview
// header (blocks cross-origin abuse).
// ============================================================
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CONFIG = {
  host: "127.0.0.1",
  port: 4321,
  root: ROOT,
  // pages shown in the preview dropdown (first = default)
  pages: ["index.html", "leistungen.html", "ueber-uns.html", "kontakt.html", "impressum.html", "datenschutz.html"],
  // command that regenerates the site (null to disable)
  build: { cmd: "node", args: ["build.mjs"] },
  // file changes under these dirs trigger a rebuild; others just reload
  watchDirs: ["src", "assets"],
  buildDirs: ["src"],
  // what "Publish" does, step by step (arg-arrays, __MSG__ = commit message)
  deploy: {
    steps: [
      ["node", ["build.mjs"]],
      ["git", ["add", "-A"]],
      ["git", ["commit", "-m", "__MSG__"]],
      ["git", ["push", "origin", "main"]],
    ],
    liveUrl: "https://chaos20140.github.io/trustydruck/",
    softFail: ["nothing to commit", "nichts zu committen"], // don't treat as error
  },
  title: "TRUSTYDRUCK",
};

// ---------- helpers ----------
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
  ".avif": "image/avif", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".map": "application/json",
};

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd: CONFIG.root, shell: false, ...opts });
    let out = "";
    p.stdout && p.stdout.on("data", (d) => (out += d));
    p.stderr && p.stderr.on("data", (d) => (out += d));
    p.on("error", (e) => resolve({ code: -1, out: out + "\n" + e.message }));
    p.on("close", (code) => resolve({ code, out }));
  });
}

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const rel = clean === "/" ? "index.html" : clean.replace(/^\/+/, "");
  const abs = path.resolve(CONFIG.root, rel);
  // confine to root — block traversal
  if (abs !== CONFIG.root && !abs.startsWith(CONFIG.root + path.sep)) return null;
  return abs;
}

// ---------- live reload (SSE) ----------
const clients = new Set();
function broadcast(type) {
  for (const res of clients) { try { res.write(`data: ${type}\n\n`); } catch (e) {} }
}

let building = false, pending = false, timer = null;
async function maybeBuild(needBuild) {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    if (needBuild && CONFIG.build) {
      if (building) { pending = true; return; }
      building = true;
      const r = await run(CONFIG.build.cmd, CONFIG.build.args);
      building = false;
      if (r.code !== 0) console.log("build error:\n" + r.out);
      if (pending) { pending = false; return maybeBuild(true); }
    }
    broadcast("reload");
  }, 180);
}

function startWatch() {
  for (const dir of CONFIG.watchDirs) {
    const abs = path.join(CONFIG.root, dir);
    try {
      watch(abs, { recursive: true }, (_ev, file) => {
        const needBuild = CONFIG.buildDirs.includes(dir);
        maybeBuild(needBuild);
      });
      console.log("  watching", dir + "/");
    } catch (e) { console.log("  (cannot watch " + dir + ": " + e.message + ")"); }
  }
}

// ---------- publish ----------
let publishing = false;
async function publish(message) {
  if (publishing) return { ok: false, log: "Es läuft bereits ein Publish." };
  publishing = true;
  const msg = String(message || "Update site").replace(/[\r\n]+/g, " ").slice(0, 200) || "Update site";
  let log = "";
  let ok = true;
  try {
    for (const [cmd, argsTpl] of CONFIG.deploy.steps) {
      const args = argsTpl.map((a) => (a === "__MSG__" ? msg : a));
      log += `\n$ ${cmd} ${args.join(" ")}\n`;
      const r = await run(cmd, args);
      log += r.out.trim() + "\n";
      if (r.code !== 0) {
        const soft = CONFIG.deploy.softFail.some((s) => r.out.toLowerCase().includes(s.toLowerCase()));
        if (soft) { log += "(übersprungen – nichts zu committen)\n"; continue; }
        ok = false; break;
      }
    }
  } catch (e) { ok = false; log += "\n" + e.message; }
  publishing = false;
  return { ok, log: log.trim(), liveUrl: CONFIG.deploy.liveUrl };
}

// ---------- GUI shell ----------
function shell() {
  const opts = CONFIG.pages.map((p, i) => `<option value="/${p}"${i === 0 ? " selected" : ""}>${p}</option>`).join("");
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${CONFIG.title} · Dev Preview</title><style>
:root{--bg:#0b0c10;--panel:#14161d;--line:#262a35;--ink:#e8eaf0;--dim:#8b90a0;--c:#18b6f3;--g:#22c55e}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font:14px/1.4 ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;height:100vh;display:flex;flex-direction:column;overflow:hidden}
.bar{display:flex;align-items:center;gap:14px;padding:10px 16px;background:var(--panel);border-bottom:1px solid var(--line);flex:0 0 auto}
.bar .brand{font-weight:700;letter-spacing:.02em;display:flex;align-items:center;gap:9px}
.dot{width:9px;height:9px;border-radius:50%;background:var(--g);box-shadow:0 0 8px var(--g);transition:.2s}
.dot.reloading{background:#f59e0b;box-shadow:0 0 8px #f59e0b}
.dot.off{background:#ef4444;box-shadow:none}
.bar select,.bar input,.bar button{font:inherit;color:var(--ink);background:#0e1017;border:1px solid var(--line);border-radius:8px;padding:8px 11px}
.bar .spacer{flex:1}
.bar input.msg{width:230px}
.bar button{cursor:pointer;transition:.15s}
.bar button:hover{border-color:var(--c)}
.bar .publish{background:var(--g);border-color:var(--g);color:#06210f;font-weight:700;padding:8px 18px}
.bar .publish:hover{filter:brightness(1.08)}
.bar .publish:disabled{opacity:.6;cursor:default}
.bar .ghost{background:transparent}
.stage{flex:1;display:flex;gap:16px;padding:16px;overflow:hidden;background:radial-gradient(80vw 60vh at 70% -10%,rgba(24,182,243,.06),transparent 60%)}
.pane{background:var(--panel);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.pane.desk{flex:1;min-width:0}
.pane.mob{flex:0 0 auto}
.pane .head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 13px;border-bottom:1px solid var(--line);color:var(--dim);font-size:12px;letter-spacing:.04em;text-transform:uppercase}
.pane .head select{font:inherit;color:var(--ink);background:#0e1017;border:1px solid var(--line);border-radius:7px;padding:4px 8px;font-size:12px;text-transform:none;letter-spacing:0}
.pane .body{flex:1;overflow:hidden;position:relative;background:#000}
.viewport{position:absolute;inset:0;overflow:hidden}
.viewport iframe{border:0;transform-origin:top left;background:#060609}
.mob .body{display:grid;place-items:center;padding:16px;background:#0a0b0f}
.phone{position:relative;border:9px solid #23262f;border-radius:34px;box-shadow:0 20px 50px -20px #000;overflow:hidden;background:#000}
.phone iframe{border:0;display:block;background:#060609}
.toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%) translateY(20px);background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 18px;max-width:min(90vw,640px);box-shadow:0 24px 50px -20px #000;opacity:0;pointer-events:none;transition:.3s;z-index:20}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.toast pre{white-space:pre-wrap;word-break:break-word;color:var(--dim);font:12px/1.5 ui-monospace,Menlo,monospace;max-height:34vh;overflow:auto;margin-top:8px}
.toast .t{font-weight:700}.toast.ok .t{color:var(--g)}.toast.err .t{color:#ef4444}
.toast a{color:var(--c)}
</style></head><body>
<div class="bar">
  <span class="brand"><span class="dot" id="dot"></span>${CONFIG.title} · Dev Preview</span>
  <select id="page">${opts}</select>
  <button class="ghost" id="reload" title="Neu laden">↻ Reload</button>
  <span class="spacer"></span>
  <input class="msg" id="msg" placeholder="Commit-Nachricht" value="Update site">
  <button class="publish" id="publish">▲ Publish</button>
</div>
<div class="stage">
  <div class="pane desk">
    <div class="head"><span>Desktop · 1440</span><span id="deskS"></span></div>
    <div class="body"><div class="viewport" id="deskVp"><iframe id="deskF" src="/index.html"></iframe></div></div>
  </div>
  <div class="pane mob">
    <div class="head"><span id="mobLabel">iPhone 15 Pro · 393×852</span>
      <select id="device">
        <option value="375,667">iPhone SE</option>
        <option value="390,844">iPhone 14 / 13</option>
        <option value="393,852" selected>iPhone 15 Pro</option>
        <option value="430,932">iPhone 15 Pro Max</option>
      </select>
    </div>
    <div class="body"><div class="phone" id="phone"><iframe id="mobF" width="393" height="852" src="/index.html"></iframe></div></div>
  </div>
</div>
<div class="toast" id="toast"><div class="t" id="toastT"></div><pre id="toastL"></pre></div>
<script>
const $=s=>document.querySelector(s);
const deskF=$("#deskF"),mobF=$("#mobF"),dot=$("#dot");
const DESK_W=1440;
let MOB_W=393, MOB_H=852; // default: iPhone 15 Pro
$("#device").addEventListener("change",e=>{
  const [w,h]=e.target.value.split(",").map(Number); MOB_W=w; MOB_H=h;
  mobF.width=w; mobF.height=h;
  $("#mobLabel").textContent=e.target.selectedOptions[0].textContent+" · "+w+"×"+h;
  fit();
});

function fit(){
  // desktop: scale 1440-wide iframe to fill its pane
  const vp=$("#deskVp"); const w=vp.clientWidth,h=vp.clientHeight;
  const s=w/DESK_W;
  deskF.style.width=DESK_W+"px"; deskF.style.height=(h/s)+"px"; deskF.style.transform="scale("+s+")";
  $("#deskS").textContent=Math.round(s*100)+"%";
  // mobile: scale phone to fit available height
  const body=$("#phone").parentElement; const availH=body.clientHeight-32, availW=body.clientWidth-32;
  const ms=Math.min(availH/(MOB_H), availW/(MOB_W), 1);
  const ph=$("#phone");
  ph.style.width=(MOB_W*ms)+"px"; ph.style.height=(MOB_H*ms)+"px";
  mobF.style.width=MOB_W+"px"; mobF.style.height=MOB_H+"px";
  mobF.style.transformOrigin="top left"; mobF.style.transform="scale("+ms+")";
}
addEventListener("resize",fit); setTimeout(fit,60); addEventListener("load",fit);

function setPage(p){ deskF.src=p; mobF.src=p; }
$("#page").addEventListener("change",e=>setPage(e.target.value));
$("#reload").addEventListener("click",reloadFrames);
function reloadFrames(){
  dot.classList.add("reloading");
  [deskF,mobF].forEach(f=>{ try{ f.contentWindow.location.reload(); }catch(e){ f.src=f.src; } });
  setTimeout(()=>{dot.classList.remove("reloading");fit();},400);
}

// live reload via SSE
let es;
function connect(){
  es=new EventSource("/__events");
  es.onopen=()=>dot.classList.remove("off");
  es.onmessage=e=>{ if(e.data==="reload") reloadFrames(); };
  es.onerror=()=>{ dot.classList.add("off"); es.close(); setTimeout(connect,1500); };
}
connect();

// publish
const toast=$("#toast");
function showToast(ok,title,log,live){
  toast.className="toast show "+(ok?"ok":"err");
  $("#toastT").textContent=title;
  $("#toastL").textContent=log||"";
  if(ok&&live){ const a=document.createElement("a"); a.href=live; a.target="_blank"; a.textContent="\\n→ "+live; $("#toastL").appendChild(a); }
  clearTimeout(showToast._t); showToast._t=setTimeout(()=>toast.classList.remove("show"), ok?9000:16000);
}
$("#publish").addEventListener("click",async()=>{
  const btn=$("#publish"); btn.disabled=true; const old=btn.textContent; btn.textContent="… Publishing";
  try{
    const r=await fetch("/__publish",{method:"POST",headers:{"Content-Type":"application/json","X-Preview":"1"},body:JSON.stringify({message:$("#msg").value})});
    const d=await r.json();
    showToast(d.ok, d.ok?"✓ Veröffentlicht":"✗ Publish fehlgeschlagen", d.log, d.liveUrl);
  }catch(e){ showToast(false,"✗ Fehler",String(e)); }
  btn.disabled=false; btn.textContent=old;
});
</script></body></html>`;
}

// ---------- server ----------
const server = http.createServer(async (req, res) => {
  const url = req.url || "/";

  if (url === "/__preview" || url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(shell());
  }
  if (url === "/favicon.ico") { res.writeHead(204); return res.end(); }
  if (url === "/__events") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    res.write("retry: 1500\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }
  if (url === "/__publish" && req.method === "POST") {
    if (req.headers["x-preview"] !== "1") { res.writeHead(403); return res.end("forbidden"); }
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 4096) req.destroy(); });
    req.on("end", async () => {
      let msg = "Update site";
      try { msg = JSON.parse(body).message || msg; } catch (e) {}
      const result = await publish(msg);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    });
    return;
  }
  if (url === "/__status") {
    const b = await run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    const s = await run("git", ["status", "--short"]);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ branch: b.out.trim(), dirty: s.out.trim() }));
  }

  // static
  const abs = safePath(url);
  if (!abs) { res.writeHead(400); return res.end("bad path"); }
  try {
    let target = abs;
    const st = await stat(target).catch(() => null);
    if (st && st.isDirectory()) target = path.join(target, "index.html");
    const data = await readFile(target);
    res.writeHead(200, { "Content-Type": MIME[path.extname(target).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  } catch (e) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404");
  }
});

server.listen(CONFIG.port, CONFIG.host, () => {
  const url = `http://${CONFIG.host}:${CONFIG.port}/__preview`;
  console.log(`\n  ▲ Dev-Preview läuft:  ${url}\n`);
  startWatch();
  // best-effort: open the browser (Windows)
  if (process.platform === "win32") { try { spawn("cmd", ["/c", "start", "", url], { shell: false, detached: true, stdio: "ignore" }).unref(); } catch (e) {} }
});

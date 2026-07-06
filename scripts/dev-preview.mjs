// ============================================================
// Dev-Preview — Desktop + iPhone live preview with a Publish button.
// Portable: copy into any static project and adjust CONFIG below.
//   node scripts/dev-preview.mjs   →   http://127.0.0.1:4321/__preview
// Security: binds to localhost only; git runs via arg-arrays (no shell) with
// GIT_TERMINAL_PROMPT=0 (never hangs on creds) + timeouts; static server is
// path-traversal safe; /__publish requires an X-Preview header (blocks
// cross-origin abuse).
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
  pages: ["index.html", "leistungen.html", "ueber-uns.html", "kontakt.html", "impressum.html", "datenschutz.html"],
  build: { cmd: "node", args: ["build.mjs"] },
  watchDirs: ["src", "assets"],
  buildDirs: ["src"],
  deploy: {
    steps: [
      ["node", ["build.mjs"]],
      ["git", ["add", "-A"]],
      ["git", ["commit", "-m", "__MSG__"]],
      ["git", ["push", "origin", "main"]],
    ],
    branch: "main",
    liveUrl: "https://chaos20140.github.io/trustydruck/",
    repo: "Chaos20140/trustydruck", // for GitHub-Pages build tracking (via gh); "" to disable
    softFail: ["nothing to commit", "nichts zu committen"],
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

// spawn a command (never a shell). Auto-kills after `timeout` ms so a hung
// git/credential prompt can never lock the server.
function run(cmd, args, { timeout = 120000 } = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd: CONFIG.root, shell: false, env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_ASKPASS: "" } });
    let out = "", done = false;
    const finish = (r) => { if (done) return; done = true; clearTimeout(t); resolve(r); };
    const t = setTimeout(() => { try { p.kill("SIGKILL"); } catch (e) {} finish({ code: -1, out: out + `\n[Abgebrochen nach ${Math.round(timeout / 1000)}s]` }); }, timeout);
    p.stdout && p.stdout.on("data", (d) => (out += d));
    p.stderr && p.stderr.on("data", (d) => (out += d));
    p.on("error", (e) => finish({ code: -1, out: out + "\n" + e.message }));
    p.on("close", (code) => finish({ code, out }));
  });
}

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const rel = clean === "/" ? "index.html" : clean.replace(/^\/+/, "");
  const abs = path.resolve(CONFIG.root, rel);
  if (abs !== CONFIG.root && !abs.startsWith(CONFIG.root + path.sep)) return null;
  return abs;
}

// ---------- live reload (SSE) ----------
const clients = new Set();
const broadcast = (type) => { for (const res of clients) { try { res.write(`data: ${type}\n\n`); } catch (e) {} } };

let building = false, pending = false, timer = null;
function maybeBuild(needBuild) {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    if (needBuild && CONFIG.build) {
      if (building) { pending = true; return; }
      building = true;
      const r = await run(CONFIG.build.cmd, CONFIG.build.args, { timeout: 60000 });
      building = false;
      if (r.code !== 0) console.log("build error:\n" + r.out);
      if (pending) { pending = false; return maybeBuild(true); }
    }
    broadcast("reload");
  }, 180);
}
function startWatch() {
  for (const dir of CONFIG.watchDirs) {
    try {
      watch(path.join(CONFIG.root, dir), { recursive: true }, () => maybeBuild(CONFIG.buildDirs.includes(dir)));
      console.log("  watching", dir + "/");
    } catch (e) { console.log("  (cannot watch " + dir + ": " + e.message + ")"); }
  }
}

// ---------- git status + publish ----------
async function gitStatus() {
  const [b, s, a] = await Promise.all([
    run("git", ["rev-parse", "--abbrev-ref", "HEAD"], { timeout: 15000 }),
    run("git", ["status", "--porcelain"], { timeout: 15000 }),
    run("git", ["rev-list", "--count", `origin/${CONFIG.deploy.branch}..HEAD`], { timeout: 15000 }),
  ]);
  const dirtyLines = s.out.trim() ? s.out.trim().split("\n").length : 0;
  return { branch: b.out.trim(), dirty: dirtyLines, ahead: parseInt(a.out.trim(), 10) || 0 };
}

let publishing = false;
async function publish(message) {
  if (publishing) return { ok: false, log: "Es läuft bereits ein Publish." };
  publishing = true;
  const msg = String(message || "Update site").replace(/[\r\n]+/g, " ").slice(0, 200) || "Update site";
  let log = "", ok = true, pushed = false, upToDate = false;
  try {
    for (const [cmd, argsTpl] of CONFIG.deploy.steps) {
      const args = argsTpl.map((a) => (a === "__MSG__" ? msg : a));
      log += `\n$ ${cmd} ${args.join(" ")}\n`;
      const r = await run(cmd, args, { timeout: 120000 });
      const text = (r.out || "").trim();
      log += (text || "(ok)") + "\n";
      const low = text.toLowerCase();
      if (cmd === "git" && args[0] === "push" && r.code === 0) {
        pushed = true;
        if (low.includes("up-to-date") || low.includes("up to date")) upToDate = true;
      }
      if (r.code !== 0) {
        if (CONFIG.deploy.softFail.some((s) => low.includes(s.toLowerCase()))) { log += "(übersprungen – nichts Neues)\n"; continue; }
        ok = false; break;
      }
    }
  } catch (e) { ok = false; log += "\n" + e.message; }
  let sha = "";
  if (ok) sha = (await run("git", ["rev-parse", "HEAD"], { timeout: 15000 })).out.trim();
  publishing = false;
  return { ok, log: log.trim(), liveUrl: CONFIG.deploy.liveUrl, pushed, upToDate, sha };
}

async function deployStatus() {
  if (!CONFIG.deploy.repo) return { available: false };
  const r = await run("gh", ["api", `repos/${CONFIG.deploy.repo}/pages/builds/latest`, "--jq", '.status + "|" + (.commit // "")'], { timeout: 20000 });
  if (r.code !== 0) return { available: false, error: r.out.trim().slice(0, 200) };
  const [status, commit] = (r.out || "").trim().split("|");
  return { available: true, status: status || "unknown", commit: commit || "" };
}

// ---------- GUI shell ----------
function shell() {
  const opts = CONFIG.pages.map((p, i) => `<option value="/${p}"${i === 0 ? " selected" : ""}>${p}</option>`).join("");
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${CONFIG.title} · Dev Preview</title><style>
:root{--bg:#0b0c10;--panel:#14161d;--line:#262a35;--ink:#e8eaf0;--dim:#8b90a0;--c:#18b6f3;--g:#22c55e;--warn:#f59e0b;--err:#ef4444}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font:14px/1.4 ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;height:100vh;display:flex;flex-direction:column;overflow:hidden}
.bar{display:flex;align-items:center;gap:12px;padding:10px 16px;background:var(--panel);border-bottom:1px solid var(--line);flex:0 0 auto}
.bar .brand{font-weight:700;letter-spacing:.02em;display:flex;align-items:center;gap:9px}
.dot{width:9px;height:9px;border-radius:50%;background:var(--g);box-shadow:0 0 8px var(--g);transition:.2s}
.dot.reloading{background:var(--warn);box-shadow:0 0 8px var(--warn)}
.dot.off{background:var(--err);box-shadow:none}
.bar select,.bar input,.bar button{font:inherit;color:var(--ink);background:#0e1017;border:1px solid var(--line);border-radius:8px;padding:8px 11px}
.bar .spacer{flex:1}
.bar input.msg{width:210px}
.bar button{cursor:pointer;transition:.15s}
.bar button:hover{border-color:var(--c)}
.pill{font-size:12px;font-weight:600;padding:6px 11px;border-radius:999px;border:1px solid var(--line);white-space:nowrap}
.pill.ok{color:var(--g);border-color:#1c3b28;background:#0e1a12}
.pill.warn{color:var(--warn);border-color:#3b3316;background:#1a160c}
.publish{background:var(--g);border-color:var(--g)!important;color:#06210f;font-weight:700;padding:8px 18px;display:flex;align-items:center;gap:8px}
.publish:hover{filter:brightness(1.08)}
.publish:disabled{opacity:.7;cursor:default}
.spin{width:13px;height:13px;border:2px solid #06210f;border-top-color:transparent;border-radius:50%;animation:sp .7s linear infinite;display:none}
.publish.busy .spin{display:inline-block}
@keyframes sp{to{transform:rotate(360deg)}}
.stage{flex:1;display:flex;gap:16px;padding:16px;overflow:hidden;background:radial-gradient(80vw 60vh at 70% -10%,rgba(24,182,243,.06),transparent 60%)}
.pane{background:var(--panel);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.pane.desk{flex:1;min-width:0}.pane.mob{flex:0 0 auto}
.pane .head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 13px;border-bottom:1px solid var(--line);color:var(--dim);font-size:12px;letter-spacing:.04em;text-transform:uppercase}
.pane .head select{font:inherit;color:var(--ink);background:#0e1017;border:1px solid var(--line);border-radius:7px;padding:4px 8px;font-size:12px;text-transform:none;letter-spacing:0}
.pane .body{flex:1;overflow:hidden;position:relative;background:#000}
.viewport{position:absolute;inset:0;overflow:hidden}
.viewport iframe{border:0;transform-origin:top left;background:#060609}
.mob .body{display:grid;place-items:center;padding:16px;background:#0a0b0f}
.phone{position:relative;border:9px solid #23262f;border-radius:34px;box-shadow:0 20px 50px -20px #000;overflow:hidden;background:#000}
.phone iframe{border:0;display:block;background:#060609}
.toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%) translateY(20px);background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 18px;width:min(92vw,680px);box-shadow:0 24px 50px -20px #000;opacity:0;pointer-events:none;transition:.3s;z-index:20}
.toast.show{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0)}
.toast .row{display:flex;align-items:center;gap:12px;justify-content:space-between}
.toast .t{font-weight:700}.toast.ok .t{color:var(--g)}.toast.err .t{color:var(--err)}.toast.busy .t{color:var(--c)}
.toast a.btn,.toast button.btn{font:inherit;color:var(--ink);background:#0e1017;border:1px solid var(--line);border-radius:8px;padding:7px 13px;cursor:pointer;text-decoration:none;white-space:nowrap}
.toast a.btn{color:var(--c);border-color:#1d3a4d}
.toast pre{white-space:pre-wrap;word-break:break-word;color:var(--dim);font:11px/1.5 ui-monospace,Menlo,monospace;max-height:30vh;overflow:auto;margin-top:10px;display:none}
.toast.err pre{display:block}
.toast .togglelog{color:var(--dim);cursor:pointer;font-size:12px;text-decoration:underline;margin-top:8px;display:inline-block}
</style></head><body>
<div class="bar">
  <span class="brand"><span class="dot" id="dot"></span>${CONFIG.title}</span>
  <select id="page">${opts}</select>
  <button id="reload" title="Vorschau neu laden">↻</button>
  <span class="spacer"></span>
  <span class="pill" id="pill">…</span>
  <input class="msg" id="msg" placeholder="Commit-Nachricht" value="Update site">
  <button class="publish" id="publish"><span class="spin"></span><span id="pubLabel">▲ Publish</span></button>
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
<div class="toast" id="toast">
  <div class="row"><span class="t" id="toastT"></span><span id="toastActions"></span></div>
  <span class="togglelog" id="togglelog" style="display:none">Log anzeigen</span>
  <pre id="toastL"></pre>
</div>
<script>
const $=s=>document.querySelector(s);
const deskF=$("#deskF"),mobF=$("#mobF"),dot=$("#dot"),pill=$("#pill");
const DESK_W=1440; let MOB_W=393, MOB_H=852;

function fit(){
  const vp=$("#deskVp"),w=vp.clientWidth,h=vp.clientHeight,s=w/DESK_W;
  deskF.style.width=DESK_W+"px";deskF.style.height=(h/s)+"px";deskF.style.transform="scale("+s+")";
  $("#deskS").textContent=Math.round(s*100)+"%";
  const body=$("#phone").parentElement,availH=body.clientHeight-32,availW=body.clientWidth-32;
  const ms=Math.min(availH/MOB_H,availW/MOB_W,1),ph=$("#phone");
  ph.style.width=(MOB_W*ms)+"px";ph.style.height=(MOB_H*ms)+"px";
  mobF.style.width=MOB_W+"px";mobF.style.height=MOB_H+"px";mobF.style.transformOrigin="top left";mobF.style.transform="scale("+ms+")";
}
addEventListener("resize",fit);setTimeout(fit,60);addEventListener("load",fit);
$("#device").addEventListener("change",e=>{const[w,h]=e.target.value.split(",").map(Number);MOB_W=w;MOB_H=h;mobF.width=w;mobF.height=h;$("#mobLabel").textContent=e.target.selectedOptions[0].textContent+" · "+w+"×"+h;fit();});
$("#page").addEventListener("change",e=>{deskF.src=e.target.value;mobF.src=e.target.value;});
$("#reload").addEventListener("click",reloadFrames);
function reloadFrames(){dot.classList.add("reloading");[deskF,mobF].forEach(f=>{try{f.contentWindow.location.reload();}catch(e){f.src=f.src;}});setTimeout(()=>{dot.classList.remove("reloading");fit();},400);}

// live reload
let es;
function connect(){es=new EventSource("/__events");es.onopen=()=>dot.classList.remove("off");es.onmessage=e=>{if(e.data==="reload"){reloadFrames();refreshStatus();}};es.onerror=()=>{dot.classList.add("off");es.close();setTimeout(connect,1500);};}
connect();

// status pill — what's waiting to be deployed
async function refreshStatus(){
  try{const s=await(await fetch("/__status")).json();const pending=(s.dirty||0)+(s.ahead||0);
    if(pending>0){pill.className="pill warn";pill.textContent=pending+" Änderung"+(pending>1?"en":"")+" bereit";}
    else{pill.className="pill ok";pill.textContent="✓ alles deployt";}
  }catch(e){pill.textContent="";}
}
refreshStatus();

// toast helpers
const toast=$("#toast"),toastT=$("#toastT"),toastL=$("#toastL"),toastA=$("#toastActions"),togglelog=$("#togglelog");
togglelog.addEventListener("click",()=>{toastL.style.display=toastL.style.display==="block"?"none":"block";});
let toastTimer;
function showToast(kind,title,{log="",actions=[],sticky=false}={}){
  toast.className="toast show "+kind;toastT.textContent=title;
  toastL.textContent=log;toastL.style.display=(kind==="err"&&log)?"block":"none";
  togglelog.style.display=log?"inline-block":"none";
  toastA.replaceChildren();actions.forEach(a=>{const el=document.createElement(a.href?"a":"button");el.className="btn";el.textContent=a.label;if(a.href){el.href=a.href;el.target="_blank";}if(a.onclick)el.onclick=a.onclick;toastA.appendChild(el);});
  clearTimeout(toastTimer);if(!sticky)toastTimer=setTimeout(()=>toast.classList.remove("show"),10000);
}

// publish → then track the GitHub-Pages build until it's live
const pubBtn=$("#publish"),pubLabel=$("#pubLabel");
pubBtn.addEventListener("click",async()=>{
  pubBtn.disabled=true;pubBtn.classList.add("busy");pubLabel.textContent="Publishing…";
  showToast("busy","▲ Baue & pushe …",{sticky:true});
  let d;
  try{ d=await(await fetch("/__publish",{method:"POST",headers:{"Content-Type":"application/json","X-Preview":"1"},body:JSON.stringify({message:$("#msg").value})})).json(); }
  catch(e){ showToast("err","✗ Fehler beim Publish",{log:String(e)}); resetBtn(); return; }
  if(!d.ok){ showToast("err","✗ Publish fehlgeschlagen",{log:d.log}); resetBtn(); return; }
  const openA={label:"Öffnen",href:d.liveUrl};
  if(d.upToDate){ showToast("ok","✓ Bereits aktuell — nichts Neues zu deployen",{log:d.log,actions:[openA]}); resetBtn(); refreshStatus(); return; }
  // pushed → follow the Pages build
  showToast("busy","✓ Gepusht — GitHub Pages baut … (~1 Min)",{actions:[openA],sticky:true});
  refreshStatus();
  trackDeploy(d.sha,d.liveUrl,d.log);
  resetBtn();
});
function resetBtn(){pubBtn.disabled=false;pubBtn.classList.remove("busy");pubLabel.textContent="▲ Publish";}
async function trackDeploy(sha,liveUrl,log){
  const openA={label:"Öffnen",href:liveUrl};
  for(let i=0;i<30;i++){
    await new Promise(r=>setTimeout(r,6000));
    let st;try{st=await(await fetch("/__deploystatus")).json();}catch(e){continue;}
    if(!st.available){ showToast("ok","✓ Gepusht — Deploy läuft auf GitHub Pages",{actions:[openA],log}); return; }
    if(st.status==="built"&&sha&&st.commit&&st.commit===sha){ showToast("ok","✓ Live! Deine Änderungen sind veröffentlicht.",{actions:[openA],log}); return; }
    if(st.status==="errored"){ showToast("err","✗ GitHub-Pages-Build fehlgeschlagen",{actions:[openA],log}); return; }
    showToast("busy","▲ GitHub Pages baut … ("+st.status+")",{actions:[openA],sticky:true});
  }
  showToast("ok","✓ Gepusht — Build dauert noch, gleich live",{actions:[openA],log});
}
</script></body></html>`;
}

// ---------- server ----------
const server = http.createServer(async (req, res) => {
  const url = req.url || "/";
  if (url === "/__preview" || url === "/") { res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); return res.end(shell()); }
  if (url === "/favicon.ico") { res.writeHead(204); return res.end(); }
  if (url === "/__events") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    res.write("retry: 1500\n\n"); clients.add(res); req.on("close", () => clients.delete(res)); return;
  }
  if (url === "/__status") { res.writeHead(200, { "Content-Type": "application/json" }); return res.end(JSON.stringify(await gitStatus())); }
  if (url.startsWith("/__deploystatus")) { res.writeHead(200, { "Content-Type": "application/json" }); return res.end(JSON.stringify(await deployStatus())); }
  if (url === "/__publish" && req.method === "POST") {
    if (req.headers["x-preview"] !== "1") { res.writeHead(403); return res.end("forbidden"); }
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 4096) req.destroy(); });
    req.on("end", async () => {
      let msg = "Update site"; try { msg = JSON.parse(body).message || msg; } catch (e) {}
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(await publish(msg)));
    });
    return;
  }
  const abs = safePath(url);
  if (!abs) { res.writeHead(400); return res.end("bad path"); }
  try {
    let target = abs;
    const st = await stat(target).catch(() => null);
    if (st && st.isDirectory()) target = path.join(target, "index.html");
    const data = await readFile(target);
    res.writeHead(200, { "Content-Type": MIME[path.extname(target).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  } catch (e) { res.writeHead(404, { "Content-Type": "text/plain" }); res.end("404"); }
});

server.listen(CONFIG.port, CONFIG.host, () => {
  const url = `http://${CONFIG.host}:${CONFIG.port}/__preview`;
  console.log(`\n  ▲ Dev-Preview läuft:  ${url}\n`);
  startWatch();
  if (process.platform === "win32") { try { spawn("cmd", ["/c", "start", "", url], { shell: false, detached: true, stdio: "ignore" }).unref(); } catch (e) {} }
});

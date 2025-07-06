/* ========= script.js (full) ========= */
const BASE_URL = "https://xxx.ngrok.io";   // ← ganti SEKALI di sini

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- THEME ---------- */
  const themeBtn = document.getElementById("themeToggle");
  if (localStorage.getItem("zenTheme") === "light") {
    document.body.classList.add("light");
    themeBtn.textContent = "☀️";
  }
  themeBtn.onclick = () => {
    const light = document.body.classList.toggle("light");
    themeBtn.textContent = light ? "☀️" : "🌙";
    localStorage.setItem("zenTheme", light ? "light" : "dark");
  };

  /* ---------- SIDEBAR ---------- */
  const side = document.getElementById("side");
  const ham  = document.getElementById("menuBtn");
  ham.onclick = () => {
    side.classList.toggle("closed");
    document.body.classList.toggle("sidebar-closed");
  };

  /* ---------- NAV ---------- */
  const pages = {
    home       : homeSection,
    func       : funcSection,
    downloader : downloaderSection,
    about      : aboutSection
  };
  function show(k){
    Object.values(pages).forEach(p=>p.classList.add("hidden"));
    pages[k].classList.remove("hidden");
    if (k === "func") renderBugs();
  }
  document.querySelectorAll("[data-page]").forEach(link=>{
    link.onclick = e=>{
      e.preventDefault();
      document.querySelectorAll("[data-page]")
              .forEach(a=>a.classList.toggle("active",a===link));
      show(link.dataset.page);
      side.classList.add("closed");
      document.body.classList.add("sidebar-closed");
    };
  });

  /* ---------- BUG LIST ---------- */
  let rendered = false;
  function renderBugs(){
    if(rendered||typeof bugData==="undefined")return;
    bugData.forEach((b,i)=>{
      bugContainer.insertAdjacentHTML("beforeend",
        `<div class="bug">
           <span>${b.title}</span>
           <button onclick="copyBug(${i})">Copy</button>
         </div>`);
    });
    rendered = true;
  }
  window.copyBug = i =>
    navigator.clipboard.writeText(atob(bugData[i].funcB64))
      .then(()=>toast("Copied"))
      .catch(()=>toast("Copy fail",true));

  /* ---------- TikTok Downloader (REAL) ---------- */
  window.dlTikTok = async ()=>{
    const url = tiktokUrl.value.trim();
    const out = tiktokResult;
    if(!url) return toast("Masukkan URL!",true);
    out.textContent = "Mengambil…";
    try{
      const api = `${BASE_URL}/api/tiktok?url=${encodeURIComponent(url)}`;
      const res = await fetch(api).then(r=>r.json());
      if(!res.data||!res.data.length) throw 0;

      const file =
        res.data.find(x=>x.type==="nowatermark_hd")?.url ||
        res.data.find(x=>x.type==="nowatermark")?.url   ||
        res.data[0].url;

      out.innerHTML = `
        <video src="${file}" controls style="max-width:100%;border-radius:8px"></video><br>
        <a href="${file}" target="_blank" download>⬇️ Download MP4</a>
        <p style="margin-top:.4rem">
          ❤️ ${res.stats.likes} &nbsp;
          💬 ${res.stats.comment} &nbsp;
          🔄 ${res.stats.share}
        </p>`;
      toast("Berhasil!");
    }catch(err){
      console.error(err);
      out.textContent="❌ Gagal mengambil video.";
      toast("Error TikTok",true);
    }
  };

  /* ---------- TOAST ---------- */
  function toast(msg,err=false){
    const box=toastContainer;
    const d=document.createElement("div");
    d.className="toast";
    if(err)d.style.borderLeftColor="red";
    d.textContent=msg;
    box.appendChild(d);
    setTimeout(()=>{d.style.opacity=0;setTimeout(()=>d.remove(),500)},2500);
  }

  /* init */
  show("home");
});

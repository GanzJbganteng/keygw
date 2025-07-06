/* ========= script.js (Zenix RGP) ========= */
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
  const side   = document.getElementById("side");
  const hamBtn = document.getElementById("menuBtn");
  hamBtn.onclick = () => {
    side.classList.toggle("closed");
    document.body.classList.toggle("sidebar-closed");
  };

  /* ---------- NAVIGATION ---------- */
  const pages = {
    home       : document.getElementById("homeSection"),
    func       : document.getElementById("funcSection"),
    downloader : document.getElementById("downloaderSection"),
    about      : document.getElementById("aboutSection")
  };
  function show(page) {
    Object.values(pages).forEach(p => p.classList.add("hidden"));
    pages[page].classList.remove("hidden");
    if (page === "func") renderBugs();
  }
  document.querySelectorAll("[data-page]").forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      document.querySelectorAll("[data-page]")
              .forEach(a => a.classList.toggle("active", a === link));
      show(link.dataset.page);
      side.classList.add("closed");
      document.body.classList.add("sidebar-closed");
    };
  });

  /* ---------- FUNC BUG ---------- */
  let bugsRendered = false;
  function renderBugs() {
    if (bugsRendered || typeof bugData === "undefined") return;
    const wrap = document.getElementById("bugContainer");
    bugData.forEach((b, i) => {
      wrap.insertAdjacentHTML(
        "beforeend",
        `<div class="bug">
           <span>${b.title}</span>
           <button onclick="copyBug(${i})">Copy</button>
         </div>`
      );
    });
    bugsRendered = true;
  }
  window.copyBug = i =>
    navigator.clipboard
      .writeText(atob(bugData[i].funcB64))
      .then(() => toast("Copied"))
      .catch(() => toast("Copy failed", true));

  /* ---------- TikTok DOWNLOADER (real) ---------- */
  window.dlTikTok = async () => {
    const urlInp = document.getElementById("tiktokUrl");
    const out    = document.getElementById("tiktokResult");
    const url    = urlInp.value.trim();
    if (!url) return toast("Masukkan URL!", true);

    out.textContent = "Mengambil…";

    try {
      // proxy bebas-CORS yang meneruskan ke tikwm.com
      const api = "https://api.tiklydown.me/tikwm?url=" + encodeURIComponent(url);
      const { data } = await fetch(api).then(r => r.json());

      if (!data) throw 0;
      const mp4 = data.hdplay || data.play;          // prefer HD
      const size = data.hd_size || data.size || "?";

      out.innerHTML = `
        <video src="${mp4}" controls style="max-width:100%;border-radius:8px"></video><br>
        <a href="${mp4}" target="_blank">⬇️ Download MP4 (${size})</a>
        <p style="margin-top:.4rem">
          ❤️ ${(+data.digg_count).toLocaleString()} &nbsp;
          💬 ${(+data.comment_count).toLocaleString()} &nbsp;
          🔄 ${(+data.share_count).toLocaleString()}
        </p>`;
      toast("Berhasil!");
    } catch (err) {
      console.error(err);
      out.textContent = "Gagal mengambil video.";
      toast("❌ Error TikTok", true);
    }
  };

  /* ---------- TOAST ---------- */
  function toast(msg, err = false) {
    const box = document.getElementById("toastContainer");
    const div = document.createElement("div");
    div.className = "toast";
    if (err) div.style.borderLeftColor = "red";
    div.textContent = msg;
    box.appendChild(div);
    setTimeout(() => {
      div.style.opacity = 0;
      setTimeout(() => div.remove(), 500);
    }, 2500);
  }

  /* init halaman awal */
  show("home");
});

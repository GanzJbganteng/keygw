document.addEventListener("DOMContentLoaded", () => {
  /* ==== THEME ==== */
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

  /* ==== SIDEBAR TOGGLE ==== */
  const side = document.getElementById("side");
  document.getElementById("menuBtn").onclick = () => {
    side.classList.toggle("closed");
    document.body.classList.toggle("sidebar-closed");
  };

  /* ==== NAVIGATION ==== */
  const pages = {
    home       : document.getElementById("homeSection"),
    func       : document.getElementById("funcSection"),
    downloader : document.getElementById("downloaderSection"),
    about      : document.getElementById("aboutSection")
  };
  function show(key) {
    Object.values(pages).forEach(p => p.classList.add("hidden"));
    pages[key].classList.remove("hidden");
    if (key === "func") renderBugs();
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

  /* ==== FUNC BUG ==== */
  let rendered = false;
  function renderBugs() {
    if (rendered || typeof bugData === "undefined") return;
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
    rendered = true;
  }
  window.copyBug = i =>
    navigator.clipboard.writeText(atob(bugData[i].funcB64))
      .then(() => toast("Copied"))
      .catch(() => toast("Fail", true));

  /* ==== TikTok REAL DOWNLOADER via tikwm.com ==== */
  window.dlTikTok = async () => {
    const url = document.getElementById("tiktokUrl").value.trim();
    const out = document.getElementById("tiktokResult");
    if (!url) return toast("Masukkan URL!", true);

    out.textContent = "Mengambil…";
    try {
      /* proxy bebas-CORS */
      const api = "https://r.jina.ai/http://www.tikwm.com/api/?" +
                  "count=12&cursor=0&web=1&hd=1&url=" +
                  encodeURIComponent(url);
      const json = await fetch(api).then(r => r.json());
      const d    = json.data;

      const mp4  = "https://www.tikwm.com" + (d.hdplay || d.play);
      out.innerHTML = `
        <video src="${mp4}" controls style="max-width:100%;border-radius:8px"></video><br>
        <a href="${mp4}" target="_blank">⬇️ Download MP4 (${d.hd_size || d.size})</a>
        <p style="margin-top:.4rem">
          ❤️ ${d.digg_count.toLocaleString()} &nbsp;
          💬 ${d.comment_count.toLocaleString()} &nbsp;
          🔄 ${d.share_count.toLocaleString()}
        </p>`;
      toast("Berhasil!");
    } catch (err) {
      console.error(err);
      out.textContent = "Gagal mengambil video.";
      toast("❌ Error TikTok", true);
    }
  };

  /* ==== TOAST ==== */
  function toast(msg, err = false) {
    const box = document.getElementById("toastContainer");
    const d   = document.createElement("div");
    d.className = "toast";
    if (err) d.style.borderLeftColor = "red";
    d.textContent = msg;
    box.appendChild(d);
    setTimeout(() => {
      d.style.opacity = 0;
      setTimeout(() => d.remove(), 500);
    }, 2500);
  }

  /* init */
  show("home");
});

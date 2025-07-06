/* ========= script.js (tanpa fitur downloader) ========= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- THEME (jika tombol ada) ---------- */
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    if (localStorage.getItem("zenTheme") === "light") {
      document.body.classList.add("light");
      themeBtn.textContent = "☀️";
    }
    themeBtn.onclick = () => {
      const light = document.body.classList.toggle("light");
      themeBtn.textContent = light ? "☀️" : "🌙";
      localStorage.setItem("zenTheme", light ? "light" : "dark");
    };
  }

  /* ---------- SIDEBAR TOGGLE (jika tombol ham ada) ---------- */
  const side = document.getElementById("side");
  const ham  = document.getElementById("menuBtn");
  if (ham && side) {
    ham.onclick = () => {
      side.classList.toggle("closed");
      document.body.classList.toggle("sidebar-closed");
    };
  }

  /* ---------- NAVIGASI ---------- */
  const pages = {
    home :  document.getElementById("home")      || document.getElementById("homeSection"),
    func :  document.getElementById("funcbug")   || document.getElementById("funcSection"),
    about:  document.getElementById("about")     || document.getElementById("aboutSection")
  };

  function show(key) {
    Object.values(pages).forEach(p => p && p.classList.add("hidden"));
    if (pages[key]) pages[key].classList.remove("hidden");
    if (key === "func") renderBugs();
    window.scrollTo({ top: 0 });
  }

  document.querySelectorAll("[data-page]").forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      document.querySelectorAll("[data-page]")
        .forEach(a => a.classList.toggle("active", a === link));
      show(link.dataset.page);
      if (side) {
        side.classList.add("closed");
        document.body.classList.add("sidebar-closed");
      }
    };
  });

  /* ---------- BUG LIST ---------- */
  let bugsDrawn = false;
  function renderBugs() {
    if (bugsDrawn || typeof bugData === "undefined") return;
    const wrap = document.getElementById("bugContainer");
    if (!wrap) return;
    bugData.forEach((b, i) => {
      wrap.insertAdjacentHTML(
        "beforeend",
        `<div class="bug">
           <span>${b.title}</span>
           <button onclick="copyBug(${i})">Copy</button>
         </div>`
      );
    });
    bugsDrawn = true;
  }

  window.copyBug = i => {
    if (!bugData || !bugData[i]) return toast("Data tidak ada", true);
    navigator.clipboard
      .writeText(atob(bugData[i].funcB64))
      .then(() => toast("✅ Copied"))
      .catch(() => toast("❌ Gagal copy", true));
  };

  /* ---------- TOAST ---------- */
  function toast(msg, err = false) {
    const box = document.getElementById("toastContainer");
    if (!box) return alert(msg);
    const t   = document.createElement("div");
    t.className = "toast";
    if (err) t.style.borderLeftColor = "red";
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => {
      t.style.opacity = 0;
      setTimeout(() => t.remove(), 500);
    }, 2500);
  }

  /* ---------- INIT ---------- */
  show("home");
});

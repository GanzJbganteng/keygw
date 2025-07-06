/* =========== script.js (tanpa downloader) =========== */
document.addEventListener("DOMContentLoaded", () => {

  /* ---- THEME ---- */
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    if (localStorage.getItem("zenTheme") === "light") {
      document.body.classList.add("light");
      themeBtn.textContent = "☀️";
    }
    themeBtn.onclick = () => {
      const l = document.body.classList.toggle("light");
      themeBtn.textContent = l ? "☀️" : "🌙";
      localStorage.setItem("zenTheme", l ? "light" : "dark");
    };
  }

  /* ---- SIDEBAR TOGGLE ---- */
  const side = document.getElementById("side");
  const ham  = document.getElementById("menuBtn");
  ham.onclick = () => {
    side.classList.toggle("closed");
    document.body.classList.toggle("sidebar-closed");
  };

  /* ---- NAVIGATION ---- */
  const pages = {
    home : homeSection,
    func : funcSection,
    about: aboutSection
  };

  function show(key) {
    Object.values(pages).forEach(sec => sec.classList.add("hidden"));
    pages[key].classList.remove("hidden");
    if (key === "func") renderBugs();
    window.scrollTo({ top: 0 });
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

  /* ---- FUNC BUG LIST ---- */
  let rendered = false;
  function renderBugs() {
    if (rendered || typeof bugData === "undefined") return;
    const wrap = document.getElementById("bugContainer");
    bugData.forEach((b,i) => {
      wrap.insertAdjacentHTML("beforeend",
        `<div class="bug">
           <span>${b.title}</span>
           <button onclick="copyBug(${i})">Copy</button>
         </div>`);
    });
    rendered = true;
  }

  window.copyBug = i =>
    navigator.clipboard.writeText(atob(bugData[i].funcB64))
      .then(() => toast("✅ Copied"))
      .catch(() => toast("❌ Gagal Copy", true));

  /* ---- TOAST ---- */
  function toast(msg, err=false) {
    const box = document.getElementById("toastContainer");
    const t   = document.createElement("div");
    t.className = "toast";
    if (err) t.style.borderLeftColor = "red";
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => { t.style.opacity = 0; setTimeout(() => t.remove(), 500); }, 2500);
  }

  /* init */
  show("home");
});

document.addEventListener("DOMContentLoaded", () => {
  /* theme */
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

  /* sidebar toggle */
  const side = document.getElementById("side");
  document.getElementById("menuBtn").onclick = () => {
    side.classList.toggle("closed");
    document.body.classList.toggle("sidebar-closed");
  };

  /* navigation */
  const pages = {
    home: document.getElementById("homeSection"),
    func: document.getElementById("funcSection"),
    downloader: document.getElementById("downloaderSection"),
    about: document.getElementById("aboutSection")
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

  /* func bug */
  let rendered = false;
  function renderBugs() {
    if (rendered || typeof bugData === "undefined") return;
    const wrap = document.getElementById("bugContainer");
    bugData.forEach((b, i) => {
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
      .then(() => toast("Copied"))
      .catch(() => toast("Fail", true));

  /* downloader demo */
  window.dlTikTok = () => {
    const url = document.getElementById("tiktokUrl").value.trim();
    const out = document.getElementById("tiktokResult");
    if (!url) return toast("Masukkan URL!", true);
    out.textContent = "Mengambil…";
    setTimeout(() => {
      out.innerHTML = "<em>Demo berhasil (link palsu)</em>";
      toast("Berhasil!");
    }, 1200);
  };

  function toast(msg, err = false) {
    const box = document.getElementById("toastContainer");
    const d = document.createElement("div");
    d.className = "toast";
    if (err) d.style.borderLeftColor = "red";
    d.textContent = msg;
    box.appendChild(d);
    setTimeout(() => {
      d.style.opacity = 0;
      setTimeout(() => d.remove(), 500);
    }, 2500);
  }

  show("home");
});
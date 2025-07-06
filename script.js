document.addEventListener("DOMContentLoaded", () => {

  /* ========== elemen dasar ========== */
  const side   = document.getElementById("sidebar");
  const hamBtn = document.querySelector(".ham");
  const links  = document.querySelectorAll(".sidebar a");
  const pages  = {
    welcome : document.getElementById("welcome"),
    func    : document.getElementById("func"),
    about   : document.getElementById("about")
  };

  /* ========== sidebar toggle ========== */
  window.toggleSidebar = function () {
    side.classList.toggle("closed");
    document.body.classList.toggle("sidebar-closed");
  };

  /* ========== nav click ========== */
  links.forEach(a=>{
    a.addEventListener("click", e=>{
      e.preventDefault();
      links.forEach(l=>l.classList.toggle("active",l===a));
      showPage(a.getAttribute("data-page"));
      toggleSidebar();               // auto‐close setelah klik
    });
  });

  function showPage(key){
    Object.values(pages).forEach(p=>p.classList.add("hidden"));
    (pages[key]||pages.welcome).classList.remove("hidden");
    if(key==="func") renderBugs();
  }

  /* ========== func bug list ========== */
  const bugData = window.bugData || [];
  let rendered = false;
  function renderBugs(){
    if(rendered) return;
    const wrap = document.getElementById("bugList");
    bugData.forEach((b,i)=>{
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
      .then(()=>toast("✅ Copied"))
      .catch(()=>toast("❌ Gagal copy",true));

  /* ========== toast ========== */
  function toast(msg,err=false){
    const box=document.querySelector(".toast-container");
    const d=document.createElement("div");d.className="toast";
    if(err)d.style.borderLeftColor="red";
    d.textContent=msg;box.appendChild(d);
    setTimeout(()=>{d.style.opacity=0;setTimeout(()=>d.remove(),500)},2500);
  }

  /* ========== lucide icons & init ========== */
  lucide.createIcons();
  // tutup sidebar di load pertama
  side.classList.add("closed");
  document.body.classList.add("sidebar-closed");
  showPage("welcome");
});

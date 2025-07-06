document.addEventListener("DOMContentLoaded", () => {

  /* ===== elemen ===== */
  const sidebar = document.getElementById("sidebar");
  const links   = document.querySelectorAll(".sidebar a");
  const pages   = {
    welcome : document.getElementById("welcome"),
    func    : document.getElementById("func"),
    about   : document.getElementById("about")
  };

  /* ===== sidebar toggle ===== */
  window.toggleSidebar = () => {
    sidebar.classList.toggle("closed");
    document.body.classList.toggle("sidebar-closed");
  };

  /* ===== nav klik ===== */
  links.forEach(a=>{
    a.addEventListener("click",e=>{
      e.preventDefault();
      links.forEach(l=>l.classList.toggle("active",l===a));
      showPage(a.dataset.page);
      toggleSidebar();
    });
  });

  function showPage(key){
    Object.values(pages).forEach(p=>p.classList.add("hidden"));
    (pages[key]||pages.welcome).classList.remove("hidden");
    if(key==="func") renderBugs();
  }

  /* ===== render bug ===== */
  let rendered=false;
  function renderBugs(){
    if(rendered) return;
    if(!window.bugData){toast("bugData kosong",true);return;}
    const wrap=document.getElementById("bugList");
    bugData.forEach((b,i)=>{
      wrap.insertAdjacentHTML("beforeend",
        `<div class="bug"><span>${b.title}</span>
         <button onclick="copyBug(${i})">Copy</button></div>`);
    });
    rendered=true;
  }
  window.copyBug = i =>
    navigator.clipboard.writeText(atob(bugData[i].funcB64))
      .then(()=>toast("✅ Copied"))
      .catch(()=>toast("❌ Gagal copy",true));

  /* ===== theme toggle ===== */
  const themeBtn=document.getElementById("themeToggle");
  if(localStorage.getItem("zenTheme")==="light"){
    document.body.classList.add("light");themeBtn.textContent="☀️";
  }
  themeBtn.onclick=()=>{
    const light=document.body.classList.toggle("light");
    themeBtn.textContent= light ? "☀️" : "🌓";
    localStorage.setItem("zenTheme", light ? "light" : "dark");
  };

  /* ===== toast util ===== */
  function toast(msg,err=false){
    const box=document.querySelector(".toast-container")||createBox();
    const d=document.createElement("div");d.className="toast";
    if(err)d.style.borderLeftColor="red";
    d.textContent=msg;box.appendChild(d);
    setTimeout(()=>{d.style.opacity=0;setTimeout(()=>d.remove(),500)},2500);
  }
  function createBox(){
    const c=document.createElement("div");
    c.className="toast-container";
    document.body.appendChild(c);
    return c;
  }

  /* ===== init ===== */
  lucide.createIcons();
  showPage("welcome");
});

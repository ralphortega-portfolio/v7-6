/* Ralph Ortega site: shared behavior (nav, theme, switchboard, counters, timeline, FAQ, contact form) */
(function(){
"use strict";

/* Contact form delivery (Web3Forms). This access key is public by design:
   it can only submit your form. Your email address is not stored anywhere on the site. */
var WEB3FORMS_KEY="f2491a49-9f52-42cc-bf4b-d8b42fa3f921";

var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var page=document.body.getAttribute("data-page")||"";
var root=document.body.getAttribute("data-root")||"./";

/* When the folder is opened straight from a computer (file://), site-root links like "/#faq"
   cannot work, so point them at the right local files. On the live site this does nothing. */
if(location.protocol==="file:"){
  $$('a[href^="/"]').forEach(function(a){
    var h=a.getAttribute("href"),hash="",i=h.indexOf("#");
    if(i>-1){hash=h.slice(i);h=h.slice(0,i)}
    var path=h.slice(1);
    if(path===""||path.slice(-1)==="/")path+="index.html";
    a.setAttribute("href",root+path+hash);
  });
}

/* theme */
var themeBtn=$("#themeBtn");
if(themeBtn)themeBtn.addEventListener("click",function(){
  var r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
  r.dataset.theme=dark?"light":"dark";
});

/* top nav: sliding highlight + scroll spy */
var blob=$("#blob"),navEl=$(".topnav nav"),navLinks=$$("a[data-nav]"),cta=$("#navCta"),activeNav=null;
function setNav(name){
  activeNav=name;var target=null;
  navLinks.forEach(function(a){var on=a.getAttribute("data-nav")===name;a.classList.toggle("on",on);if(on)target=a});
  if(target){
    blob.style.width=target.offsetWidth+"px";blob.style.transform="translateX("+target.offsetLeft+"px)";blob.style.opacity=1;
    if(navEl.scrollWidth>navEl.clientWidth+2){navEl.scrollTo({left:Math.max(0,target.offsetLeft-(navEl.clientWidth-target.offsetWidth)/2),behavior:reduce?"auto":"smooth"})}
  }else if(blob){blob.style.opacity=0}
  if(cta)cta.style.boxShadow=name==="contact"?"0 0 0 4px color-mix(in srgb,var(--signal) 40%,transparent)":"none";
}
window.addEventListener("resize",function(){setNav(activeNav)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){setNav(activeNav)});
if(page==="home"){
  var spyMap={about:"about","about-more":"about",expertise:"about",services:"services",results:"results",experience:"experience",reviews:"experience",faq:"faq",contact:"contact"};
  var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setNav(spyMap[e.target.id])})},{rootMargin:"-45% 0px -50% 0px"});
  Object.keys(spyMap).forEach(function(id){var n=document.getElementById(id);if(n)spy.observe(n)});
  setNav("about");
}else if(page==="service"){setNav("services")}
else{setNav(null)}

/* expertise switchboard */
var skillBtns=$$(".skill");
if(skillBtns.length){
  var bpBody=$("#bpBody"),activeSkill=0;
  var setSkill=function(i){
    if(i===activeSkill)return;activeSkill=i;var b=skillBtns[i];
    skillBtns.forEach(function(x,j){x.setAttribute("aria-pressed",j===i?"true":"false")});
    $("#bpTitle").textContent=b.querySelector("span:last-child").textContent;
    $("#bpText").textContent=b.getAttribute("data-text");
    var tg=$("#bpTags");tg.innerHTML="";
    b.getAttribute("data-tags").split("|").forEach(function(t){var li=document.createElement("li");li.textContent=t;tg.appendChild(li)});
    var a=$("#bpLink");a.setAttribute("href","/services/"+b.getAttribute("data-slug")+"/");a.textContent="See the related service: "+b.getAttribute("data-stitle");
    if(location.protocol==="file:"){a.setAttribute("href",root+"services/"+b.getAttribute("data-slug")+"/index.html")}
    bpBody.classList.remove("swap");void bpBody.offsetWidth;bpBody.classList.add("swap");
  };
  skillBtns.forEach(function(b,i){
    b.addEventListener("mouseenter",function(){setSkill(i)});
    b.addEventListener("focus",function(){setSkill(i)});
    b.addEventListener("click",function(){setSkill(i)});
  });
}

/* results: count up once when visible */
var nums=$$(".num[data-count]");
if(nums.length&&!reduce&&"IntersectionObserver" in window){
  nums.forEach(function(n){n.textContent="0"});
  var counted=false,rows=$("#rows");
  var run=function(){
    if(counted)return;counted=true;
    nums.forEach(function(n,idx){
      var total=+n.getAttribute("data-count"),suf=n.getAttribute("data-suffix")||"",start=performance.now()+idx*120,dur=1400;
      (function tick(now){
        var t=Math.max(0,Math.min(1,(now-start)/dur)),p=1-Math.pow(1-t,4);
        n.textContent=Math.round(total*p).toLocaleString("en-US")+(t>=1?suf:"");
        if(t<1)requestAnimationFrame(tick);
      })(performance.now());
    });
  };
  new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)run()})},{threshold:.35}).observe(rows);
}

/* experience timeline fills as you scroll */
var tl=$("#timeline");
if(tl){
  var jobs=$$(".job",tl),ticking=false;
  var upd=function(){
    var r=tl.getBoundingClientRect(),mid=window.innerHeight*.62;
    tl.style.setProperty("--fill",Math.max(0,Math.min(1,(mid-r.top)/r.height)).toFixed(4));
    jobs.forEach(function(j){j.classList.toggle("reached",j.getBoundingClientRect().top<mid)});
  };
  window.addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(function(){upd();ticking=false})}},{passive:true});
  window.addEventListener("resize",upd);upd();
}

/* FAQ accordion */
$$(".q").forEach(function(q){
  var b=q.querySelector("button");
  b.addEventListener("click",function(){var open=q.classList.toggle("open");b.setAttribute("aria-expanded",open?"true":"false")});
});

/* contact form */
var form=$("#form");
if(form){
  var keys=["name","email","whatsapp","best_time"];
  var rules={
    name:function(v){return v.trim().length>=2?"":"Enter your full name."},
    email:function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())?"":"Enter a valid email address."},
    whatsapp:function(v){var d=v.replace(/\D/g,"");return(/^\+?[\d\s\-().]+$/.test(v.trim())&&d.length>=7&&d.length<=15)?"":"Enter your WhatsApp number with country code, like +1 555 123 4567."},
    best_time:function(v){return v.trim().length>=3?"":"Tell me the best time to call, with your time zone."}
  };
  var setErr=function(k,msg){
    $("#e-"+k).textContent=msg;$("#fld-"+k).classList.toggle("bad",!!msg);
    form.elements[k].setAttribute("aria-invalid",msg?"true":"false");
  };
  keys.forEach(function(k){
    form.elements[k].addEventListener("input",function(){if($("#fld-"+k).classList.contains("bad"))setErr(k,rules[k](form.elements[k].value))});
    form.elements[k].addEventListener("blur",function(){if(form.elements[k].value)setErr(k,rules[k](form.elements[k].value))});
  });
  var showSent=function(){
    $("#formWrap").innerHTML='<div class="sent" tabindex="-1"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29"/><path d="M20 33l8 8 17-18"/></svg><h3>Message sent.</h3><p>Thank you. I’ll reply within one business day with a clear plan.</p></div>';
  };
  var showFail=function(){
    var b=$("#sendBtn");b.disabled=false;b.textContent="Send message";
    var e=$("#formErr");e.hidden=false;e.textContent="Your message didn’t go through. Please try again in a moment, or message me on LinkedIn.";
  };
  form.addEventListener("submit",function(e){
    e.preventDefault();var els=form.elements;
    if(els.company_website.value||els.botcheck.checked)return;
    var first=null;
    keys.forEach(function(k){var msg=rules[k](els[k].value);setErr(k,msg);if(msg&&!first)first=els[k]});
    if(first){first.focus();return}
    $("#formErr").hidden=true;
    var b=$("#sendBtn");b.disabled=true;b.textContent="Sending…";
    var payload={
      access_key:WEB3FORMS_KEY,
      subject:"New call request from "+els.name.value.trim(),
      from_name:"Website contact form",
      replyto:els.email.value.trim(),
      name:els.name.value.trim(),
      email:els.email.value.trim(),
      whatsapp:els.whatsapp.value.trim(),
      best_time_to_call:els.best_time.value.trim(),
      business_type:els.type.value,
      message:els.need.value.trim()||"(no message)",
      botcheck:""
    };
    fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(payload)})
      .then(function(r){return r.json()})
      .then(function(j){if(j&&j.success){showSent()}else{showFail()}})
      .catch(showFail);
  });
}
})();

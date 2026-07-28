"use strict";
const DATA_ROOT=document.documentElement.dataset.root||".";
const LANGUAGE=document.documentElement.lang==="en"?"en":"ja";
const text=(item,key)=>item?.[`${key}${LANGUAGE==="ja"?"Ja":"En"}`]??item?.[key]??"";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const formatDate=value=>{const d=new Date(`${value}T00:00:00`);return LANGUAGE==="ja"?`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`:new Intl.DateTimeFormat("en",{year:"numeric",month:"short",day:"numeric"}).format(d)};
async function getData(name){const r=await fetch(`${DATA_ROOT}/data/${name}.json`);if(!r.ok)throw new Error(`${name}.json: ${r.status}`);return r.json()}
function setText(s,v){document.querySelectorAll(s).forEach(e=>e.textContent=v)}
function page(pathJa,pathEn){return LANGUAGE==="ja"?pathJa:pathEn}
async function renderShared(){const [site,event]=await Promise.all([getData("site"),getData("event")]);
    setText("[data-site-title]",text(site,"title"));
    setText("[data-site-title-en]",site.titleEn);
    setText("[data-site-short]",site.shortName);
    setText("[data-organizer]",text(site,"organizer"));
    setText("[data-copyright-year]",site.copyrightYear);
    document.querySelectorAll("[data-email]").forEach(e=>{e.textContent=site.email;e.href=`mailto:${site.email}`});
    document.querySelectorAll("[data-github]").forEach(e=>e.href=site.github);
    setText("[data-event-label]",event.label);
    setText("[data-event-title]",text(event,"title"));
    setText("[data-event-lead]",text(event,"lead"));
    const eventDate = document.querySelector("[data-event-date]");
    if (eventDate) {
        eventDate.innerHTML =
            `${text(event, "startdate")}<br>〜<br>${text(event, "enddate")}`;
    }
    setText("[data-event-time]",event.time);
    setText("[data-event-venue]",text(event,"venue"));
    setText("[data-event-language]",text(event,"language"));
    setText("[data-event-deadline]",text(event,"registrationDeadline"));
    setText("[data-site-description]",text(site,"description"));
    setText("[data-audience]",text(site,"audience"));
    setText("[data-coorganizer]",text(site,"coorganizer"))
}
async function renderNews(){const c=document.querySelector("[data-news-list]");if(!c)return;const a=await getData("news");a.sort((x,y)=>y.date.localeCompare(x.date));const n=Number(c.dataset.limit||a.length),d=c.dataset.detailed==="true";c.innerHTML=a.slice(0,n).map(i=>d?`<article id="${esc(i.id)}" class="news-entry"><time datetime="${esc(i.date)}">${esc(formatDate(i.date))}</time><div><p class="news-category">${esc(text(i,"category"))}</p><h2>${esc(text(i,"title"))}</h2><p>${esc(text(i,"body"))}</p>${i.link?`<p><a class="text-link" href="${esc(i.link)}">${esc(text(i,"linkLabel"))} →</a></p>`:""}</div></article>`:`<article class="news-row"><time>${esc(formatDate(i.date))}</time><span class="news-category">${esc(text(i,"category"))}</span><a href="news.html#${esc(i.id)}">${esc(text(i,"title"))}</a></article>`).join("")}
function programMarkup(data){return (data.days||[]).map(day=>`<section class="program-day"><header><p class="program-day-label">${esc(text(day,"label"))}</p><h3>${esc(text(day,"date"))}</h3></header><div class="program-list">${(day.sessions||[]).map(i=>`<article class="program-item"><time>${esc(i.time)}</time><div><p class="program-type">${esc(text(i,"type"))}</p><h4>${esc(text(i,"title"))}</h4><p>${esc(text(i,"person"))}</p></div></article>`).join("")}</div></section>`).join("")}
async function renderProgram() {
    const programList = document.querySelector("[data-program-list]");
    const programPdf = document.querySelector("[data-program-pdf]");
    if (!programList) {return;}
    const program = await getData("program");
    programList.innerHTML = programMarkup(program);
    if (programPdf && program.pdfUrl) {
    const pdfPath = `${DATA_ROOT}/${program.pdfUrl}`;
    programPdf.innerHTML = `<a class="button button-secondary" href="${esc(pdfPath)}" target="_blank" rel="noopener">
            ${LANGUAGE === "ja" ? "PDF" : "View program PDF"}</a>`;
    }
}
async function renderSpeakers(){const c=document.querySelector("[data-speakers-list]");if(!c)return;const a=await getData("speakers");c.innerHTML=a.map(i=>`<article class="speaker"><div class="speaker-photo">${i.image?`<img src="${esc(i.image)}" alt="">`:"Photo"}</div><div><h3>${esc(text(i,"name"))}</h3><p class="affiliation">${esc(text(i,"affiliation"))}</p><p>${esc(text(i,"bio"))}</p>${i.profileUrl?`<a class="text-link" href="${esc(i.profileUrl)}">${LANGUAGE==="ja"?"研究者プロフィール":"Research profile"} →</a>`:""}</div></article>`).join("")}
async function renderCommittee(){const c=document.querySelector("[data-committee-list]");if(!c)return;const a=await getData("committee");c.innerHTML=a.map(i=>`<article class="committee-member"><p class="committee-role">${esc(text(i,"role"))}</p><h3>${i.url?`<a href="${esc(i.url)}" target="_blank" rel="noopener">${esc(text(i,"name"))}</a>`:esc(text(i,"name"))}</h3><p>${esc(text(i,"affiliation"))}</p></article>`).join("")}
async function renderLocation(){const c=document.querySelector("[data-location]");
    if(!c)return;const d=await getData("location");
    c.innerHTML=`<div class="detail-card">
    <h2>${esc(text(d,"venueName"))}</h2>
    <dl class="detail-list">
        <div><dt>${LANGUAGE==="ja"?"住所":"Address"}</dt><dd>${esc(text(d,"address"))}</dd></div>
        <div><dt>${LANGUAGE==="ja"?"会場":"Room"}</dt><dd>${esc(text(d,"room"))}</dd></div>
    </dl>
    <h3>${LANGUAGE==="ja"?"注意事項":"Remarks"}</h3>
    <ul>${(LANGUAGE==="ja"?d.remarkJa:d.remarkEn).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
    <p>${esc(text(d,"notes"))}</p>
    <p class="button-row">
        <a class="button" href="${esc(d.mapUrl)}" target="_blank" rel="noopener">${LANGUAGE==="ja"?"Google map":"Open map"}</a>
        ${d.campusMapUrl?`<a class="button button-secondary" href="${esc(d.campusMapUrl)}" target="_blank" rel="noopener">${LANGUAGE==="ja"?"キャンパスマップ":"Campus map"}</a>`:""}
    </p>
    </div>`
}
async function renderRegistration(){const c=document.querySelector("[data-registration]");if(!c)return;const d=await getData("registration"),conds=LANGUAGE==="ja"?d.conditionsJa:d.conditionsEn;c.innerHTML=`<div class="registration-overview"><p class="status-badge">${esc(text(d,"status"))}</p><p>${esc(text(d,"intro"))}</p><div class="info-table"><div class="info-row"><div class="info-key">${LANGUAGE==="ja"?"締切":"Deadline"}</div><div>${esc(text(d,"deadline"))}</div></div><div class="info-row"><div class="info-key">${LANGUAGE==="ja"?"参加費":"Fee"}</div><div>${esc(text(d,"fee"))}</div></div><div class="info-row"><div class="info-key">${LANGUAGE==="ja"?"定員":"Capacity"}</div><div>${esc(text(d,"capacity"))}</div></div></div><p><a class="button" href="${esc(d.formUrl)}" target="_blank" rel="noopener">${LANGUAGE==="ja"?"参加登録フォームを開く":"Open registration form"}</a></p></div><div class="support-grid">${[d.travelSupport,d.lodgingSupport].filter(x=>x.available).map(x=>`<section class="support-card"><h2>${esc(text(x,"title"))}</h2><p>${esc(text(x,"body"))}</p></section>`).join("")}</div><section class="notice-box"><h2>${LANGUAGE==="ja"?"支援申請に関する注意事項":"Funding conditions"}</h2><ul>${conds.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>`}
async function renderArchive(){const c=document.querySelector("[data-archive-list]");if(!c)return;const d=await getData("archive"),a=d.events||d;c.innerHTML=a.sort((x,y)=>y.date.localeCompare(x.date)).map(i=>`<article class="archive-item"><div class="archive-meta"><time>${esc(formatDate(i.date))}</time><span>${esc(text(i,"edition"))}</span></div><div><h3><a href="archive-detail.html?id=${encodeURIComponent(i.id)}">${esc(text(i,"title"))}</a></h3><p>${esc(text(i,"summary"))}</p><p><a class="text-link" href="archive-detail.html?id=${encodeURIComponent(i.id)}">${LANGUAGE==="ja"?"開催記録を見る":"View event record"} →</a></p></div></article>`).join("")}
async function renderArchiveDetail(){const c=document.querySelector("[data-archive-detail]");if(!c)return;const d=await getData("archive"),id=new URLSearchParams(location.search).get("id"),i=(d.events||d).find(x=>x.id===id)||(d.events||d)[0];if(!i){c.textContent=LANGUAGE==="ja"?"開催記録が見つかりません。":"Event record not found.";return}document.title=`${text(i,"title")} | ${document.title}`;c.innerHTML=`<header class="record-header"><p class="section-label">${esc(text(i,"edition"))}</p><h1>${esc(text(i,"title"))}</h1><p>${esc(formatDate(i.date))} / ${esc(text(i,"venue"))}</p></header><div class="prose"><p>${esc(text(i,"description"))}</p></div>${programMarkup({days:i.days||[]})}<ul class="document-links">${i.reportUrl?`<li><a href="${esc(i.reportUrl)}">${LANGUAGE==="ja"?"開催報告":"Report"}</a></li>`:""}${i.programUrl?`<li><a href="${esc(i.programUrl)}">${LANGUAGE==="ja"?"プログラムPDF":"Program PDF"}</a></li>`:""}${i.materialsUrl?`<li><a href="${esc(i.materialsUrl)}">${LANGUAGE==="ja"?"発表資料":"Materials"}</a></li>`:""}</ul>`}
document.addEventListener("DOMContentLoaded",async()=>{try{await Promise.all([renderShared(),renderNews(),renderProgram(),renderSpeakers(),renderCommittee(),renderLocation(),renderRegistration(),renderArchive(),renderArchiveDetail()])}catch(e){console.error(e);document.querySelectorAll("[data-loading]").forEach(x=>x.textContent=LANGUAGE==="ja"?"データを読み込めませんでした。":"Unable to load data.")}});

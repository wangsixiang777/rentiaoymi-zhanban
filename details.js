
const detailDialog = document.getElementById("project-detail");
let detailKind = "intro";
let detailPage = 0;
let introPages = [];
let detailSourceId = null;
let detailReadingScroll = 0;
let sourceZoom = 1;
const resourceTitles = {
  breeding: "一年三代评价 · 育种模式",
  platform: "合作与科研基础",
  facilities: "研发条件与历史工艺",
  patents: "企业历史专利资料"
};
function detailPageCount() {
  if(detailKind==="intro")return introPages.length;
  return ["route","facilities"].includes(detailKind) ? 2 : 1;
}
function showDetailSource(id) {
  detailReadingScroll=byId("detail-content").scrollTop;
  detailSourceId=id;
  sourceZoom=1;
  renderProjectDetail();
}
function returnToDetail() {
  detailSourceId=null;
  renderProjectDetail();
  byId("detail-content").scrollTop=detailReadingScroll;
}

function splitReadingText(text, limit = 460) {
  const sentences = text.match(/[^。！？]+[。！？]?/g) || [text];
  const pages = [];
  let current = "";
  for (const sentence of sentences) {
    if (current && current.length + sentence.length > limit) {
      pages.push(current);
      current = "";
    }
    current += sentence;
  }
  if (current) pages.push(current);
  return pages;
}

function supportingIntroduction(index) {
  const seen=new Set();
  return projectSources[index].documents.flatMap(id=>{
    const document=materials[id];
    const texts=document.paragraphs.flatMap(paragraph=>{
      const cells=paragraph.split(" ｜ ");
      const body=cells.length>1 ? [...cells].sort((a,b)=>b.length-a.length)[0] : paragraph;
      const text=body.replace(/[\u0000-\u0008]/g,"").trim();
      const key=text.replace(/\s/g,"");
      if(text.length<100 || /填表说明|邮寄地址|邮箱|工商注册/.test(text) || seen.has(key))return [];
      seen.add(key);
      return splitReadingText(text);
    });
    return texts.map(text=>({
      title:[0,2].includes(index) ? "企业综合项目背景资料（跨项目）" : index===4 ? "制药废水光催化净化工艺与材料介绍" : document.name.replace(/\.docx?$/i,""),
      text
    }));
  });
}

function detailMetrics() {
  return boardDetails[active].metrics.map(([value,label,status]) =>
    '<div class="detail-metric"><span>'+esc(status)+'</span><strong>'+esc(value)+'</strong><p>'+esc(label)+'</p></div>'
  ).join("");
}

function renderProjectDetail() {
  if(detailSourceId!==null) {
    const item=materials[detailSourceId];
    byId("detail-heading").textContent="原始资料 · "+item.name;
    byId("detail-prev").textContent="← 返回详情";
    byId("detail-prev").disabled=false;
    byId("detail-next").hidden=true;
    byId("detail-page-number").textContent="原页阅读";
    const content=byId("detail-content");
    content.className="original-reading";
    content.innerHTML='<div class="source-toolbar"><span>'+esc(active===6?"企业历史画册原页，资料年份与本项目范围分别理解。":"研究院既有研究与平台资料。")+'</span><button id="source-smaller">缩小 −</button><button id="source-larger">放大 ＋</button></div><div class="original-sheet"><img id="detail-original-image" src="'+item.url+'" alt="'+esc(item.name)+'"></div>';
    function updateZoom(value) {
      sourceZoom=Math.max(1,Math.min(3,value));
      byId("detail-original-image").style.width=(sourceZoom*100)+"%";
      byId("source-smaller").disabled=sourceZoom===1;
      byId("source-larger").disabled=sourceZoom===3;
    }
    byId("source-smaller").onclick=()=>updateZoom(sourceZoom-.5);
    byId("source-larger").onclick=()=>updateZoom(sourceZoom+.5);
    updateZoom(1);
    content.scrollTo(0,0);
    return;
  }
  byId("detail-prev").textContent="← 上一页";
  byId("detail-next").hidden=false;
  const project = projects[active];
  const detail = boardDetails[active];
  const enrichment = boardEnrichment[active];
  const total = detailPageCount();
  byId("detail-project").textContent = "项目 "+num(active)+" · "+project[0];
  byId("detail-heading").textContent = detailKind === "intro" ? "项目完整介绍" : active===5 ? "资源协同详解" : [4,6].includes(active) ? "技术路线详解" : "研究内容详解";
  if(resourceTitles[detailKind])byId("detail-heading").textContent=resourceTitles[detailKind];
  byId("detail-page-number").textContent = (detailPage+1)+" / "+total;
  byId("detail-prev").disabled = detailPage === 0;
  byId("detail-next").disabled = detailPage === total-1;
  const content = byId("detail-content");
  content.className = detailKind;
  if(resourceTitles[detailKind]) {
    content.innerHTML=renderResourcePage(detailKind,detailPage);
  } else if (detailKind === "intro" && detailPage === 0) {
    content.innerHTML = '<div class="intro-reading"><article><p class="detail-eyebrow">项目简介 · 原文</p><h2>'+esc(intro.paragraphs[active*5+1])+'</h2><p class="full-introduction">'+esc(intro.paragraphs[active*5+4].replace(/^项目简介：/,""))+'</p><p class="detail-source">来源 · 8个项目简介（5.26）</p></article><aside><p class="detail-eyebrow">项目速览</p><h3>'+esc(detail.value)+'</h3><div class="detail-partners">'+esc(project[1])+'<br>×<br>'+esc(project[2])+'</div><div class="detail-metric-stack">'+detailMetrics()+'</div><p class="detail-condition">'+esc(detail.note+(active===0?' 土壤有机质“提升1%以上”为原资料表述，相对增幅或百分点口径待确认。':''))+'</p></aside></div>';
  } else if (detailKind === "intro") {
    const reading = introPages[detailPage];
    content.innerHTML = reading[0]?.platform ? platformPage() : '<div class="source-reading">'+reading.map(part =>
      '<article><p class="detail-eyebrow">'+([0,2].includes(active)?"企业综合项目 · 背景材料":"企业项目材料 · 正文")+'</p><h2>'+esc(part.title)+'</h2><p>'+esc(part.text)+'</p></article>'
    ).join("")+'</div><p class="detail-source">'+([0,2].includes(active)?"该文覆盖品种选育、栽培技术及多所院校的综合合作。单项任务与合作单位以本项目简介为准，经费归属待确认。":"以上内容从企业提供的项目材料正文整理，重复正文已合并，长段落按阅读长度分页。")+'</p>';
  } else if (detailPage === 0) {
    const network = active === 5;
    content.innerHTML = '<p class="detail-eyebrow">'+routeTitles[active]+' · 依据项目材料整理</p><h2 class="route-title">'+esc(detail.value)+'</h2>'+researchMap(active,true)+'<div class="route-research">'+enrichment.tasks.map(([label,text])=>
      '<article><h3>'+esc(label)+'</h3><p>'+esc(text)+'</p></article>'
    ).join("")+'</div><div class="route-results">'+detailMetrics()+'</div><div class="route-caption"><strong>'+(network?'资源、能源与数据协同':'研究目标与应用方向')+'</strong><p>'+esc(active === 4 ? '预期在固载催化剂、自然光电条件下，20分钟内将有机污染物浓度从100 mg/L降至10 mg/L以下。吨水运行费用约4元为预期目标。' : enrichment.impact)+'</p></div>';
  } else {
    content.innerHTML = '<div class="technical-reading"><article><p class="detail-eyebrow">关键研究内容</p>'+boardContent[active].slice(1).map(([title,text])=>'<section><h2>'+esc(title)+'</h2><p>'+esc(text)+'</p></section>').join("")+'<div class="detail-condition">'+esc(detail.note)+'</div></article><aside><p class="detail-eyebrow">指标与阶段说明</p><div class="detail-metric-grid">'+detailMetrics()+enrichment.outputs.map(([value,label,status])=>'<div class="detail-metric"><span>'+esc(status)+'</span><strong>'+esc(value)+'</strong><p>'+esc(label)+'</p></div>').join("")+'</div><section class="detail-exhibit"><h3>'+esc(detail.exhibit[0])+'</h3><p>'+esc(detail.exhibit[1])+'</p></section></aside></div>';
  }
  content.scrollTo(0,0);
}

function openProjectDetail(kind) {
  detailSourceId=null;
  detailKind = kind;
  detailPage = 0;
  const supporting = supportingIntroduction(active);
  introPages = [[]];
  for (let index = 0; index < supporting.length; index += 2) {
    introPages.push(supporting.slice(index,index+2));
  }
  if(active===1)introPages.push([{platform:true}]);
  renderProjectDetail();
  detailDialog.showModal();
}

document.addEventListener("click", event => {
  const source=event.target.closest("[data-source]");
  if(source) {
    if(!detailDialog.open)openProjectDetail(active===1 ? "breeding" : "facilities");
    showDetailSource(Number(source.dataset.source));
    return;
  }
  const button = event.target.closest("[data-detail]");
  if (button) openProjectDetail(button.dataset.detail);
});
byId("detail-close").onclick = () => detailDialog.close();
byId("detail-prev").onclick = () => {
  if(detailSourceId!==null){returnToDetail();return;}
  if (detailPage > 0) { detailPage--; renderProjectDetail(); }
};
byId("detail-next").onclick = () => {
  const total = detailPageCount();
  if (detailPage < total-1) { detailPage++; renderProjectDetail(); }
};


const byId=id=>document.getElementById(id);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=i=>String(i+1).padStart(2,"0");
const intro=materials.find(x=>x.name.startsWith("8个项目简介"));
const entities=["元谋果然好","楚雄云果","元谋果然好","云南华派","云南衡金","滇中有色","云南钛业","云南铁峰"];
const groups=[0,0,0,1,1,2,2,2];
const categories=["现代农业","医药与环保","工业与矿冶"];
const photoSelections=[[20],[5,18,24,25],[20],[0,9],[1,19],[12,6,7,8],[10,2,32,40],[3]];
const projectSources = [
  { images: [11,20], documents: [21] },
  { images: [4,5,18,24,25,26,27], documents: [23] },
  { images: [11,20], documents: [21] },
  { images: [0,9], documents: [56] },
  { images: [1,19], documents: [30] },
  { images: [6,7,8,12], documents: [29] },
  { images: [2,10,...Array.from({length:24},(_,i)=>31+i)], documents: [55] },
  { images: [3], documents: [57] }
];
const routeTitles = ["研究内容框架","研究内容框架","研究内容框架","研究内容框架","光催化研究示意","资源协同示意","熔盐电解研究示意","研究内容框架"];
let active=0,zoom=1,viewerIndex=0,viewerItems=[];
function relatedImages(index) {
  return projectSources[index].images.map(id=>materials[id]);
}
function researchMap(index, expanded=false) {
  const route=boardDetails[index].route;
  if(index===5) {
    return '<div class="resource-network '+(expanded?'large-network':'')+'"><div class="network-object"><strong>楚雄高新技术开发区</strong><span>减污降碳研究对象</span></div><div class="network-branches">'+route.slice(0,3).map(([label,text])=>'<article><h3>'+esc(label)+'</h3><p>'+esc(text)+'</p></article>').join("")+'</div><div class="network-data"><strong>'+esc(route[3][0])+' · 数据支撑</strong><p>'+esc(route[3][1])+'</p></div></div>';
  }
  return '<div class="'+(expanded?'expanded-route':'route-nodes')+' research-framework '+([4,6].includes(index)?'conceptual-flow':'')+'">'+route.map(([label,text],i)=>'<article class="route-node"><span class="'+(expanded?'step-number':'')+'">'+num(i)+'</span><h3>'+esc(label)+'</h3><p>'+esc(text)+'</p></article>').join("")+'</div>';
}
function posterImages(index) {
  if(index===7) {
    const laboratory=embedded.filter(item=>item.source.includes("云南铁峰"));
    return [
      {...laboratory[2],name:"联合实验室合成试验"},
      {...laboratory[0],name:"联合实验室牌匾"},
      materials[3]
    ];
  }
  return photoSelections[index].map(i=>materials[i]);
}
function imageButton(item,index,caption) {
  return '<button class="plate-image" data-photo="'+index+'" aria-label="放大查看 '+esc(caption)+'"><img src="'+item.url+'" alt="'+esc(caption)+'"><span>↗</span></button>';
}
function showProject(index) {
  if(!projects[index])return;
  active=index;
  const [short,research,company,description,highlights,budget,training]=projects[index];
  document.body.dataset.theme=groups[index];
  byId("category").textContent=categories[groups[index]]+" / 项目成果";
  byId("kicker").textContent="PROJECT "+num(index)+" · "+categories[groups[index]];
  byId("title").textContent=intro.paragraphs[index*5+1];
  byId("partners").innerHTML='<span>合作单位</span> '+research+' <b>×</b> '+company;
  byId("folio").textContent=num(index);
  const detail=boardDetails[index];
  const enrichment=boardEnrichment[index];
  byId("value-line").textContent=detail.value;
  const items=posterImages(index);
  const captionsByProject = [
    ["果然好企业形象"],
    ["研究院既有葡萄品种展示","示范种植基地标识","研究院基本情况与专家团队","农民培育与技术推广"],
    ["果然好企业形象"],
    ["企业研发与生产设施","华派医药企业形象"],
    ["黑色二氧化钛光催化净水材料","衡金药业企业形象"],
    ["滇中有色企业厂区影像","企业生产环境","企业厂区与设施","企业厂区与设施"],
    ["钛业企业背景影像","企业厂区影像","2014企业画册 · 生产设备","2014企业画册 · 钛材应用"],
    ["联合实验室合成试验","联合实验室牌匾","企业远景"]
  ];
  const extraCaptions=captionsByProject[index];
  const rows=boardContent[index];
  const guide=index===1 ? materials.find(x=>x.kind==="pages") : null;
  byId("composition").innerHTML=
    '<article class="overview-panel"><div class="section-heading-inline"><p class="section-label">01 / 项目介绍</p><button class="inline-detail" data-detail="intro">完整介绍 ↗</button></div><h2>'+rows[0][0]+'</h2><p class="overview-copy">'+rows[0][1]+'</p><div class="outcomes">'+detail.metrics.map(([value,label,status])=>'<div><span class="outcome-status">'+status+'</span><strong>'+value+'</strong><p>'+label+'</p></div>').join("")+'</div><section class="task-list"><p class="section-label">重点研究任务</p>'+enrichment.tasks.map(([title,text])=>'<div><strong>'+title+'</strong><p>'+text+'</p></div>').join("")+'</section><div class="route-diagram"><div class="section-heading-inline"><p class="section-label">'+routeTitles[index]+'</p><button class="inline-detail" data-detail="route">技术详解 ↗</button></div>'+researchMap(index)+'</div></article>'+
    (resourceVisual(index) || (
    '<section class="visual-panel"><figure class="main-visual">'+imageButton(items[0],0,extraCaptions[0])+'<figcaption>'+extraCaptions[0]+'<span>'+company+'</span></figcaption></figure>'+
    (items.length>1?'<div class="support-images">'+items.slice(1).map((item,i)=>'<figure>'+imageButton(item,i+1,extraCaptions[i+1])+'<figcaption>'+extraCaptions[i+1]+'</figcaption></figure>').join("")+'</div>':
    '<div class="topic-ribbon"><span>'+(index===0?"栽培管理研究重点":"品种选育研究重点")+'</span><strong>'+detail.route.map(x=>x[0]).join(' → ')+'</strong><p>'+(index===0?'肥料高效利用 · 精准灌溉 · 健康土壤培育。原资料另列土壤有机质提升1%以上为预期目标。':'选育性状：大粒、无核、有香味。结合干热河谷环境，评价新优品种的适应性。')+'</p></div>')+'</section>'
    ))+
    '<section class="research-panel"><article><p class="section-label">02 / 核心研究</p><h2>'+rows[1][0]+'</h2><p>'+rows[1][1]+'</p></article><article><p class="section-label">03 / 应用与展望</p><h2>'+rows[2][0]+'</h2><p>'+rows[2][1]+'</p></article><section class="deliverables"><p class="section-label">补充目标与阶段进展</p><div class="delivery-grid">'+enrichment.outputs.map(([value,label,status])=>'<div><span>'+status+'</span><strong>'+value+'</strong><p>'+label+'</p></div>').join("")+'</div><p class="impact">'+enrichment.impact+'</p></section><div class="exhibit-card"><p class="section-label">展品与项目资料</p><h3>'+detail.exhibit[0]+'</h3><p>'+detail.exhibit[1]+'</p></div><div class="project-meta"><p>资料列示经费 '+budget+' 万元'+(index===1?"":" · 人才培养 "+training)+'</p><p class="data-note">'+detail.note+'</p></div>'+
    (guide?'<button class="guide-link" id="open-guide"><span>配套资料</span><strong>葡萄种植指南 ↗</strong><small>24 页 · 轻触阅读</small></button>':"")+'</section>';
  byId("position").textContent=num(index)+" / 08";
  byId("previous").disabled=index===0;byId("next").disabled=index===7;
  byId("entrance").hidden=true;byId("poster").hidden=false;
  if(guide)byId("open-guide").onclick=()=>openViewer(guide.pages.map((url,i)=>({url,name:"葡萄种植指南 · 第 "+(i+1)+" 页",note:"配套手册，含郑州等地区成熟期及商业配套方案。第8页（印刷05）“瑞都科美”位于早熟栏目，正文写中熟，待核对；机构人数也存在27人与28人的版本差异。"})),0);
}
function showEntrance(){byId("poster").hidden=true;byId("entrance").hidden=false;delete document.body.dataset.theme;}
function imageContext(item) {
  if(item.note)return item.note;
  if(active===1)return "研究院背景资料；既有品种、机构与培训活动不直接计入本项目成果。旧展板常驻27人，手册写28人，资料口径待核对。";
  if(active===6 && /云钛2014|云钛2016|云钛封面/.test(item.name)){
    const certificate=item===materials[31] ? "本页许可证标注有效期至2017年02月21日。 " : "";
    return certificate+"历史企业画册，设备、产能、证书和专利按原页年份及范围理解，与本合作项目的预期成果分别说明。";
  }
  return "企业提供的项目或机构影像。照片说明以原始资料为依据，实物清单以资料列示为准。";
}
function renderViewer(){
  const item=viewerItems[viewerIndex];zoom=1;
  byId("large-photo").src=item.url;byId("large-photo").alt=item.name;
  byId("large-photo").style.width="100%";byId("photo-title").textContent=item.name;
  byId("photo-note").textContent=imageContext(item);
  byId("image-position").textContent=(viewerIndex+1)+" / "+viewerItems.length;
  byId("image-prev").disabled=viewerIndex===0;byId("image-next").disabled=viewerIndex===viewerItems.length-1;
  byId("zoom-out").disabled=true;byId("zoom-in").disabled=false;
  document.querySelector(".photo-scroll").scrollTo(0,0);
}
function openViewer(items,index){viewerItems=items;viewerIndex=index;renderViewer();byId("photo").showModal();}
function setZoom(value){zoom=Math.max(1,Math.min(3,value));byId("large-photo").style.width=(zoom*100)+"%";byId("zoom-out").disabled=zoom===1;byId("zoom-in").disabled=zoom===3;}
byId("entries").innerHTML=projects.map(([title],i)=>'<button data-project="'+i+'"><img src="'+images[i]+'" alt=""><span class="entry-number">'+num(i)+'</span><div><p>'+categories[groups[i]]+'</p><h2>'+title+'</h2><span>查看展板 ↗</span></div></button>').join("");
document.addEventListener("click",event=>{
  const entry=event.target.closest("[data-project]");if(entry){showProject(Number(entry.dataset.project));return;}
  const image=event.target.closest("[data-photo]");
  if(image){
    const chosen=posterImages(active);const picked=chosen[Number(image.dataset.photo)];
    const all=[...chosen,...relatedImages(active).filter(x=>!chosen.some(y=>y.url===x.url))];
    openViewer(all,all.findIndex(x=>x.url===picked.url));
  }
});
byId("home").onclick=showEntrance;byId("previous").onclick=()=>showProject(active-1);byId("next").onclick=()=>showProject(active+1);
byId("close-photo").onclick=()=>byId("photo").close();
byId("image-prev").onclick=()=>{viewerIndex--;renderViewer();};byId("image-next").onclick=()=>{viewerIndex++;renderViewer();};
byId("zoom-in").onclick=()=>setZoom(zoom+.5);byId("zoom-out").onclick=()=>setZoom(zoom-.5);
document.querySelector(".fullscreen").onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.querySelector(".fullscreen").textContent="按 F11 全屏";}};

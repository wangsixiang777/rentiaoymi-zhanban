
const historicalPatents = [
  { name: "钛板卷退火工艺", number: "ZL200910157794.1" },
  { name: "一种在EB炉熔炼冷床上建立凝壳的工艺方法", number: "ZL201210463005.9" },
  { name: "一种“两端设点”熔炼纯钛的方法", number: "ZL201310414538.2" }
];
function sourceCrop(id, box, caption) {
  const item=materials[id];
  const size=id===27 ? [1751,875] : [1258,1718];
  return '<button class="source-crop" data-source="'+id+'" aria-label="查看原页，'+esc(caption)+'"><svg viewBox="'+box.join(" ")+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="'+item.url+'" width="'+size[0]+'" height="'+size[1]+'"/></svg><span>原页 ↗</span></button>';
}
function breedingTimeline() {
  return '<div class="breeding-timeline">'+[["4月","元谋","利用反季节优势"],["6—7月","楚雄","利用早熟优势"],["8—9月","郑州","结合中部气候条件"]].map(([time,place,text])=>'<article><strong>'+time+'</strong><h3>'+place+'</h3><p>'+text+'</p></article>').join("")+'</div>';
}
function varietyPictures() {
  const crops=[[[1030,235,200,260],"中葡金香"],[[1245,235,220,260],"中葡红秀"],[[1030,520,300,245],"中葡魅影"]];
  return '<div class="variety-pictures">'+crops.map(([box,name])=>'<figure>'+sourceCrop(27,box,name)+'<figcaption>'+name+' · 原海报列示品种</figcaption></figure>').join("")+'</div>';
}
function resourceVisual(index) {
  if(index===1) {
    return '<section class="visual-panel resource-visual"><section class="breeding-feature"><div class="resource-heading"><div><p class="section-label">研究院既有研究基础</p><h2>一年三代评价 · 葡萄育种模式</h2></div><button data-detail="breeding">查看育种模式 ↗</button></div>'+breedingTimeline()+varietyPictures()+'<p class="resource-note">依据原海报整理，机构既有品种与本项目预期新品种分别统计。</p></section><section class="platform-strip"><div><p class="section-label">合作与科研基础</p><h3>种质资源 · 育种研究 · 检测支撑</h3><p>原资料列示高校院所实验室与地方检测平台合作，为品种评价和示范提供研究基础。</p></div><button data-detail="platform">查看科研基础 ↗</button></section></section>';
  }
  if(index===6) {
    return '<section class="visual-panel resource-visual"><div class="resource-heading"><div><p class="section-label">2014企业画册 · 历史研发条件</p><h2>检测设备与企业技术基础</h2></div><button data-detail="facilities">查看研发条件 ↗</button></div><figure class="equipment-hero">'+sourceCrop(34,[180,735,380,245],"图像分析仪")+'<figcaption>图像分析仪 · 企业历史画册影像</figcaption></figure><div class="equipment-pair"><figure>'+sourceCrop(34,[565,1035,285,260],"X射线衍射仪")+'<figcaption>X射线衍射仪</figcaption></figure><figure>'+sourceCrop(34,[735,1340,290,270],"透射电子显微镜")+'<figcaption>透射电子显微镜</figcaption></figure></div><section class="patent-strip"><div class="resource-heading"><div><p class="section-label">企业历史技术积累</p><h3>代表性专利资料</h3></div><button data-detail="patents">查看专利资料 ↗</button></div><p>钛板卷退火、EB炉工艺等历史专利。来源为企业画册，与本项目预期申报、授权分别说明。</p></section></section>';
  }
  return "";
}
function platformPage() {
  return '<p class="detail-eyebrow">研究院背景资料 · 根据原有科研平台海报整理</p><h2 class="route-title">合作与科研基础</h2><div class="platform-cards">'+[
    ["种质与育种研究","果蔬园艺作物种质创新与利用全国重点实验室、国家园艺种质资源库及国家葡萄种质资源圃等平台，列示于原海报的实验室支撑部分。"],
    ["地方检测合作","原资料列示与楚雄州检验检测认证院实验室共建，涉及农产品与食品检测，为科研及田间示范提供实验条件。"],
    ["多方科研合作","原海报列示与云南农业大学、西北农林科技大学、湖南农业大学等机构合作，内容涉及项目申报、种质保存和成果转化等不同工作。"]
  ].map(([title,text])=>'<article><h3>'+title+'</h3><p>'+text+'</p></article>').join("")+'</div><div class="resource-reading-note">本页说明研究院已有合作与平台基础，各机构并非全部属于当前单项项目的合同合作单位。原海报中的设备与机构统计口径按原资料范围理解。</div><button class="original-link" data-source="26">查看科研平台海报原页 ↗</button>';
}
function renderResourcePage(kind,page) {
  if(kind==="platform")return platformPage();
  if(kind==="breeding") {
    return '<p class="detail-eyebrow">研究院既有育种模式 · 来源为“南繁北育”原海报</p><h2 class="route-title">利用不同地区的季节优势，开展一年三代评价</h2>'+breedingTimeline()+varietyPictures()+'<div class="resource-reading-note">原海报介绍在元谋、楚雄与郑州开展评价，并列示中葡金香、中葡红秀、中葡魅影。上述内容作为机构既有研究基础展示，本项目“预期培育2—3个新品种”另按项目简介统计。</div><button class="original-link" data-source="27">查看育种模式海报原页 ↗</button>';
  }
  if(kind==="patents") {
    return '<p class="detail-eyebrow">2014企业画册 · 历史资料摘录</p><h2 class="route-title">企业历史专利资料</h2><div class="patent-cards">'+historicalPatents.map(patent=>'<article><span>发明专利 · 原画册列为授权</span><h3>'+esc(patent.name)+'</h3><p>'+patent.number+'</p><button data-source="50">查看清单原页 ↗</button></article>').join("")+'</div><div class="resource-reading-note">名称、号码及状态依据企业历史画册原页整理。当前法律状态需另行核验；本页资料不计入本次残钛项目“预期申报4项、授权2项”的完成数量。</div><div class="original-actions"><button data-source="50">查看完整历史清单 ↗</button><button data-source="42">查看历史证书与荣誉原页 ↗</button></div>';
  }
  if(page===1) {
    return '<p class="detail-eyebrow">2014企业画册 · 钛材加工背景</p><h2 class="route-title">企业历史生产流程</h2><div class="historical-process">'+sourceCrop(51,[45,200,1160,530],"热轧卷板生产流程")+'</div><div class="resource-reading-note">原页包含热轧卷板、冷轧卷板及热轧圆盘条生产流程，起点包括海绵钛与EB炉等企业生产环节。本次项目研究对象为高氧残钛料及NaCl-KCl熔盐电解，本页用于解释企业生产背景。</div><button class="original-link" data-source="51">查看三组生产流程原页 ↗</button>';
  }
  return '<p class="detail-eyebrow">2014企业画册 · 企业历史研发条件</p><h2 class="route-title">检测与分析设备</h2><div class="equipment-detail-grid">'+[
    [[180,735,380,245],"图像分析仪","原画册中的企业检测设备影像。"],
    [[565,1035,285,260],"X射线衍射仪","原页列示的检测分析设备。"],
    [[735,1340,290,270],"透射电子显微镜","原页列示的显微分析设备。"]
  ].map(([box,name,text])=>'<article>'+sourceCrop(34,box,name)+'<h3>'+name+'</h3><p>'+text+'</p></article>').join("")+'</div><div class="resource-reading-note">这些影像说明企业历史研发条件，原资料未逐台确认其参与本次残钛项目的情况。设备名称依照画册图注保留。</div><button class="original-link" data-source="34">查看检测设备画册原页 ↗</button>';
}

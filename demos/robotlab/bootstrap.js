/* Portfolio-only visitor demo. No production account or cloud storage is accessed. */
(async()=>{
const owner='portfolio-visitor';
const key='ph-robotlab-showcase-v20261103';
window.learningSession={user:{id:owner,name:'访客演示',email:''},storage:false};
try{const saved=JSON.parse(localStorage.getItem(key)||'null');window.learningData=saved?.schema===1&&saved?.ownerId===owner?saved:null}catch{window.learningData=null}
window.learningSyncStatus='作品集演示 · 仅本机保存';
window.learningSaveError='';
window.queueLearningSave=data=>{try{localStorage.setItem(key,JSON.stringify(data));window.learningSyncStatus='作品集演示 · 已保存到本机'}catch{window.learningSyncStatus='作品集演示 · 仅当前页面保留'}const status=document.getElementById('syncStatus');if(status)status.textContent=window.learningSyncStatus};
window.flushLearningSave=async()=>true;
try{
const scripts=["catalog-data.js", "drawing.js", "app.js", "catalog.js", "analytics-data.js", "analytics.js", "remediation-data.js", "remediation.js", "ai-workbench.js", "robot-nodes-model.js", "robot-nodes.js", "unified.js", "vision-nodes-model.js", "review-examples.js", "review-dashboard.js", "vision-nodes.js", "practice-library.js"];
for(const src of scripts)await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>reject(Error('组件加载失败，请刷新页面重试。'));document.body.append(script)});
document.getElementById('app').hidden=false;document.getElementById('accountGate')?.remove();
}catch(error){const gate=document.getElementById('accountGate');gate.textContent=error.message}
})();

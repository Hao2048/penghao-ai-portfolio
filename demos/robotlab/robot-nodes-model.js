/* Deterministic teaching interpreter; virtual poses, no hardware or collision solver. */
const RobotNodes=(()=>{
const types={start:{label:'开始',kind:'flow'},loop:{label:'遍历已知零件',kind:'flow'},open:{label:'张开夹爪',kind:'grip'},approach:{label:'移动至接近点',kind:'motion',method:'MoveJ'},descend:{label:'直线下降到抓取点',kind:'motion',method:'MoveL'},close:{label:'闭合夹爪 · 抓取',kind:'grip'},lift:{label:'直线抬升',kind:'motion',method:'MoveL'},classify:{label:'按类别选择料框',kind:'logic'},transfer:{label:'移动至料框上方',kind:'motion',method:'MoveJ'},lower:{label:'下降到放置点',kind:'motion',method:'MoveL'},release:{label:'张开夹爪 · 放置',kind:'grip'},retreat:{label:'直线撤离',kind:'motion',method:'MoveL'},loopEnd:{label:'下一个零件',kind:'flow'},home:{label:'返回安全初始位',kind:'motion',method:'MoveJ'},end:{label:'结束',kind:'flow'}};
const copy=x=>JSON.parse(JSON.stringify(x)),home=[-65,-75,180],bins={A:[135,-60,12],B:[135,50,12]};
function arrange(p){p.nodes.forEach((n,i)=>{const row=Math.floor(i/3),col=row%2?2-i%3:i%3;n.x=30+col*202;n.y=38+row*116});return p}
function sample(c){const order=['start','loop','open','approach','descend','close','lift','classify','transfer','lower','release','retreat','loopEnd','home','end'],nodes=order.map((type,i)=>({id:'n'+i,type,x:0,y:0,height:Math.max(80,c.safeHeight),speed:Math.min(30,c.speedCap),mapping:{circle:c.mapping.circle,square:c.mapping.square}}));for(let i=0;i<nodes.length-1;i++)nodes[i].next=nodes[i+1].id;nodes[1].body='n2';nodes[1].done='n13';delete nodes[1].next;nodes[12].next='n1';delete nodes[14].next;return arrange({version:1,nodes})}
function empty(){return {version:1,nodes:[{id:'start',type:'start',x:30,y:38},{id:'end',type:'end',x:434,y:154}]}}
function compile(program,c,parts){
const errors=[],ops=[],visited=new Set(),nodes=program?.nodes||[],map=new Map(nodes.map(n=>[n.id,n]));const fail=(n,message)=>{throw {nodeId:n?.id,message}};
let point=copy(home),held=null,bin=null,grip=false,index=-1,items=[],maxSpeed=0,minHeight=Infinity,finished=false;const loopCount=new Map();
try{
if(nodes.length>40)fail(null,'节点数量最多为 40 个。');if(map.size!==nodes.length)fail(null,'节点 ID 重复。');if(nodes.filter(n=>n.type==='start').length!==1)fail(null,'需要且只能有一个开始节点。');if(nodes.filter(n=>n.type==='loop').length!==1)fail(null,'需要且只能有一个零件遍历节点。');if(nodes.filter(n=>n.type==='end').length!==1)fail(null,'需要且只能有一个结束节点。');if(!parts.length)fail(null,'当前案例没有给定位姿。');
let n=nodes.find(n=>n.type==='start');let guard=0;while(n){if(++guard>600)fail(n,'流程存在无法结束的循环；仅支持「下一个零件」返回遍历节点。');if(!types[n.type])fail(n,'未知节点类型。');visited.add(n.id);const type=n.type,part=parts[index],p=copy(point);let edge='next';
if(type==='loop'){let count=loopCount.get(n.id)||0;if(count!==0&&ops.at(-1)?.type!=='loopEnd')fail(n,'遍历入口只能从开始流程或「下一个零件」进入。');if(index>=0&&held!==null)fail(n,'进入下一个零件前必须释放当前零件。');index=count;if(count<parts.length){loopCount.set(n.id,count+1);bin=null;edge='body'}else edge='done'}
else if(type==='open'){if(held!==null)fail(n,'夹持零件时不能在途中张开夹爪；请先到料框放置点。');grip=false}
else if(['approach','descend','close','lift','classify','transfer','lower','release','retreat','loopEnd'].includes(type)&&!part)fail(n,'该节点需要遍历节点提供当前零件。');
if(types[type].kind==='motion'){
const speed=Number(n.speed);if(!Number.isFinite(speed)||speed<1||speed>100)fail(n,'运动速度应为 1–100%。');maxSpeed=Math.max(maxSpeed,speed);
if(['approach','lift','transfer','retreat'].includes(type)){const h=Number(n.height);if(!Number.isFinite(h)||h<c.safeHeight||h>180)fail(n,`安全高度应为 ${c.safeHeight}–180 mm。`);minHeight=Math.min(minHeight,h)}
if(type==='approach'){if(held!==null||grip)fail(n,'接近新零件前需要张开空夹爪。');if(point[2]<c.safeHeight)fail(n,'横向接近前需要先抬升至安全高度。');point=[part.wx,part.wy,+n.height]}
if(type==='descend'){if(grip||held!==null||point[0]!==part.wx||point[1]!==part.wy)fail(n,'下降前需在当前零件上方，且夹爪张开。');point=[part.wx,part.wy,12]}
if(type==='lift'){if(held===null)fail(n,'抬升前需要在抓取点闭合夹爪。');point=[point[0],point[1],+n.height]}
if(type==='transfer'){if(held===null||!bin)fail(n,'转移前需抓取零件，并用分类节点确定目标料框。');if(point[2]<c.safeHeight)fail(n,'横向转移前必须先抬升，不能贴着台面移动。');point=[bins[bin][0],bins[bin][1],+n.height]}
if(type==='lower'){if(held===null||!bin||point[0]!==bins[bin][0]||point[1]!==bins[bin][1])fail(n,'放置下降前需到达目标料框上方，并保持夹持。');point=copy(bins[bin])}
if(type==='retreat'){if(held!==null||!bin)fail(n,'撤离前需要在料框放置点释放零件。');point=[point[0],point[1],+n.height]}
if(type==='home'){if(held!==null)fail(n,'返回初始位前必须完成释放。');if(point[2]<c.safeHeight)fail(n,'返回初始位前必须先直线撤离至安全高度。');point=copy(home)}
}
if(type==='close'){if(grip||held!==null||point[0]!==part.wx||point[1]!==part.wy||point[2]!==12)fail(n,'闭合抓取需要到达当前零件抓取点，且夹爪为空。');held=index;grip=true}
if(type==='classify'){if(held===null)fail(n,'分类节点需要已夹持的当前零件。');if(!n.mapping||!['A','B'].includes(n.mapping[part.shape]))fail(n,'请为每个零件类别配置有效料框。');bin=n.mapping[part.shape]}
if(type==='release'){if(held===null||!bin||point.some((v,i)=>v!==bins[bin][i]))fail(n,'只能在目标料框放置点张开夹爪释放。');if(items.some(i=>i.index===index))fail(n,'同一零件不能重复计入任务。');items.push({index,id:part.id,shape:part.shape,picked:true,bin,correct:bin===c.mapping[part.shape]});held=null;grip=false}
if(type==='loopEnd'){if(held!==null||!items.some(i=>i.index===index)||point[2]<c.safeHeight)fail(n,'循环结束前应完成放置并撤离至安全高度。');if(map.get(n.next)?.type!=='loop')fail(n,'「下一个零件」必须连接回遍历节点。')}
if(type==='end'){if(items.length!==parts.length||held!==null)fail(n,'结束前必须逐一完成全部零件搬运。');if(point.some((v,i)=>v!==home[i]))fail(n,'结束前应回到安全初始位。');finished=true}
ops.push({nodeId:n.id,type,partIndex:index,from:p,to:copy(point),held,grip,bin,items:copy(items),speed:+n.speed||30});if(finished)break;const nextId=n[edge];if(!nextId||!map.has(nextId))fail(n,`「${types[type].label}」的${edge==='body'?'循环体':edge==='done'?'完成出口':'执行出口'}尚未连接有效节点。`);n=map.get(nextId);
}
if(!finished)fail(null,'流程没有到达结束节点。');const orphan=nodes.find(n=>!visited.has(n.id));if(orphan)fail(orphan,'此节点未接入可执行流程，请连接或删除。');
}catch(e){errors.push({nodeId:e.nodeId||null,message:e.message||'节点结构无效。'})}
return errors.length?{errors,ops:[]}:{errors,ops,items,height:Number.isFinite(minHeight)?minHeight:0,speed:maxSpeed,mapping:copy(nodes.find(n=>n.type==='classify')?.mapping||c.mapping)}
}
return {types,home,bins,sample,empty,arrange,compile};})();
if(typeof module!=='undefined')module.exports=RobotNodes;

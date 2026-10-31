const COURSE_SEEDS=[
{id:'cv-basic',domain:'vision',name:'机器视觉基础',subtitle:'从像素理解到目标轮廓',level:'基础',code:'CV101',icon:'vision',chapters:['图像分割','轮廓筛选','颜色空间','预处理'],description:'建立图像处理基础，通过阈值与轮廓实验理解参数如何影响检测结果。'},
{id:'cv-inspect',domain:'vision',name:'工业视觉检测',subtitle:'让检测结果有据可依',level:'进阶',code:'CV201',icon:'vision',chapters:['表面缺陷','边缘特征','定位匹配','检测评估'],description:'围绕工业检测任务，设计缺陷判断、定位与结果验证方案。'},
{id:'cv-measure',domain:'vision',name:'视觉测量与标定',subtitle:'从图像坐标到量化结果',level:'进阶',code:'CV202',icon:'chart',chapters:['相机标定','几何测量','误差分析','多视图'],description:'掌握像素与实际尺寸的关系，分析标定、测量与坐标转换中的误差。'},
{id:'rm-basic',domain:'robot',name:'机械臂操作基础',subtitle:'理解坐标，掌握安全操作',level:'基础',code:'RM101',icon:'robot',chapters:['抓取基础','运动参数','工具设置','示教操作'],description:'使用已知位姿进行机械臂操作，学习抓取、点动与运动参数设置。'},
{id:'rm-sort',domain:'robot',name:'机械臂抓取与分拣',subtitle:'把操作组织成可靠任务',level:'进阶',code:'RM201',icon:'robot',chapters:['分类规则','批量抓取','路径优化','异常处理'],description:'独立完成已知零件的分类放置，并对效率与执行规范进行分析。'},
{id:'rm-process',domain:'robot',name:'机械臂工艺应用',subtitle:'从基本动作走向工艺实践',level:'综合',code:'RM301',icon:'cube',chapters:['装配工艺','轨迹工艺','协同操作','质量复核'],description:'为装配、插接、轨迹跟随等工艺任务设计参数与操作方案。'}];
// Each entry is a distinct teaching brief. Plan tasks use a task-specific answer sheet, never the threshold or sorting simulator.
const TASK_GROUPS=[
[
['固定阈值下的零件分割','调整二值化阈值，完整分离背景与四个零件。','阈值选择,前景分离','vision','基础',25,{tmin:85,tmax:150}],
['小目标轮廓面积筛选','比较面积阈值对小零件保留情况的影响。','轮廓提取,面积筛选','vision','基础',25,{amin:200,amax:1400}],
['Otsu 自动阈值对比','使用自动阈值，检查轮廓并解释与手动方法的差异。','Otsu,结果解释','vision','基础',30,{method:'otsu'}],
['灰度直方图与曝光分析','分析灰度分布，为不同曝光条件选择处理策略。','灰度统计,曝光分析','plan','基础',30,{schema:'histogram'}],
['HSV 颜色区间分割','设计颜色分割区间，区分不同颜色的工业零件。','HSV,色彩分割','plan','基础',35,{schema:'hsv'}],
['彩色物料的多类别掩膜','为三类颜色分别定义掩膜与冲突处理规则。','多类掩膜,颜色规则','plan','进阶',40,{schema:'multicolor'}],
['高斯滤波与边缘保留','比较去噪强度与边缘保留效果，选择合适滤波参数。','去噪,高斯滤波','plan','基础',30,{schema:'gaussian'}],
['开闭运算消除噪点','选择结构元素与迭代次数，处理孔洞和孤立噪点。','形态学,结构元素','plan','进阶',35,{schema:'morphology'}]
],[
['金属表面划痕检测','设计细长划痕候选区域的提取与判定规则。','缺陷检测,区域筛选','plan','进阶',40,{schema:'scratch'}],
['装配件缺失检查','通过参考位置与区域占用率判断装配件是否缺失。','区域检测,缺失判断','plan','基础',35,{schema:'presence'}],
['Canny 双阈值边缘检测','比较高低阈值与边缘连接性，提交参数与分析。','Canny,边缘连接','plan','进阶',35,{schema:'canny'}],
['圆形零件边缘拟合','为圆形目标设定半径范围与拟合残差限值。','圆拟合,几何特征','plan','进阶',40,{schema:'circle'}],
['旋转工件模板匹配','设置旋转搜索范围与匹配阈值，定位旋转工件。','模板匹配,旋转定位','plan','进阶',45,{schema:'match'}],
['孔位中心定位方案','设计多孔工件的孔位提取及位置偏差判定方法。','特征定位,中心提取','plan','进阶',40,{schema:'holes'}],
['检测结果的准确率与召回率','依据给定标注统计漏检和误检，制定评价规则。','召回率,误检分析','plan','综合',45,{schema:'metrics'}],
['光照变化下的检测鲁棒性','设计跨光照验证集与稳定性评价方案。','光照变化,鲁棒性','plan','综合',45,{schema:'lighting'}]
],[
['棋盘格相机内参标定','设置标定板规格、采样数量与重投影误差限值。','内参标定,重投影误差','plan','进阶',45,{schema:'calibration'}],
['镜头畸变校正方案','分析径向畸变，设计校正与对照验证流程。','畸变校正,几何验证','plan','进阶',40,{schema:'distortion'}],
['零件外径的像素尺寸换算','通过已知尺度建立像素与毫米的比例关系。','比例标定,外径测量','plan','基础',35,{schema:'diameter'}],
['多孔工件孔距测量','测量孔中心间距并设置尺寸公差判定规则。','孔距,公差判定','plan','进阶',40,{schema:'distance'}],
['平面坐标转换误差分析','比较转换前后坐标偏差，分析误差来源。','坐标转换,误差分析','plan','进阶',45,{schema:'transform'}],
['重复测量的一致性评价','设计重复采样与统计规则，评价测量稳定性。','重复性,统计分析','plan','进阶',40,{schema:'repeat'}],
['双目视差与深度估计','分析基线、焦距与视差对深度估计的影响。','双目,深度估计','plan','综合',50,{schema:'stereo'}],
['平面单应性透视校正','设置对应点，设计透视校正与尺寸验证方案。','单应性,透视校正','plan','综合',45,{schema:'homography'}]
],[
['已知位姿下的基础抓取','从给定坐标出发，完成两个零件的抓取放置。','给定位姿,夹爪控制','robot','基础',30,{pieces:2}],
['接近高度与安全抓取','比较接近高度对抓取执行结果的影响。','接近高度,安全规范','robot','基础',30,{safeHeight:80}],
['运动速度与操作规范','在速度约束下完成多零件抓取，记录运行结果。','速度设置,操作规范','robot','基础',35,{speedCap:30}],
['关节空间与末端坐标对照','制定关节点动与末端位姿变化的观察记录。','关节点动,正向运动学','plan','基础',35,{schema:'joint'}],
['TCP 工具中心点设置','设定工具偏置，分析工具中心点对操作的影响。','TCP,工具偏置','plan','进阶',40,{schema:'tcp'}],
['夹爪开合与夹持力设置','为不同材料设定夹爪开度与夹持力参数。','夹爪,夹持策略','plan','基础',30,{schema:'gripper'}],
['多点示教与轨迹顺序','组织多个示教点，规划接近、作业与撤离顺序。','示教点,动作编排','plan','基础',35,{schema:'teach'}],
['基座与工具坐标系点动','比较不同参考系下的点动方向与末端位移。','坐标系,点动方向','plan','进阶',40,{schema:'frame'}]
],[
['圆形与方形零件分类','按照给定规则把四个零件放入两个料框。','分类放置,批量抓取','robot','基础',40,{}],
['反向料框规则分拣','根据变化后的料框规则重新配置分类策略。','规则切换,策略调整','robot','进阶',40,{mapping:{circle:'B',square:'A'}}],
['同框归集与批量搬运','按任务要求将不同类别零件放入同一目标料框。','归集策略,搬运','robot','基础',35,{mapping:{circle:'A',square:'A'}}],
['指定顺序的批量抓取','按照物料清单设计抓取次序，避免遗漏与重复。','任务顺序,物料清单','plan','进阶',40,{schema:'sequence'}],
['多层码垛位置规划','根据行列和层高生成码垛位姿与放置顺序。','码垛,位置生成','plan','进阶',45,{schema:'pallet'}],
['避障中间点与搬运路径','为已知障碍设计中间点与撤离路径。','避障,中间点','plan','综合',45,{schema:'waypoint'}],
['抓取失败后的重试策略','设计失败检测、重试次数与异常退出条件。','异常恢复,重试','plan','综合',40,{schema:'retry'}],
['空料框与满料框处理','设计料框容量检查与任务切换策略。','容量检测,任务切换','plan','进阶',35,{schema:'capacity'}]
],[
['轴孔装配的接近与插入','为轴孔装配设计接近、对齐与插入阶段参数。','轴孔装配,工艺阶段','plan','综合',50,{schema:'insertion'}],
['柔顺装配的力阈值方案','制定接触力阈值与超限后的退让处理。','柔顺控制,力阈值','plan','综合',50,{schema:'force'}],
['平面涂胶轨迹规划','设定轨迹点、运行速度与拐角处理方式。','轨迹跟随,涂胶','plan','进阶',45,{schema:'glue'}],
['工件边缘打磨路径','为已知工件边缘设计打磨路径和工艺参数。','打磨,路径规划','plan','综合',50,{schema:'polish'}],
['双工位上下料切换','编排两工位间的上下料顺序与等待条件。','上下料,状态切换','plan','进阶',45,{schema:'station'}],
['夹具与机械臂互锁方案','设计夹具、机械臂与设备之间的信号互锁。','互锁,I/O','plan','综合',45,{schema:'interlock'}],
['工艺节拍拆分与优化','分析各动作阶段耗时，提出节拍改进方案。','节拍分析,动作优化','plan','综合',45,{schema:'cycle'}],
['装配质量复核与记录','制定工艺完成判据及异常工件的复核记录。','质量复核,过程记录','plan','综合',40,{schema:'quality'}]
]];
const TASK_LIBRARY=TASK_GROUPS.flatMap((group,g)=>group.map((a,i)=>({id:(g<3?'CV':'RM')+'-'+String(g%3+1)+String(i+1).padStart(2,'0'),courseId:COURSE_SEEDS[g].id,domain:COURSE_SEEDS[g].domain,chapter:COURSE_SEEDS[g].chapters[Math.floor(i/2)],name:a[0],description:a[1],skills:a[2].split(','),engine:a[3],level:a[4],minutes:a[5],preset:a[6],schema:a[6].schema||'',objectives:[a[1],a[3]==='plan'?'提交任务专属参数方案与选择依据。':'调整参数并运行，提交结果与分析。','根据任务要求说明验证方法及误差来源。']})));
const PARAM_SCHEMAS={
histogram:[['exposure','曝光时间','number',8000,'μs'],['bins','直方图分组','select','256','',['64','128','256']]],hsv:[['hmin','色相下限 H','number',15,'°'],['hmax','色相上限 H','number',40,'°'],['smin','饱和度下限 S','number',80,'/255']],multicolor:[['classes','颜色类别数','number',3,'类'],['overlap','掩膜冲突处理','select','最大响应','',['最大响应','类别优先级','标记歧义']]],gaussian:[['kernel','高斯核尺寸','select','5×5','',['3×3','5×5','7×7']],['sigma','标准差 σ','number',1.2,'']],morphology:[['operation','形态学操作','select','开运算','',['开运算','闭运算','先开后闭']],['kernel','结构元素尺寸','select','3×3','',['3×3','5×5','7×7']],['iterations','迭代次数','number',1,'次']],scratch:[['length','最短划痕长度','number',15,'px'],['ratio','最小长宽比','number',4,'']],presence:[['occupancy','最小区域占用率','number',75,'%'],['regions','检测区域数','number',4,'个']],canny:[['low','低阈值','number',50,'/255'],['high','高阈值','number',150,'/255']],circle:[['radiusMin','最小半径','number',15,'px'],['radiusMax','最大半径','number',45,'px'],['residual','最大拟合残差','number',2,'px']],match:[['angle','旋转搜索范围','number',180,'°'],['score','最低匹配分数','number',0.8,'']],holes:[['radius','参考孔半径','number',8,'px'],['deviation','最大中心偏差','number',2,'px']],metrics:[['samples','验证样本数','number',100,'张'],['recall','目标召回率','number',95,'%']],lighting:[['conditions','光照条件数','number',5,'组'],['variation','允许结果波动','number',5,'%']],calibration:[['rows','棋盘格内角点行数','number',6,'行'],['columns','内角点列数','number',9,'列'],['error','重投影误差限值','number',0.5,'px']],distortion:[['model','畸变模型','select','径向与切向','',['径向','径向与切向']],['error','校正残差限值','number',1,'px']],diameter:[['scale','像素尺度','number',0.1,'mm/px'],['tolerance','外径公差','number',0.2,'mm']],distance:[['reference','参考孔距','number',40,'mm'],['tolerance','孔距公差','number',0.1,'mm']],transform:[['pairs','对应点数量','number',9,'对'],['error','允许转换误差','number',0.5,'mm']],repeat:[['samples','重复测量次数','number',30,'次'],['std','标准差限值','number',0.05,'mm']],stereo:[['baseline','双目基线','number',120,'mm'],['focal','相机焦距','number',800,'px']],homography:[['pairs','对应点数量','number',4,'对'],['error','校正误差限值','number',1,'px']],joint:[['joint','观察关节','select','J1','',['J1','J2','J3','J4','J5','J6']],['step','点动步长','number',5,'°']],tcp:[['offsetX','工具 X 偏置','number',0,'mm'],['offsetZ','工具 Z 偏置','number',120,'mm']],gripper:[['width','夹爪开度','number',35,'mm'],['force','夹持力','number',20,'N']],teach:[['points','示教点数量','number',6,'个'],['blend','过渡半径','number',5,'mm']],frame:[['frame','参考坐标系','select','基座坐标系','',['基座坐标系','工具坐标系']],['step','点动步长','number',5,'mm']],sequence:[['order','抓取排序规则','select','按编号升序','',['按编号升序','按距离由近及远','按类别分组']],['batch','单批任务数','number',4,'个']],pallet:[['rows','码垛行数','number',3,'行'],['layers','码垛层数','number',2,'层'],['height','层高','number',25,'mm']],waypoint:[['points','中间点数量','number',3,'个'],['clearance','最小避障间距','number',30,'mm']],retry:[['retries','最大重试次数','number',2,'次'],['timeout','单次超时','number',5,'s']],capacity:[['capacity','料框容量','number',10,'个'],['strategy','满框处理','select','切换备用料框','',['切换备用料框','暂停并等待','结束任务']]],insertion:[['depth','插入深度','number',20,'mm'],['speed','插入速度','number',5,'mm/s']],force:[['force','接触力阈值','number',15,'N'],['retreat','超限退让距离','number',5,'mm']],glue:[['speed','涂胶速度','number',25,'mm/s'],['blend','拐角过渡半径','number',3,'mm']],polish:[['passes','打磨遍数','number',2,'遍'],['speed','工艺速度','number',20,'mm/s']],station:[['stations','工位数量','number',2,'个'],['wait','等待设备信号超时','number',10,'s']],interlock:[['signal','启动前互锁信号','select','夹具已锁紧','',['夹具已锁紧','设备就绪','全部条件满足']],['timeout','信号超时','number',5,'s']],cycle:[['target','目标节拍','number',20,'s'],['wait','允许等待时间','number',2,'s']],quality:[['samples','抽检数量','number',10,'件'],['tolerance','质量公差','number',0.2,'mm']]};
function configForTask(task,initial){const c=JSON.parse(JSON.stringify(initial[task.domain]));Object.assign(c,{name:task.name,course:COURSE_SEEDS.find(x=>x.id===task.courseId).name,courseId:task.courseId,description:task.description,minutes:task.minutes,templateId:task.id,engine:task.engine,objectives:task.objectives});Object.assign(c,task.preset);if(task.preset.method==='otsu'){c.rubric[0].on=false;c.rubric[1].weight=40;c.rubric[2].weight=45}if(task.engine==='plan'){c.fields=Object.fromEntries(PARAM_SCHEMAS[task.schema].map(f=>[f[0],f[3]]));c.rubric=[{id:'analysis',name:'参数方案与任务分析',detail:'教师根据任务参数、方案说明和验证依据综合评阅',weight:100,on:true}]}return c}
function loadCatalog(initial){const parse=k=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}};const existing=parse('robotlab-teaching-v3');if(existing?.cases?.length&&existing.courses?.length)return existing;const next={schema:3,courses:JSON.parse(JSON.stringify(COURSE_SEEDS)),cases:[],attempts:{},records:[]};COURSE_SEEDS.forEach(course=>TASK_LIBRARY.filter(t=>t.courseId===course.id).slice(0,3).forEach((t,i)=>{const d=configForTask(t,initial);next.cases.push({id:'case-'+t.id.toLowerCase(),domain:t.domain,courseId:course.id,templateId:t.id,created:Date.now(),updated:Date.now(),draft:d,published:{...JSON.parse(JSON.stringify(d)),version:1,publishedAt:Date.now()}})}));for(const course of [COURSE_SEEDS[1],COURSE_SEEDS[4]]){const t=TASK_LIBRARY.filter(t=>t.courseId===course.id)[3];next.cases.push({id:'draft-'+t.id.toLowerCase(),domain:t.domain,courseId:course.id,templateId:t.id,created:Date.now(),updated:Date.now(),draft:configForTask(t,initial),published:null})}const old=parse('robotlab-teaching-v2');if(old?.draft&&old?.published){for(const k of ['vision','robot']){const courseId=k==='vision'?'cv-basic':'rm-sort',id=k==='vision'?'case-cv-101':'case-rm-201',entry=next.cases.find(c=>c.id===id);if(!entry)continue;const base=entry.draft;entry.draft={...base,...old.draft[k],course:COURSE_SEEDS.find(c=>c.id===courseId).name,courseId};entry.published={...base,...old.published[k],course:entry.draft.course,courseId};if(old.attempts?.[k]){const a=old.attempts[k];a.caseId=id;a.courseId=courseId;a.mode='exam';a.config={...entry.published,...a.config,courseId};next.attempts[id+':exam']=a}for(const r of old.records||[]){if(r.domain===k)next.records.push({...r,caseId:id,courseId,mode:'exam'})}}}return next}

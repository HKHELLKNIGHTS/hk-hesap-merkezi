
const tg=window.Telegram?.WebApp||null;
try{tg?.ready();tg?.expand();tg?.setHeaderColor('#050302');tg?.setBackgroundColor('#050302')}catch(e){}
function haptic(type='light'){try{tg?.HapticFeedback?.impactOccurred(type)}catch(e){}}
const $=id=>document.getElementById(id);
const setPos=(el,l,t,w,h)=>Object.assign(el.style,{left:l+'%',top:t+'%',width:w+'%',height:h+'%'});

const screens=['speed','train','troops','rally'];
function showScreen(id){screens.forEach(s=>$(s).classList.toggle('active',s===id));window.scrollTo(0,0);haptic('light');try{id==='speed'?tg?.BackButton?.hide():tg?.BackButton?.show()}catch(e){}}
try{tg?.BackButton?.onClick(()=>showScreen('speed'))}catch(e){}
const navY={speed:23.8,train:22.5,troops:22.5,rally:22.5};
for(const sid of screens){const y=navY[sid];[['speed',2],['train',26],['troops',50],['rally',74]].forEach(([to,x])=>{const b=document.createElement('button');b.className='hot';setPos(b,x,y,24,5.9);b.onclick=()=>showScreen(to);$(sid).appendChild(b)})}

// SPEED
const SPEEDS=[['1m',1],['3m',3],['5m',5],['10m',10],['15m',15],['30m',30],['60m',60],['3h',180],['8h',480],['15h',900],['24h',1440],['3d',4320],['7d',10080],['30d',43200]];
const speedY=[40.38,44.62,48.86,53.10,57.34,61.58,65.82];
function makeField(parent,id,l,t,w,h){const i=document.createElement('input');i.id=id;i.className='field';i.type='text';i.inputMode='numeric';i.placeholder='0';setPos(i,l,t,w,h);parent.appendChild(i)}
speedY.forEach((y,i)=>makeField($('speedInputs'),'sp'+i,24.55,y,21.20,3.62));
speedY.forEach((y,i)=>makeField($('speedInputs'),'sp'+(i+7),70.65,y,21.45,3.62));
setPos($('speedResult'),28.3,85.35,43.4,6.7);['sd','sh','sm'].forEach(id=>{const d=document.createElement('div');d.id=id;d.className='value-box';$('speedResult').appendChild(d)});
function setTime(prefix,d,h,m){$(prefix+'d').innerHTML='<span>'+d+'</span><small>gün</small>';$(prefix+'h').innerHTML='<span>'+h+'</span><small>sa</small>';$(prefix+'m').innerHTML='<span>'+m+'</span><small>dk</small>'}
function calcSpeed(){let total=0;SPEEDS.forEach((s,i)=>{const q=Math.max(0,parseInt($('sp'+i).value||0)||0);total+=q*s[1]});const d=Math.floor(total/1440),r=total%1440,h=Math.floor(r/60),m=r%60;setTime('s',d.toLocaleString('tr-TR'),h,m);localStorage.setItem('hkLastSpeedMinutes',String(total));haptic('medium')}
function clearSpeed(){SPEEDS.forEach((_,i)=>$('sp'+i).value='');calcSpeed();haptic('light')}
let b=document.createElement('button');b.className='hot';setPos(b,1.5,70.7,49.5,8.7);b.onclick=calcSpeed;$('speed').appendChild(b);b=document.createElement('button');b.className='hot';setPos(b,53,70.7,44,8.7);b.onclick=clearSpeed;$('speed').appendChild(b);setTime('s',0,0,0);

// shared troop math
const TIER={T1:{sec:6,cost:30,gold:0},T2:{sec:11,cost:90,gold:5},T3:{sec:22,cost:144,gold:10},T4:{sec:44,cost:1000,gold:500}};
function perTroopResources(tier,type){const b=TIER[tier];let x={food:b.cost,wood:b.cost,stone:b.cost,ore:b.cost,gold:b.gold};if(type==='Piyade')x.stone=0;if(type==='Menzilli')x.ore=0;if(type==='Süvari')x.wood=0;return x}
function totalResources(tier,type,count,discount){const p=perTroopResources(tier,type),factor=Math.max(0,1-discount/100),o={};Object.keys(p).forEach(k=>o[k]=Math.round(p[k]*count*factor));return o}
const fmt=n=>Math.round(n).toLocaleString('tr-TR');
function addSelect(hostId,l,t,w,h,value,onPick){const x=document.createElement('button');x.className='select-hot';x.dataset.value=value;setPos(x,l,t,w,h);x.onclick=()=>{document.querySelectorAll('#'+hostId+' .select-hot').forEach(q=>q.classList.remove('active'));x.classList.add('active');onPick(value);haptic('light')};$(hostId).appendChild(x);return x}

// TRAIN
setPos($('trainDays'),50.65,38.20,29.20,3.78);setPos($('trainSpeed'),50.65,43.80,29.20,3.78);setPos($('trainDiscount'),50.65,49.35,29.20,3.78);
let trainTier='T1',trainType='Piyade';
const trainTierPos=[[5.7,58.15,21.2,4.65],[29.0,58.15,19.9,4.65],[51.1,58.15,19.9,4.65],[73.0,58.15,20.1,4.65]];
['T1','T2','T3','T4'].forEach((v,i)=>{const x=addSelect('trainTierChoices',...trainTierPos[i],v,z=>trainTier=z);x.textContent=v;if(i===0)x.classList.add('active')});
const trainTypePos=[[5.6,67.20,20.8,5.10],[27.7,67.20,20.8,5.10],[50.2,67.20,20.8,5.10],[72.5,67.20,20.9,5.10]];
['Piyade','Menzilli','Süvari','Kuşatma Aracı'].forEach((v,i)=>{const x=addSelect('trainTypeChoices',...trainTypePos[i],v,z=>trainType=z);x.textContent=v==='Kuşatma Aracı'?'Kuşatma':v;if(i===0)x.classList.add('active')});
setPos($('trainResult'),31.5,87.05,37.0,4.55);
let lastTrainDetail=null;
function calcTraining(){const days=Math.max(0,+$('trainDays').value||0),speed=Math.max(0,+$('trainSpeed').value||0),discount=Math.min(100,Math.max(0,+$('trainDiscount').value||0)),secPer=TIER[trainTier].sec/(1+speed/100),count=Math.floor(days*86400/secPer);$('trainResult').textContent=fmt(count)+' birlik';lastTrainDetail={count,tier:trainTier,troopType:trainType,discount,res:totalResources(trainTier,trainType,count,discount)};haptic('medium')}
function clearTraining(){$('trainDays').value='';$('trainSpeed').value='';$('trainDiscount').value='';$('trainResult').textContent='0 birlik';lastTrainDetail=null;haptic('light')}
[['calc',2,73.25,48.7,8.0],['clear',53,73.25,44,8.0]].forEach(([k,l,t,w,h])=>{const x=document.createElement('button');x.className='hot';setPos(x,l,t,w,h);x.onclick=k==='calc'?calcTraining:clearTraining;$('train').appendChild(x)});
let rt=document.createElement('button');rt.className='hot';setPos(rt,28,84.0,44,9.2);rt.onclick=()=>openDetail('train');$('train').appendChild(rt);

// TROOPS
setPos($('troopCount'),41.55,41.75,49.65,4.05);setPos($('troopSpeed'),41.55,60.15,44.25,4.05);setPos($('troopDiscount'),41.55,65.90,44.25,4.05);
let troopTier='T1',troopType='Piyade';
const troopTierPos=[[39.7,47.35,12.5,4.65],[52.9,47.35,12.5,4.65],[66.1,47.35,12.5,4.65],[79.3,47.35,12.6,4.65]];
['T1','T2','T3','T4'].forEach((v,i)=>{const x=addSelect('troopTierChoices',...troopTierPos[i],v,z=>troopTier=z);x.textContent=v;if(i===0)x.classList.add('active')});
const troopTypePos=[[39.7,53.10,12.5,5.95],[52.9,53.10,12.5,5.95],[66.1,53.10,12.5,5.95],[79.3,53.10,12.6,5.95]];
['Piyade','Menzilli','Süvari','Kuşatma Aracı'].forEach((v,i)=>{const x=addSelect('troopTypeChoices',...troopTypePos[i],v,z=>troopType=z);x.textContent=v==='Kuşatma Aracı'?'Kuşatma':v;if(i===0)x.classList.add('active')});
setPos($('troopResult'),27.0,85.35,46.0,6.8);['td','th','tm'].forEach(id=>{const d=document.createElement('div');d.id=id;d.className='value-box';$('troopResult').appendChild(d)});setTime('t',0,0,0);
let lastTroopDetail=null;
function calcTroopTarget(){const count=Math.max(0,parseInt($('troopCount').value||0)||0),speed=Math.max(0,+$('troopSpeed').value||0),discount=Math.min(100,Math.max(0,+$('troopDiscount').value||0)),totalSec=count*TIER[troopTier].sec/(1+speed/100),totalMin=Math.floor(totalSec/60),d=Math.floor(totalMin/1440),r=totalMin%1440,h=Math.floor(r/60),m=r%60;setTime('t',d.toLocaleString('tr-TR'),h,m);lastTroopDetail={count,tier:troopTier,troopType,discount,res:totalResources(troopTier,troopType,count,discount)};haptic('medium')}
function clearTroopTarget(){$('troopCount').value='';$('troopSpeed').value='';$('troopDiscount').value='';setTime('t',0,0,0);lastTroopDetail=null;haptic('light')}
[['calc',2,71.7,48.7,8.2],['clear',53,71.7,44,8.2]].forEach(([k,l,t,w,h])=>{const x=document.createElement('button');x.className='hot';setPos(x,l,t,w,h);x.onclick=k==='calc'?calcTroopTarget:clearTroopTarget;$('troops').appendChild(x)});rt=document.createElement('button');rt.className='hot';setPos(rt,25,84.0,50,9.4);rt.onclick=()=>openDetail('troops');$('troops').appendChild(rt);

// DETAIL
function openDetail(which){const data=which==='train'?lastTrainDetail:lastTroopDetail;if(!data){$('detailTitle').textContent='Henüz sonuç yok';$('detailDesc').textContent='Önce Hesapla düğmesine bas.';$('detailGrid').innerHTML=''}else{$('detailTitle').textContent=which==='train'?'Eğitim Kaynak Detayı':'Birlik Kaynak Detayı';$('detailDesc').textContent=`${data.tier} • ${data.troopType} • Masraf indirimi %${data.discount}`;const r=data.res;$('detailGrid').innerHTML=[['🌾 Gıda',r.food],['🪵 Kereste',r.wood],['🪨 Taş',r.stone],['⛏️ Cevher',r.ore],['🪙 Altın',r.gold],['🪖 Birlik',data.count]].map(x=>`<div class="mrow"><span>${x[0]}</span><b>${fmt(x[1])}</b></div>`).join('')}$('detailBack').classList.add('show');haptic('light')}
function closeDetail(){$('detailBack').classList.remove('show')}

// RALLY
const DEFAULT_RATIOS=['14/3/3','8/6/6','9/6/5','7/11/2','6/8/6'];let currentRatio='6/8/6';
const ratioPos=[[4.7,39.0,13.5,4.3],[19.3,39.0,13.5,4.3],[34.0,39.0,13.5,4.3],[48.7,39.0,13.5,4.3],[63.5,39.0,14.0,4.3]];
DEFAULT_RATIOS.forEach((v,i)=>{const x=addSelect('ratioButtons',...ratioPos[i],v,z=>{currentRatio=z;$('customBadge').classList.remove('show');calcRally()});x.textContent=v;if(v===currentRatio)x.classList.add('active')});
setPos($('customBtn'),80.1,39.0,14.5,4.3);$('customBtn').className='select-hot';$('customBtn').textContent='+ Özel';$('customBtn').onclick=()=>toggleRatioModal(true);
function toggleRatioModal(v){$('ratioBack').classList.toggle('show',v);haptic('light')}
function saveCustomRatio(){const a=[+$('cInf').value||0,+$('cRan').value||0,+$('cCav').value||0];if(a.some(x=>x<0)||a.reduce((x,y)=>x+y,0)!==20){try{tg?.showAlert('Dizilim toplamı 20 olmalı.')}catch(e){alert('Dizilim toplamı 20 olmalı.')}return}currentRatio=a.join('/');document.querySelectorAll('#ratioButtons .select-hot').forEach(x=>x.classList.remove('active'));$('customBadge').textContent='Özel dizilim: '+currentRatio;$('customBadge').classList.add('show');localStorage.setItem('hkCustomRatio',currentRatio);$('cInf').value=$('cRan').value=$('cCav').value='';toggleRatioModal(false);calcRally()}
function allocate(total,a){const sum=a.reduce((x,y)=>x+y,0),raw=a.map(x=>total*x/sum),out=raw.map(Math.floor);let left=total-out.reduce((x,y)=>x+y,0);raw.map((v,i)=>[v-Math.floor(v),i]).sort((x,y)=>y[0]-x[0]).slice(0,left).forEach(x=>out[x[1]]++);return out}
function kfmt(n){const k=n/1000;return(Number.isInteger(k)?k:k.toFixed(1).replace('.',','))+'K'}
const rallyCells=[['r200_t5_i',41.7,50.85],['r200_t4_i',69.2,50.85],['r200_t5_r',41.7,54.05],['r200_t4_r',69.2,54.05],['r200_t5_c',41.7,57.30],['r200_t4_c',69.2,57.30],['r375_t5_i',41.7,68.85],['r375_t4_i',69.2,68.85],['r375_t5_r',41.7,72.05],['r375_t4_r',69.2,72.05],['r375_t5_c',41.7,75.25],['r375_t4_c',69.2,75.25]];
rallyCells.forEach(d=>{const x=document.createElement('div');x.id=d[0];x.className='rally-value';setPos(x,d[1],d[2],17.2,3.0);$('rallyCells').appendChild(x)});
function calcRally(){const a=currentRatio.split('/').map(Number),A=allocate(120000,a),B=allocate(80000,a),C=allocate(225000,a),D=allocate(150000,a);$('r200_t5_i').textContent=kfmt(A[0]);$('r200_t5_r').textContent=kfmt(A[1]);$('r200_t5_c').textContent=kfmt(A[2]);$('r200_t4_i').textContent=kfmt(B[0]);$('r200_t4_r').textContent=kfmt(B[1]);$('r200_t4_c').textContent=kfmt(B[2]);$('r375_t5_i').textContent=kfmt(C[0]);$('r375_t5_r').textContent=kfmt(C[1]);$('r375_t5_c').textContent=kfmt(C[2]);$('r375_t4_i').textContent=kfmt(D[0]);$('r375_t4_r').textContent=kfmt(D[1]);$('r375_t4_c').textContent=kfmt(D[2]);haptic('medium')}
function resetRally(){currentRatio='6/8/6';document.querySelectorAll('#ratioButtons .select-hot').forEach(x=>x.classList.toggle('active',x.dataset.value==='6/8/6'));$('customBadge').classList.remove('show');localStorage.removeItem('hkCustomRatio');calcRally();haptic('light')}
[['calc',2,80.2,49,8.7],['clear',53,80.2,44,8.7]].forEach(([k,l,t,w,h])=>{const x=document.createElement('button');x.className='hot';setPos(x,l,t,w,h);x.onclick=k==='calc'?calcRally:resetRally;$('rally').appendChild(x)});
calcRally();

// restore custom badge only if desired, without auto-selecting
const savedCustom=localStorage.getItem('hkCustomRatio');if(savedCustom){$('customBadge').textContent='Kayıtlı özel: '+savedCustom;$('customBadge').classList.add('show')}

Promise.all(['speed_bg.png?v=14','train_bg.png?v=14','troops_bg.png?v=14','rally_bg.png?v=14'].map(src=>new Promise(res=>{const i=new Image();i.onload=i.onerror=res;i.src=src}))).then(()=>document.body.classList.add('ready'));setTimeout(()=>document.body.classList.add('ready'),7000);

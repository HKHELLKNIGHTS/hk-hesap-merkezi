(()=>{
const el=id=>document.getElementById(id);

const pos=(x,l,t,w,h)=>{
  if(typeof x==="string") x=el(x);
  if(!x) return;
  Object.assign(x.style,{
    left:l+"%",top:t+"%",
    width:w+"%",height:h+"%"
  });
};

const mask=(screen,id,l,t,w,h,result=false)=>{
  const s=el(screen);
  if(!s) return;
  let x=el(id);
  if(!x){
    x=document.createElement("div");
    x.id=id;
    x.className=result?"hk-result-mask":"hk-mask";
    s.appendChild(x);
  }
  pos(x,l,t,w,h);
};

const timeBox=(id,value,unit)=>{
  const x=el(id);
  if(!x) return;
  x.innerHTML=
    `<span>${value}</span>`+
    `<small style="font-size:.52em;color:#f4dfb8;margin-top:6px">${unit}</small>`;
  Object.assign(x.style,{
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center"
  });
};

/* Sekme geçişi - sade ve donmasız */
showScreen=function(id){
  document.querySelectorAll(".screen").forEach(s=>{
    s.classList.toggle("active",s.id===id);
  });

  window.scrollTo(0,0);

  try{
    const T=window.Telegram?.WebApp;
    if(T?.BackButton){
      id==="speed" ? T.BackButton.hide() : T.BackButton.show();
    }
  }catch(e){}
};

/* HIZLANDIRICI */
const ys=[40.55,44.74,48.98,53.17,57.48,61.78,66.03];

ys.forEach((y,i)=>{
  mask("speed","v11sl"+i,24.35,y-.12,21.9,3.62);
  const x=el("sp"+i);
  if(x){
    x.type="text";
    x.inputMode="numeric";
    pos(x,24.70,y,21.05,3.35);
  }
});

ys.forEach((y,i)=>{
  mask("speed","v11sr"+i,70.60,y-.12,21.9,3.62);
  const x=el("sp"+(i+7));
  if(x){
    x.type="text";
    x.inputMode="numeric";
    pos(x,70.95,y,21.15,3.35);
  }
});

mask("speed","v11SpeedResult",23.4,82.8,53.2,10.3,true);

pos("sd",26.0,84.0,14.5,6.4);
pos("sh",42.7,84.0,14.5,6.4);
pos("sm",59.4,84.0,14.5,6.4);

calcSpeed=function(){
  let total=0;

  SPEEDS.forEach((s,i)=>{
    const q=Math.max(
      0,
      parseInt(el("sp"+i)?.value||0)||0
    );
    total+=q*s[1];
  });

  const d=Math.floor(total/1440);
  const r=total%1440;
  const h=Math.floor(r/60);
  const m=r%60;

  timeBox("sd",d.toLocaleString("tr-TR"),"gün");
  timeBox("sh",h,"sa");
  timeBox("sm",m,"dk");

  localStorage.setItem("hkLastSpeedMinutes",String(total));
};

clearSpeed=function(){
  SPEEDS.forEach((_,i)=>{
    if(el("sp"+i)) el("sp"+i).value="";
  });
  calcSpeed();
};

calcSpeed();

/* EGITIM */
[
 ["trainDays",49.55,39.05,30.2,3.70],
 ["trainSpeed",49.55,44.50,30.2,3.70],
 ["trainDiscount",49.55,49.90,30.2,3.70]
].forEach((a,i)=>{
  mask("train","v11TrainField"+i,a[1]-.4,a[2]-.15,a[3]+.8,a[4]+.3);
  pos(...a);
});

const trainTierPos=[
 [5.05,58.0,21.4,4.45],
 [27.65,58.0,21.2,4.45],
 [50.75,58.0,20.3,4.45],
 [72.75,58.0,20.8,4.45]
];

const trainTypePos=[
 [5.05,66.95,21.4,4.55],
 [27.65,66.95,21.2,4.55],
 [50.75,66.95,20.3,4.55],
 [72.75,66.95,20.8,4.55]
];

document.querySelectorAll("#trainTierChoices .choice")
.forEach((x,i)=>{
  if(trainTierPos[i]){
    mask("train","v11tt"+i,
      trainTierPos[i][0]-.2,
      trainTierPos[i][1]-.15,
      trainTierPos[i][2]+.4,
      trainTierPos[i][3]+.3
    );
    pos(x,...trainTierPos[i]);
  }
});

const trainNames=["Piyade","Menzilli","Süvari","Kuşatma"];

document.querySelectorAll("#trainTypeChoices .choice")
.forEach((x,i)=>{
  if(trainTypePos[i]){
    mask("train","v11ty"+i,
      trainTypePos[i][0]-.2,
      trainTypePos[i][1]-.15,
      trainTypePos[i][2]+.4,
      trainTypePos[i][3]+.3
    );
    pos(x,...trainTypePos[i]);
    x.textContent=trainNames[i];
  }
});

mask("train","v11TrainResult",20.8,84.7,58.0,8.4,true);
pos("trainResult",24.0,85.75,52.0,5.1);

const trainHint=document.querySelector("#train .hint");
if(trainHint){
  trainHint.textContent="Sonuca dokun: kaynak detayı";
  pos(trainHint,29,91.5,42,2);
}

/* BIRLIK SAYISI */
mask("troops","v11Count",40.8,41.42,51.3,4.55);
pos("troopCount",41.35,41.70,50.2,3.95);

const tc=el("troopCount");
if(tc){
  tc.type="text";
  tc.inputMode="numeric";
}

const troopTierPos=[
 [39.80,47.60,12.45,4.10],
 [52.85,47.60,12.45,4.10],
 [66.00,47.60,12.45,4.10],
 [79.15,47.60,12.70,4.10]
];

document.querySelectorAll("#troopTierChoices .choice")
.forEach((x,i)=>{
  if(troopTierPos[i]){
    mask("troops","v11tr"+i,
      troopTierPos[i][0]-.15,
      troopTierPos[i][1]-.12,
      troopTierPos[i][2]+.3,
      troopTierPos[i][3]+.25
    );
    pos(x,...troopTierPos[i]);
  }
});

const troopTypePos=[
 [39.65,53.25,12.75,5.45],
 [52.65,53.25,12.95,5.45],
 [65.85,53.25,12.95,5.45],
 [79.05,53.25,13.05,5.45]
];

const troopNames=["Piyade","Menzilli","Süvari","Kuşatma"];

document.querySelectorAll("#troopTypeChoices .choice")
.forEach((x,i)=>{
  if(troopTypePos[i]){
    mask("troops","v11tp"+i,
      troopTypePos[i][0]-.18,
      troopTypePos[i][1]-.15,
      troopTypePos[i][2]+.36,
      troopTypePos[i][3]+.30
    );
    pos(x,...troopTypePos[i]);
    x.textContent=troopNames[i];
  }
});

[
 ["troopSpeed",41.35,60.15,44.7,3.80],
 ["troopDiscount",41.35,65.90,44.7,3.80]
].forEach((a,i)=>{
  mask("troops","v11TroopField"+i,
    a[1]-.45,a[2]-.18,a[3]+.9,a[4]+.35
  );
  pos(...a);

  const x=el(a[0]);
  if(x){
    x.type="text";
    x.inputMode="decimal";
  }
});

mask("troops","v11TroopResult",23.4,82.8,53.2,10.4,true);

pos("td",26.0,84.1,14.5,6.4);
pos("th",42.7,84.1,14.5,6.4);
pos("tm",59.4,84.1,14.5,6.4);

calcTroopTarget=function(){
  const count=Math.max(
    0,
    parseInt(el("troopCount")?.value||0)||0
  );

  const speed=Math.max(
    0,
    +el("troopSpeed")?.value||0
  );

  const discount=Math.min(
    100,
    Math.max(0,+el("troopDiscount")?.value||0)
  );

  const totalSec=
    count*TIER[troopTier].sec/(1+speed/100);

  const totalMin=Math.floor(totalSec/60);
  const d=Math.floor(totalMin/1440);
  const r=totalMin%1440;
  const h=Math.floor(r/60);
  const m=r%60;

  timeBox("td",d.toLocaleString("tr-TR"),"gün");
  timeBox("th",h,"sa");
  timeBox("tm",m,"dk");

  lastTroopDetail={
    type:"troops",
    count,
    tier:troopTier,
    troopType,
    days:d,
    hours:h,
    mins:m,
    speed,
    discount,
    res:totalResources(
      troopTier,
      troopType,
      count,
      discount
    )
  };
};

clearTroopTarget=function(){
  ["troopCount","troopSpeed","troopDiscount"]
  .forEach(id=>{
    if(el(id)) el(id).value="";
  });

  lastTroopDetail=null;
  timeBox("td",0,"gün");
  timeBox("th",0,"sa");
  timeBox("tm",0,"dk");
};

clearTroopTarget();

/* RALLI */
mask("rally","v11RatioStrip",4.0,38.35,92.0,5.55);

drawRatioButtons=function(){
  const host=el("ratioButtons");
  if(!host) return;

  host.innerHTML="";

  const xs=[4.8,19.7,34.6,49.5,64.4];

  getRatios().slice(0,5).forEach((r,i)=>{
    addChoice(
      "ratioButtons",
      r,
      xs[i],
      39.0,
      i===4?14.2:13.8,
      4.15,
      r===currentRatio,
      ()=>{
        currentRatio=r;
        drawRatioButtons();
        calcRally();
      }
    );
  });
};

pos(
  document.querySelector("#rally .floating"),
  80.8,39.0,14.0,4.15
);

[
 ["r200_t5_i",37.0,50.35],
 ["r200_t4_i",64.1,50.35],
 ["r200_t5_r",37.0,53.55],
 ["r200_t4_r",64.1,53.55],
 ["r200_t5_c",37.0,56.75],
 ["r200_t4_c",64.1,56.75],

 ["r375_t5_i",37.0,67.95],
 ["r375_t4_i",64.1,67.95],
 ["r375_t5_r",37.0,71.15],
 ["r375_t4_r",64.1,71.15],
 ["r375_t5_c",37.0,74.35],
 ["r375_t4_c",64.1,74.35]
].forEach(x=>{
  pos(x[0],x[1],x[2],27.0,3.1);
});

drawRatioButtons();
calcRally();

/* Son güvenlik: görünmez katmanlar tıklamayı bloke etmesin */
document.querySelectorAll(
  "#rallyCells,.hk-mask,.hk-result-mask"
).forEach(x=>{
  x.style.pointerEvents="none";
});

})();

/* ===== V12 ===== */
(()=>{
const P=(x,l,t,w,h)=>{
  if(typeof x==="string") x=document.getElementById(x);
  if(!x)return;

  Object.assign(x.style,{
    left:l+"%",
    top:t+"%",
    width:w+"%",
    height:h+"%"
  });
};

/* DORT ARKA PLANI EN BASTA YUKLE */
let readyDone=false;

const ready=()=>{
  if(readyDone)return;
  readyDone=true;
  document.body.classList.add("hk-ready");
};

Promise.all(
  [
    "speed_bg.png",
    "train_bg.png",
    "troops_bg.png",
    "rally_bg.png"
  ].map(src=>new Promise(resolve=>{
    const im=new Image();
    im.onload=resolve;
    im.onerror=resolve;
    im.src=src;
  }))
).then(ready);

/* Baglanti yavas olsa bile bos ekranda kalmasin */
setTimeout(ready,7000);

/* EGITIM - basliklara nefes aldir */
const tTier=[
 [5.05,58.55,21.4,4.25],
 [27.65,58.55,21.2,4.25],
 [50.75,58.55,20.3,4.25],
 [72.75,58.55,20.8,4.25]
];

document.querySelectorAll("#trainTierChoices .choice")
.forEach((x,i)=>{
  if(tTier[i]){
    P(x,...tTier[i]);
    P(
      "v11tt"+i,
      tTier[i][0]-.18,
      tTier[i][1]-.12,
      tTier[i][2]+.36,
      tTier[i][3]+.24
    );
  }
});

const tType=[
 [5.05,67.55,21.4,4.35],
 [27.65,67.55,21.2,4.35],
 [50.75,67.55,20.3,4.35],
 [72.75,67.55,20.8,4.35]
];

document.querySelectorAll("#trainTypeChoices .choice")
.forEach((x,i)=>{
  if(tType[i]){
    P(x,...tType[i]);
    P(
      "v11ty"+i,
      tType[i][0]-.18,
      tType[i][1]-.12,
      tType[i][2]+.36,
      tType[i][3]+.24
    );
  }
});

/* Sonuc basligi artik kapanmayacak */
P("v11TrainResult",20.8,85.75,58.0,7.30);
P("trainResult",24.0,86.35,52.0,4.85);

const th=document.querySelector("#train .hint");
if(th) P(th,29.0,91.65,42.0,1.7);

/* HIZLANDIRICI */
const sh=document.querySelector("#speed .hint");
if(sh) P(sh,29.5,90.90,41.0,1.7);

/* BIRLIK SAYISI */
const bh=document.querySelector("#troops .hint");
if(bh) P(bh,29.0,90.90,42.0,1.7);

/* RALLI - statik sayilarin TAM ustune otur */
[
 ["r200_t5_i",37.0,50.80],
 ["r200_t4_i",64.0,50.80],

 ["r200_t5_r",37.0,54.10],
 ["r200_t4_r",64.0,54.10],

 ["r200_t5_c",37.0,57.35],
 ["r200_t4_c",64.0,57.35],

 ["r375_t5_i",37.0,69.00],
 ["r375_t4_i",64.0,69.00],

 ["r375_t5_r",37.0,72.25],
 ["r375_t4_r",64.0,72.25],

 ["r375_t5_c",37.0,75.50],
 ["r375_t4_c",64.0,75.50]
].forEach(x=>{
  P(x[0],x[1],x[2],26.7,3.25);
});

try{ calcRally(); }catch(e){}

})();

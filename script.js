
function showTab(id){
 document.querySelectorAll('.tab').forEach(t=>t.classList.add('hidden'));
 document.getElementById(id).classList.remove('hidden');
}

function updateClock(){
 document.getElementById('time').textContent=new Date().toLocaleTimeString();
}
setInterval(updateClock,1000);updateClock();

let swI=null,ms=0;
function startSW(){if(swI)return;swI=setInterval(()=>{ms+=10;document.getElementById('sw').textContent=(ms/1000).toFixed(3)},10);}
function stopSW(){clearInterval(swI);swI=null;}
function resetSW(){stopSW();ms=0;document.getElementById('sw').textContent="0.000";}

let alarms=JSON.parse(localStorage.getItem("alarms")||"[]");
function saveAlarm(){
 if(alarms.length>=6)return alert("Máx 6 alarmes");
 const t=alarmTime.value,d=alarmDay.value;
 alarms.push({t,d});
 localStorage.setItem("alarms",JSON.stringify(alarms));
 renderAlarms();
}
function renderAlarms(){
 alarmList.innerHTML="";
 alarms.forEach(a=>alarmList.innerHTML+=`<li>${a.t} - ${a.d}</li>`);
}
renderAlarms();

setInterval(()=>{
 const now=new Date();
 const cur=now.toTimeString().slice(0,5);
 alarms.forEach(a=>{
  if(a.t===cur){document.getElementById("alarmSound").play();}
 });
},60000);

let pomo=1500,pi=null;
function startPomo(){
 if(pi)return;
 pi=setInterval(()=>{
 pomo--;
  pomoDisplay=Math.floor(pomo/60)+":"+String(pomo%60).padStart(2,'0');
 document.getElementById("pomo").textContent=pomoDisplay;
 if(pomo<=0){clearInterval(pi);alert("Pomodoro finalizado");}
 },1000);
}

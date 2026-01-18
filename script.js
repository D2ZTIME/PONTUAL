
function showTab(id){
 document.querySelectorAll('.tab').forEach(t=>t.classList.add('hidden'));
 document.getElementById(id).classList.remove('hidden');
}

function updateClock(){
 const d=new Date();
 time.textContent=d.toLocaleTimeString();
 sp.textContent=d.toLocaleTimeString('pt-BR',{timeZone:'America/Sao_Paulo'});
 ny.textContent=d.toLocaleTimeString('en-US',{timeZone:'America/New_York'});
 ld.textContent=d.toLocaleTimeString('en-GB',{timeZone:'Europe/London'});
 pa.textContent=d.toLocaleTimeString('fr-FR',{timeZone:'Europe/Paris'});
 tk.textContent=d.toLocaleTimeString('ja-JP',{timeZone:'Asia/Tokyo'});
 sy.textContent=d.toLocaleTimeString('en-AU',{timeZone:'Australia/Sydney'});
}
setInterval(updateClock,1000);updateClock();

let swI=null,ms=0;
function startSW(){if(swI)return;swI=setInterval(()=>{ms+=10;sw.textContent=(ms/1000).toFixed(3)},10);}
function stopSW(){clearInterval(swI);swI=null;}
function resetSW(){stopSW();ms=0;sw.textContent="0.000";}

let alarms=JSON.parse(localStorage.getItem("alarms")||"[]");
function saveAlarm(){
 if(alarms.length>=6)return alert("Máx 6 alarmes");
 alarms.push({t:alarmTime.value,d:alarmDay.value});
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
 const day=["Dom","Seg","Ter","Qua","Qui","Sex","Sab"][now.getDay()];
 alarms.forEach(a=>{
  if(a.t===cur && (a.d==="Todos"||a.d===day)){
   alarmSound.play();
   if(Notification.permission==="granted"){
    new Notification("⏰ Alarme PONTUAL",{body:"Hora programada atingida"});
   }
  }
 });
},60000);

if(Notification.permission!=="granted"){Notification.requestPermission();}

let pomoTime=1500,pInt=null;
function setPomo(min){
 resetPomo();
 pomoTime=min*60;
 updatePomo();
}
function updatePomo(){
 pomo.textContent=Math.floor(pomoTime/60)+":"+String(pomoTime%60).padStart(2,'0');
}
function startPomo(){
 if(pInt)return;
 pInt=setInterval(()=>{
  pomoTime--;
  updatePomo();
  if(pomoTime<=0){clearInterval(pInt);pInt=null;alert("Pomodoro finalizado");}
 },1000);
}
function pausePomo(){clearInterval(pInt);pInt=null;}
function resetPomo(){pausePomo();pomoTime=1500;updatePomo();}

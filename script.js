
function updateClock(){
 const d=new Date();
 document.getElementById('time').textContent=d.toLocaleTimeString();
 document.getElementById('sp').textContent=d.toLocaleTimeString('pt-BR',{timeZone:'America/Sao_Paulo'});
 document.getElementById('ny').textContent=d.toLocaleTimeString('en-US',{timeZone:'America/New_York'});
 document.getElementById('ld').textContent=d.toLocaleTimeString('en-GB',{timeZone:'Europe/London'});
 document.getElementById('pa').textContent=d.toLocaleTimeString('fr-FR',{timeZone:'Europe/Paris'});
 document.getElementById('tk').textContent=d.toLocaleTimeString('ja-JP',{timeZone:'Asia/Tokyo'});
 document.getElementById('sy').textContent=d.toLocaleTimeString('en-AU',{timeZone:'Australia/Sydney'});
}
setInterval(updateClock,1000);updateClock();

let swInt=null,ms=0;
function startSW(){if(swInt)return;swInt=setInterval(()=>{ms+=10;renderSW();},10);}
function stopSW(){clearInterval(swInt);swInt=null;}
function resetSW(){stopSW();ms=0;renderSW();}
function renderSW(){
 let s=Math.floor(ms/1000);
 let mi=ms%1000;
 document.getElementById('sw').textContent=s+"."+String(mi).padStart(3,'0');
}

let alarms=[];
function addAlarm(){
 if(alarms.length>=6)return alert("Máx. 6 alarmes");
 const t=prompt("Informe hora e dia (ex: 07:30 Seg)");
 if(t){alarms.push(t);renderAlarms();}
}
function renderAlarms(){
 document.getElementById('alarmsList').innerHTML=alarms.map(a=>"<div>"+a+"</div>").join("");
}

let pomo=1500,pInt=null;
function startPomo(){
 if(pInt)return;
 pInt=setInterval(()=>{
 pomo--;
 document.getElementById('pomo').textContent=Math.floor(pomo/60)+":"+String(pomo%60).padStart(2,'0');
 if(pomo<=0){clearInterval(pInt);alert("Pomodoro concluído");}
 },1000);
}

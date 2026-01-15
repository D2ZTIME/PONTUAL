function openTab(id){
 document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'))
 document.getElementById(id).classList.add('active')
}

setInterval(()=>{
 time.textContent=new Date().toLocaleTimeString()
},1000)

let alarm=null
function setAlarm(){alarm=alarmTime.value;alarmStatus.textContent='Alarme definido'}
function stopAlarm(){alarm=null;alarmStatus.textContent='Alarme parado'}

setInterval(()=>{
 if(!alarm) return
 const n=new Date().toLocaleTimeString().slice(0,5)
 if(n===alarm) alert('⏰ Alarme!')
},1000)

let c=0,ct=null
function startChrono(){
 if(ct) return
 ct=setInterval(()=>{
  c++
  chronoTime.textContent=new Date(c*1000).toISOString().substr(11,8)
 },1000)
}
function stopChrono(){clearInterval(ct);ct=null}
function resetChrono(){stopChrono();c=0;chronoTime.textContent='00:00:00'}

let p=1500,pt=null
function startPomodoro(){
 if(pt) return
 pt=setInterval(()=>{
  if(p<=0){clearInterval(pt);alert('⏱ Pausa!');return}
  p--
  const m=String(Math.floor(p/60)).padStart(2,'0')
  const s=String(p%60).padStart(2,'0')
  pomoTime.textContent=`${m}:${s}`
 },1000)
}
function resetPomodoro(){clearInterval(pt);pt=null;p=1500;pomoTime.textContent='25:00'}
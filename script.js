function showScreen(id){
 document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'))
 document.getElementById(id).classList.add('active')
}

/* CLOCK */
function updateClock(){
 const n=new Date()
 hours.textContent=String(n.getHours()).padStart(2,'0')
 minutes.textContent=String(n.getMinutes()).padStart(2,'0')
 seconds.textContent=String(n.getSeconds()).padStart(2,'0')
 date.textContent=n.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})
}
setInterval(updateClock,1000);updateClock()

/* ALARM */
let alarmTime=null
function setAlarm(){
 alarmTime=document.getElementById('alarmTime').value
 alarmStatus.textContent='Alarme definido para '+alarmTime
}
setInterval(()=>{
 if(!alarmTime) return
 const n=new Date()
 const now=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')
 if(now===alarmTime){
  alert('⏰ Alarme!')
  alarmTime=null
 }
},1000)

/* STOPWATCH */
let sw=0, swInt=null
function updateStopwatch(){
 const h=String(Math.floor(sw/3600)).padStart(2,'0')
 const m=String(Math.floor((sw%3600)/60)).padStart(2,'0')
 const s=String(sw%60).padStart(2,'0')
 stopwatchTime.textContent=`${h}:${m}:${s}`
}
function startStopwatch(){
 if(swInt) return
 swInt=setInterval(()=>{sw++;updateStopwatch()},1000)
}
function pauseStopwatch(){clearInterval(swInt);swInt=null}
function resetStopwatch(){pauseStopwatch();sw=0;updateStopwatch()}
updateStopwatch()

/* POMODORO */
let pomodoroSeconds=1500,pomodoroInterval=null,pomodoroMode='focus'
function updatePomodoro(){
 const m=String(Math.floor(pomodoroSeconds/60)).padStart(2,'0')
 const s=String(pomodoroSeconds%60).padStart(2,'0')
 pomodoroTime.textContent=`${m}:${s}`
}
function startPomodoro(){
 if(pomodoroInterval) return
 pomodoroInterval=setInterval(()=>{
  pomodoroSeconds--
  if(pomodoroSeconds<=0){
   if(pomodoroMode==='focus'){
    pomodoroMode='break';pomodoroSeconds=300;pomodoroStatus.textContent='Pausa'
   }else{
    pomodoroMode='focus';pomodoroSeconds=1500;pomodoroStatus.textContent='Foco'
   }
  }
  updatePomodoro()
 },1000)
}
function pausePomodoro(){clearInterval(pomodoroInterval);pomodoroInterval=null}
function resetPomodoro(){pausePomodoro();pomodoroMode='focus';pomodoroSeconds=1500;pomodoroStatus.textContent='Foco';updatePomodoro()}
updatePomodoro()
function showScreen(id) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; // Garante o reset
    });

    const activeScreen = document.getElementById(id);
    activeScreen.style.display = 'flex'; // Primeiro ativa o display
    
    // Pequeno timeout para o navegador processar o display e animar a opacidade
    setTimeout(() => {
        activeScreen.classList.add('active');
    }, 10);
}

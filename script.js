function showScreen(id){
 document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'))
 document.getElementById(id).classList.add('active')
}

function updateClock(){
 const n=new Date()
 hours.textContent=String(n.getHours()).padStart(2,'0')
 minutes.textContent=String(n.getMinutes()).padStart(2,'0')
 seconds.textContent=String(n.getSeconds()).padStart(2,'0')
 date.textContent=n.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})
}
setInterval(updateClock,1000);updateClock()

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

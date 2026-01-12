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

let alarms=[]
function setAlarm(){
  const t=alarmTime.value
  if(t){alarms.push(t);renderAlarms()}
}
function renderAlarms(){
  alarmList.innerHTML=''
  alarms.forEach(a=>{
    const li=document.createElement('li')
    li.textContent=a
    alarmList.appendChild(li)
  })
}
setInterval(()=>{
  const now=new Date()
  const time=now.toTimeString().slice(0,5)
  if(alarms.includes(time)){
    alert('⏰ Alarme!')
    alarms=alarms.filter(a=>a!==time)
    renderAlarms()
  }
},1000)

let swTime=0,swInterval
function startStopwatch(){
  if(swInterval) return
  swInterval=setInterval(()=>{
    swTime++
    const h=String(Math.floor(swTime/3600)).padStart(2,'0')
    const m=String(Math.floor(swTime%3600/60)).padStart(2,'0')
    const s=String(swTime%60).padStart(2,'0')
    stopwatchDisplay.textContent=`${h}:${m}:${s}`
  },1000)
}
function stopStopwatch(){clearInterval(swInterval);swInterval=null}
function resetStopwatch(){stopStopwatch();swTime=0;stopwatchDisplay.textContent='00:00:00'}

let pomoTime=1500,pomoInterval
function startPomodoro(){
  if(pomoInterval) return
  pomoInterval=setInterval(()=>{
    pomoTime--
    const m=String(Math.floor(pomoTime/60)).padStart(2,'0')
    const s=String(pomoTime%60).padStart(2,'0')
    pomodoroDisplay.textContent=`${m}:${s}`
    if(pomoTime<=0){alert('🍅 Pomodoro finalizado!');resetPomodoro()}
  },1000)
}
function resetPomodoro(){
  clearInterval(pomoInterval)
  pomoInterval=null
  pomoTime=1500
  pomodoroDisplay.textContent='25:00'
}
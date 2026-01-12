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

let alarms=JSON.parse(localStorage.getItem('alarms')||'[]')
function setAlarm(){
  const t=alarmTime.value
  if(t){alarms.push(t);saveAlarms()}
}
function saveAlarms(){
  localStorage.setItem('alarms',JSON.stringify(alarms))
  renderAlarms()
}
function renderAlarms(){
  alarmList.innerHTML=''
  alarms.forEach((a,i)=>{
    const li=document.createElement('li')
    li.textContent=a
    li.onclick=()=>{alarms.splice(i,1);saveAlarms()}
    alarmList.appendChild(li)
  })
}
renderAlarms()

setInterval(()=>{
  const time=new Date().toTimeString().slice(0,5)
  if(alarms.includes(time)){
    alert('⏰ Alarme!')
    alarms=alarms.filter(a=>a!==time)
    saveAlarms()
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

function toggleFullscreen(){
  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen()
  }else{
    document.exitFullscreen()
  }
}
// Seletor de Dispositivo
document.getElementById('deviceSelect').addEventListener('change', function() {
    const canvas = document.getElementById('app-canvas');
    canvas.style.width = this.value;
    if(this.value !== '100%') {
        canvas.style.border = '10px solid #222';
        canvas.style.borderRadius = '20px';
    } else {
        canvas.style.border = 'none';
    }
});

// Relógios Mundiais
function updateWorldTime() {
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    document.getElementById('fuso-london').textContent = 
        new Date().toLocaleTimeString('pt-BR', { ...timeOptions, timeZone: 'Europe/London' });
    
    document.getElementById('fuso-ny').textContent = 
        new Date().toLocaleTimeString('pt-BR', { ...timeOptions, timeZone: 'America/New_York' });
    
    document.getElementById('fuso-tokyo').textContent = 
        new Date().toLocaleTimeString('pt-BR', { ...timeOptions, timeZone: 'Asia/Tokyo' });
}
setInterval(updateWorldTime, 1000);

// Copiar Hora
function copyTime() {
    const currentTime = document.querySelector('.main-clock-display').innerText;
    navigator.clipboard.writeText(currentTime);
    // Adicione um pequeno efeito visual de "Copiado" se desejar
}

// Fullscreen (Melhorado)
function toggleFS() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
// Atualização dos Fusos Horários
function updateWorldClocks() {
    const config = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    
    document.getElementById('tz-london').innerText = new Date().toLocaleTimeString('pt-BR', { ...config, timeZone: 'Europe/London' });
    document.getElementById('tz-ny').innerText = new Date().toLocaleTimeString('pt-BR', { ...config, timeZone: 'America/New_York' });
    document.getElementById('tz-tokyo').innerText = new Date().toLocaleTimeString('pt-BR', { ...config, timeZone: 'Asia/Tokyo' });
    document.getElementById('tz-sp').innerText = new Date().toLocaleTimeString('pt-BR', { ...config, timeZone: 'America/Sao_Paulo' });
}
setInterval(updateWorldClocks, 1000);

// Função para incrementar/decrementar tempo do alarme (exemplo simples)
function adjustAlarm(minutes) {
    const alarmInput = document.getElementById('alarm-time');
    if (!alarmInput.value) alarmInput.value = "08:00";
    
    let [h, m] = alarmInput.value.split(':').map(Number);
    let date = new Date();
    date.setHours(h, m + minutes);
    
    const newH = String(date.getHours()).padStart(2, '0');
    const newM = String(date.getMinutes()).padStart(2, '0');
    alarmInput.value = `${newH}:${newM}`;
}

// Inicializar calendário com data de hoje
document.getElementById('calendar-input').valueAsDate = new Date();

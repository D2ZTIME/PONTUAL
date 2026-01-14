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

// Exemplo de lógica para o Cronômetro
const [tempo, setTempo] = useState(0); // tempo em milissegundos
const [ativo, setAtivo] = useState(false);

useEffect(() => {
  let intervalo = null;
  if (ativo) {
    intervalo = setInterval(() => {
      setTempo((prev) => prev + 10); // incrementa 10ms
    }, 10);
  } else {
    clearInterval(intervalo);
  }
  return () => clearInterval(intervalo);
}, [ativo]);

// Função para formatar (00:00.00)
const formatarTempo = () => {
  const minutos = Math.floor((tempo / 60000) % 60).toString().padStart(2, '0');
  const segundos = Math.floor((tempo / 1000) % 60).toString().padStart(2, '0');
  const milisegundos = Math.floor((tempo / 10) % 100).toString().padStart(2, '0');
  return { principal: `${minutos}:${segundos}`, milis: milisegundos };
};

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

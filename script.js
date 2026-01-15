/* --- CONFIGURAÇÕES GERAIS E PERSISTÊNCIA --- */
const state = {
    currentScreen: localStorage.getItem('p_screen') || 'clock',
    alarmTime: localStorage.getItem('p_alarm'),
    swSeconds: 0,
    swInterval: null,
    pomoSeconds: 1500,
    pomoInterval: null,
    pomoMode: 'focus'
};

// Gerenciador de Áudio (Web Audio API) - Som de Alarme Nativo
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let alarmOscillator = null;

function playAlarmSound() {
    if (alarmOscillator) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square'; // Som tipo bip eletrônico
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Nota Lá
    
    // Efeito de pulso (bi-bi-bi)
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 4; // Velocidade do bip
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.5;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    lfo.start();
    alarmOscillator = { osc, lfo };
}

function stopAlarmSound() {
    if (alarmOscillator) {
        alarmOscillator.osc.stop();
        alarmOscillator.lfo.stop();
        alarmOscillator = null;
    }
}

/* --- NAVEGAÇÃO --- */
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    state.currentScreen = id;
    localStorage.setItem('p_screen', id);
}

/* --- RELÓGIO (ZENITH SYSTEM) --- */
function updateClock() {
    const n = new Date();
    document.getElementById('hours').textContent = String(n.getHours()).padStart(2, '0');
    document.getElementById('minutes').textContent = String(n.getMinutes()).padStart(2, '0');
    document.getElementById('seconds').textContent = String(n.getSeconds()).padStart(2, '0');
    document.getElementById('date').textContent = n.toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long'
    });
}
setInterval(updateClock, 1000);

/* --- ALARME AVANÇADO --- */
function setAlarm() {
    const input = document.getElementById('alarmTime').value;
    if (!input) return;
    state.alarmTime = input;
    localStorage.setItem('p_alarm', input);
    document.getElementById('alarmStatus').textContent = `Alarme ativo: ${input}`;
}

function stopAlarm() {
    stopAlarmSound();
    state.alarmTime = null;
    localStorage.removeItem('p_alarm');
    document.getElementById('alarmStatus').textContent = 'Nenhum alarme definido';
    // Esconder botões de controle de toque se houver
}

setInterval(() => {
    if (!state.alarmTime) return;
    const n = new Date();
    const now = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0');
    if (now === state.alarmTime) {
        playAlarmSound();
        // Aqui você pode disparar um modal visual ou mudar a cor da tela
    }
}, 1000);

/* --- CRONÔMETRO PROFISSIONAL --- */
function updateStopwatch() {
    const h = String(Math.floor(state.swSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((state.swSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(state.swSeconds % 60).padStart(2, '0');
    document.getElementById('stopwatchTime').textContent = `${h}:${m}:${s}`;
}

function startStopwatch() {
    if (state.swInterval) return;
    state.swInterval = setInterval(() => {
        state.swSeconds++;
        updateStopwatch();
    }, 1000);
}

function pauseStopwatch() {
    clearInterval(state.swInterval);
    state.swInterval = null;
}

function resetStopwatch() {
    pauseStopwatch();
    state.swSeconds = 0;
    updateStopwatch();
}

/* --- POMODORO CONFIGURÁVEL --- */
function updatePomodoro() {
    const m = String(Math.floor(state.pomoSeconds / 60)).padStart(2, '0');
    const s = String(state.pomoSeconds % 60).padStart(2, '0');
    document.getElementById('pomodoroTime').textContent = `${m}:${s}`;
}

function startPomodoro() {
    if (state.pomoInterval) return;
    state.pomoInterval = setInterval(() => {
        state.pomoSeconds--;
        if (state.pomoSeconds <= 0) {
            playAlarmSound(); // Alerta o fim do ciclo
            setTimeout(stopAlarmSound, 3000); // Para o som após 3s
            if (state.pomoMode === 'focus') {
                state.pomoMode = 'break';
                state.pomoSeconds = 300;
                document.getElementById('pomodoroStatus').textContent = 'Pausa';
            } else {
                state.pomoMode = 'focus';
                state.pomoSeconds = 1500;
                document.getElementById('pomodoroStatus').textContent = 'Foco';
            }
        }
        updatePomodoro();
    }, 1000);
}

// Inicialização ao carregar a página
window.onload = () => {
    showScreen(state.currentScreen);
    updateClock();
    if (state.alarmTime) {
        document.getElementById('alarmTime').value = state.alarmTime;
        document.getElementById('alarmStatus').textContent = `Alarme ativo: ${state.alarmTime}`;
    }
};

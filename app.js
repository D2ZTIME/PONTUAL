/* --------- NAVEGAÇÃO --------- */
document.querySelectorAll(".menu button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");
  };
});

/* --------- RELÓGIO --------- */
function updateClock() {
  document.getElementById("clockTime").textContent =
    new Date().toLocaleTimeString("pt-BR");
}
setInterval(updateClock, 1000);
updateClock();

/* --------- ALARME COM SOM + NOTIFICAÇÃO --------- */

let alarms = JSON.parse(localStorage.getItem("alarms")) || [];

// Permissão de notificação
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Este navegador não suporta notificações.");
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      alert("Notificações ativadas com sucesso!");
    }
  });
}

// Renderiza alarmes
function renderAlarms() {
  const list = document.getElementById("alarmList");
  list.innerHTML = "";

  alarms.forEach((alarm, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${alarm.time}</strong>
      ${alarm.desc ? " - " + alarm.desc : ""}
      <button onclick="removeAlarm(${index})">❌</button>
    `;
    list.appendChild(li);
  });
}

function addAlarm() {
  const time = document.getElementById("alarmTime").value;
  const desc = document.getElementById("alarmDesc").value;

  if (!time) return;

  alarms.push({
    time,
    desc,
    triggered: false
  });

  saveAlarms();
}

function removeAlarm(index) {
  alarms.splice(index, 1);
  saveAlarms();
}

function saveAlarms() {
  localStorage.setItem("alarms", JSON.stringify(alarms));
  renderAlarms();
}

// Verifica alarmes a cada segundo
setInterval(() => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  alarms.forEach(alarm => {
    if (alarm.time === currentTime && !alarm.triggered) {
      triggerAlarm(alarm);
      alarm.triggered = true;
      saveAlarms();
    }
  });
}, 1000);

// Disparo do alarme
function triggerAlarm(alarm) {
  // Som
  const sound = document.getElementById("alarmSound");
  sound.play().catch(() => {});

  // Notificação
  if (Notification.permission === "granted") {
    new Notification("⏰ Alarme PONTUAL", {
      body: alarm.desc || "Hora do seu alarme!",
    });
  } else {
    alert("⏰ Alarme: " + (alarm.desc || alarm.time));
  }
}

renderAlarms();
;

/* --------- CRONÔMETRO --------- */
let swInterval, swStart;

function startStopwatch() {
  if (swInterval) return;
  swStart = Date.now();
  swInterval = setInterval(() => {
    const t = Date.now() - swStart;
    document.getElementById("stopwatchTime").textContent =
      new Date(t).toISOString().substr(11, 8);
  }, 1000);
}

function resetStopwatch() {
  clearInterval(swInterval);
  swInterval = null;
  document.getElementById("stopwatchTime").textContent = "00:00:00";
}
/* --------- CRONÔMETRO AVANÇADO --------- */

let swRunning = false;
let swStartTime = 0;
let swElapsed = 0;
let swInterval = null;

const swDisplay = document.getElementById("stopwatchTime");
const lapList = document.getElementById("lapList");

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const millis = String(ms % 1000).padStart(3, "0");
  return `${minutes}:${seconds}.${millis}`;
}

function updateStopwatch() {
  const now = Date.now();
  swElapsed = now - swStartTime;
  swDisplay.textContent = formatTime(swElapsed);
}

function startStopwatch() {
  if (swRunning) return;
  swRunning = true;
  swStartTime = Date.now() - swElapsed;
  swInterval = setInterval(updateStopwatch, 10);
}

function pauseStopwatch() {
  swRunning = false;
  clearInterval(swInterval);
}

function resetStopwatch() {
  pauseStopwatch();
  swElapsed = 0;
  swDisplay.textContent = "00:00:00.000";
  lapList.innerHTML = "";
}

function lapStopwatch() {
  if (!swRunning) return;
  const li = document.createElement("li");
  li.textContent = formatTime(swElapsed);
  lapList.prepend(li);
}

/* --------- POMODORO --------- */
let pomodoro = 25 * 60;
function startPomodoro() {
  const el = document.getElementById("pomodoroTime");
  setInterval(() => {
    if (pomodoro <= 0) return;
    pomodoro--;
    const m = String(Math.floor(pomodoro / 60)).padStart(2, "0");
    const s = String(pomodoro % 60).padStart(2, "0");
    el.textContent = `${m}:${s}`;
  }, 1000);
}
/* --------- PREVISÃO DO TEMPO --------- */

const WEATHER_API_KEY = "SUA_API_KEY_AQUI";

function fetchWeatherByCoords(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`
  )
    .then(res => res.json())
    .then(updateWeatherUI)
    .catch(showWeatherError);
}

function fetchWeatherByCity(city = "São Paulo") {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`
  )
    .then(res => res.json())
    .then(updateWeatherUI)
    .catch(showWeatherError);
}

function updateWeatherUI(data) {
  if (!data || !data.main) {
    showWeatherError();
    return;
  }

  document.getElementById("weatherCity").textContent =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("weatherTemp").textContent =
    `${Math.round(data.main.temp)}°C`;

  document.getElementById("weatherDesc").textContent =
    data.weather[0].description;

  document.getElementById("weatherExtra").textContent =
    `💧 Umidade: ${data.main.humidity}% | 🌬️ Vento: ${data.wind.speed} km/h`;
}

function showWeatherError() {
  document.getElementById("weatherCity").textContent =
    "Clima indisponível";
  document.getElementById("weatherTemp").textContent = "--°C";
  document.getElementById("weatherDesc").textContent =
    "Não foi possível carregar os dados";
}

// Inicialização
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    pos => {
      fetchWeatherByCoords(
        pos.coords.latitude,
        pos.coords.longitude
      );
    },
    () => {
      fetchWeatherByCity(); // fallback
    }
  );
} else {
  fetchWeatherByCity();
}

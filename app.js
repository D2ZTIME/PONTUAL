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

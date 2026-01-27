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

/* --------- ALARME --------- */
let alarms = JSON.parse(localStorage.getItem("alarms")) || [];

function renderAlarms() {
  const list = document.getElementById("alarmList");
  list.innerHTML = "";
  alarms.forEach((a, i) => {
    const li = document.createElement("li");
    li.textContent = `${a.time} - ${a.desc}`;
    li.onclick = () => {
      alarms.splice(i, 1);
      saveAlarms();
    };
    list.appendChild(li);
  });
}

function addAlarm() {
  const time = document.getElementById("alarmTime").value;
  const desc = document.getElementById("alarmDesc").value;
  if (!time) return;
  alarms.push({ time, desc });
  saveAlarms();
}

function saveAlarms() {
  localStorage.setItem("alarms", JSON.stringify(alarms));
  renderAlarms();
}
renderAlarms();

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

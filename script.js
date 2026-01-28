/* PONTUAL v5.5 - Script Completo OTIMIZADO E CORRIGIDO */

// ============ CONFIGURAÇÃO GLOBAL ============
const WEATHER_API_KEY = "1880dbb6574935507201750102a3a6e0"; // ⚠️ SUBSTITUA POR UMA CHAVE VÁLIDA
const DEFAULT_CITY = "Sao Paulo";
const WEATHER_CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

// ============ VARIÁVEIS GLOBAIS ============
let lastWeatherUpdate = 0;
let currentCity = DEFAULT_CITY;
let timeFormat24h = true;
let customTimezones = JSON.parse(localStorage.getItem("customTimezones") || "[]");
let alarms = JSON.parse(localStorage.getItem("alarms") || "[]");
let swInterval = null;
let swTime = 0;
let laps = JSON.parse(localStorage.getItem("laps") || "[]");
let pomoInterval = null;
let pomoTime = 1500;
let pomoStats = JSON.parse(localStorage.getItem("pomoStats") || '{"cycles": 0, "workTime": 0, "breakTime": 0}');
let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let longBreakDuration = 15 * 60;
let cyclesUntilLongBreak = 4;
let currentCycle = 0;
let isWorkSession = true;
let geolocationAttempts = 0;
const MAX_GEOLOCATION_ATTEMPTS = 2;

// ============ SISTEMA DE CACHE PARA CLIMA ============
function getCachedWeather(city) {
    const cacheKey = `weather_${city.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
        try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < WEATHER_CACHE_DURATION) {
                console.log(`📦 Usando cache para ${city}`);
                return data;
            }
        } catch (e) {
            console.warn("Erro ao ler cache:", e);
        }
    }
    return null;
}

function saveWeatherToCache(city, data) {
    try {
        const cacheKey = `weather_${city.toLowerCase().replace(/\s+/g, '_')}`;
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (e) {
        console.warn("Não foi possível salvar no cache:", e);
    }
}

// ============ SISTEMA DE GEOLOCALIZAÇÃO COM RETRY ============
function getLocationWithRetry() {
    return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
            reject(new Error("Geolocalização não suportada"));
            return;
        }
        
        const options = {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 300000
        };
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                geolocationAttempts = 0;
                resolve(position);
            },
            (error) => {
                geolocationAttempts++;
                
                if (geolocationAttempts < MAX_GEOLOCATION_ATTEMPTS) {
                    console.log(`🔄 Tentativa ${geolocationAttempts} de geolocalização falhou, tentando novamente...`);
                    setTimeout(() => {
                        getLocationWithRetry().then(resolve).catch(reject);
                    }, 1000);
                } else {
                    geolocationAttempts = 0;
                    reject(error);
                }
            },
            options
        );
    });
}

// ============ SISTEMA DE CLIMA OTIMIZADO ============
async function updateWeather(force = false) {
    const now = Date.now();
    if (!force && now - lastWeatherUpdate < 900000 && lastWeatherUpdate !== 0) {
        console.log("⏳ Clima atualizado recentemente, usando cache");
        return;
    }
    
    console.log("🌤️ Atualizando clima...");
    updateLocationStatus("Buscando dados do clima...", false);
    showLoadingIndicator(true);
    
    try {
        // Verifica cache para São Paulo primeiro (para resposta rápida)
        const cachedSP = getCachedWeather("São Paulo");
        if (cachedSP) {
            displaySaoPauloData(cachedSP);
        }
        
        // Tenta geolocalização com retry
        try {
            const position = await getLocationWithRetry();
            await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            updateLocationStatus(`📍 Localização obtida`, false);
        } catch (geoError) {
            console.log("📍 Geolocalização falhou, usando fallback:", geoError.message);
            
            // Tenta determinar cidade por IP
            try {
                const ipLocation = await getCityByIP();
                if (ipLocation && ipLocation.city) {
                    await fetchWeatherByCity(ipLocation.city);
                    updateLocationStatus(`📍 ${ipLocation.city} (por IP)`, false);
                } else {
                    throw new Error("IP location failed");
                }
            } catch (ipError) {
                // Fallback final: São Paulo
                await fetchWeatherByCity(DEFAULT_CITY);
                updateLocationStatus(`📍 ${DEFAULT_CITY} (padrão)`, true);
                showLocationHelp();
            }
        }
        
        // CORREÇÃO: Atualiza São Paulo usando a função correta
        await updateSaoPauloWidget();
        
    } catch (error) {
        console.error("❌ Erro no sistema de clima:", error);
        updateLocationStatus("Erro ao buscar dados", true);
        
        // Tenta usar cache como último recurso
        const cached = getCachedWeather(DEFAULT_CITY);
        if (cached) {
            processWeatherData(cached, false);
            updateLocationStatus("Dados em cache", true);
        }
    } finally {
        showLoadingIndicator(false);
        lastWeatherUpdate = Date.now();
        updateLastUpdateTime();
        updateCacheInfo();
    }
}

async function getCityByIP() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('https://ipapi.co/json/', { 
            signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            return {
                city: data.city,
                region: data.region,
                country: data.country_name
            };
        }
    } catch (error) {
        console.log("Localização por IP falhou:", error.message);
    }
    return null;
}

// ============ FUNÇÕES DE BUSCA DE CLIMA ============
async function fetchWeatherByCoords(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API: ${response.status}`);
        }
        
        const data = await response.json();
        processWeatherData(data, true);
        saveWeatherToCache(data.name, data);
        return data;
    } catch (error) {
        console.error("Erro ao buscar clima por coordenadas:", error);
        throw error;
    }
}

async function fetchWeatherByCity(city, useCache = true) {
    if (useCache) {
        const cached = getCachedWeather(city);
        if (cached) {
            processWeatherData(cached, false);
            return;
        }
    }
    
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`;
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404 && city !== DEFAULT_CITY) {
                console.warn(`Cidade "${city}" não encontrada`);
                updateLocationStatus(`Cidade não encontrada`, true);
                return await fetchWeatherByCity(DEFAULT_CITY);
            }
            throw new Error(`API: ${response.status}`);
        }
        
        const data = await response.json();
        processWeatherData(data, false);
        currentCity = city;
        saveWeatherToCache(city, data);
        updateLocationStatus(`📍 ${data.name}`, false);
    } catch (error) {
        console.error("Erro ao buscar clima por cidade:", error);
        updateLocationStatus("Erro na busca", true);
        
        if (city !== DEFAULT_CITY) {
            const cachedDefault = getCachedWeather(DEFAULT_CITY);
            if (cachedDefault) {
                processWeatherData(cachedDefault, false);
                updateLocationStatus(`Usando ${DEFAULT_CITY} (cache)`, true);
            } else {
                await fetchWeatherByCity(DEFAULT_CITY, false);
            }
        }
    }
}

// ============ PROCESSAMENTO E EXIBIÇÃO DE DADOS ============
function processWeatherData(data, isByCoords) {
    if (data.cod !== 200) {
        throw new Error(`Código de erro da API: ${data.cod}`);
    }

    // Mapeamento de ícones
    const iconMap = {
        "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
        "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️"
    };

    const weatherCode = data.weather[0].icon.slice(0, 2);
    const weatherIcon = iconMap[weatherCode] || "🌤️";
    const locationText = isByCoords ? `${data.name} 📍` : data.name;

    // Atualiza elementos principais
    const elements = {
        city: document.getElementById("weatherCity"),
        temp: document.getElementById("weatherTemp"),
        desc: document.getElementById("weatherDesc"),
        feels: document.getElementById("weatherFeels"),
        humidity: document.getElementById("weatherHumidity"),
        wind: document.getElementById("weatherWind"),
        minmax: document.getElementById("weatherMinMax"),
        icon: document.getElementById("weatherIcon")
    };

    if (elements.city) elements.city.textContent = locationText;
    if (elements.temp) elements.temp.textContent = `${Math.round(data.main.temp)}°C`;
    if (elements.desc) elements.desc.textContent = data.weather[0].description;
    if (elements.feels) elements.feels.textContent = `${Math.round(data.main.feels_like)}°C`;
    if (elements.humidity) elements.humidity.textContent = `${data.main.humidity}%`;
    if (elements.wind) elements.wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    if (elements.minmax) elements.minmax.textContent = `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`;
    if (elements.icon) elements.icon.textContent = weatherIcon;

    console.log(`✅ Clima atualizado: ${data.name} - ${Math.round(data.main.temp)}°C`);
}

// CORREÇÃO: Esta função estava como updateSaoPauloWeather em alguns lugares
async function updateSaoPauloWidget() {
    try {
        const cached = getCachedWeather("São Paulo");
        if (cached) {
            displaySaoPauloData(cached);
            return;
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=Sao%20Paulo&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`
        );
        
        if (response.ok) {
            const data = await response.json();
            saveWeatherToCache("São Paulo", data);
            displaySaoPauloData(data);
        }
    } catch (error) {
        console.warn("Não foi possível atualizar São Paulo:", error);
    }
}

function displaySaoPauloData(data) {
    const iconMap = {
        "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
        "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️"
    };
    
    const weatherCode = data.weather[0].icon.slice(0, 2);
    const weatherIcon = iconMap[weatherCode] || "🌤️";
    
    const elements = {
        city: document.getElementById("weatherSPCity"),
        temp: document.getElementById("weatherSPTemp"),
        desc: document.getElementById("weatherSPDesc"),
        icon: document.getElementById("weatherSPIcon"),
        feels: document.getElementById("weatherSPFeels"),
        humidity: document.getElementById("weatherSPHumidity"),
        wind: document.getElementById("weatherSPWind"),
        minmax: document.getElementById("weatherSPMinMax")
    };
    
    if (elements.city) elements.city.textContent = "São Paulo";
    if (elements.temp) elements.temp.textContent = `${Math.round(data.main.temp)}°C`;
    if (elements.desc) elements.desc.textContent = data.weather[0].description;
    if (elements.icon) elements.icon.textContent = weatherIcon;
    if (elements.feels) elements.feels.textContent = `${Math.round(data.main.feels_like)}°C`;
    if (elements.humidity) elements.humidity.textContent = `${data.main.humidity}%`;
    if (elements.wind) elements.wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    if (elements.minmax) elements.minmax.textContent = `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`;
}

// ============ FUNÇÕES DE INTERFACE E FEEDBACK ============
function updateLocationStatus(status, isError) {
    const statusEl = document.getElementById("weatherStatus") || document.getElementById("weatherLocationInfo");
    if (statusEl) {
        const emoji = isError ? "⚠️" : "✅";
        statusEl.textContent = `${emoji} ${status}`;
        statusEl.style.color = isError ? "#ef4444" : "#10b981";
    }
}

function updateLastUpdateTime() {
    const updateEl = document.getElementById("weatherLastUpdate");
    if (updateEl) {
        const now = new Date();
        updateEl.textContent = `Última atualização: ${now.toLocaleTimeString()}`;
    }
}

function updateCacheInfo() {
    const infoEl = document.getElementById("cacheInfo");
    if (infoEl) {
        let cacheCount = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("weather_")) cacheCount++;
        }
        infoEl.textContent = `Cache: ${cacheCount} cidade(s) armazenada(s)`;
    }
}

function showLoadingIndicator(show) {
    let indicator = document.getElementById("loadingIndicator");
    if (!indicator) {
        indicator = document.createElement("div");
        indicator.id = "loadingIndicator";
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #3b82f6;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 1000;
                display: none;
            ">
                🔄 Atualizando clima...
            </div>
        `;
        document.body.appendChild(indicator);
    }
    indicator.style.display = show ? "block" : "none";
}

function showLocationHelp() {
    let helpDiv = document.getElementById("locationHelp");
    if (!helpDiv) {
        helpDiv = document.createElement("div");
        helpDiv.id = "locationHelp";
        helpDiv.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #fef3c7;
                color: #92400e;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 500px;
                width: 90%;
                z-index: 1000;
                display: none;
            ">
                <strong>📍 Dica de Localização</strong>
                <p style="margin: 8px 0;">Para ver o clima da sua cidade:</p>
                <ol style="margin: 8px 0; padding-left: 20px;">
                    <li>Clique no 🔒 no início da barra de endereço</li>
                    <li>Permita "Localização"</li>
                    <li>Atualize a página</li>
                </ol>
                <button onclick="this.parentElement.style.display='none'" 
                        style="background: #92400e; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                    Entendi
                </button>
            </div>
        `;
        document.body.appendChild(helpDiv);
    }
    helpDiv.style.display = "block";
}

// ============ FUNÇÕES DE CONTROLE DO CLIMA ============
function searchCity() {
    const input = document.getElementById("citySearch") || document.getElementById("manualCityInput");
    if (!input) return;
    
    const city = input.value.trim();
    if (!city) {
        alert("Digite o nome de uma cidade");
        return;
    }
    
    fetchWeatherByCity(city);
    input.value = "";
}

function useMyLocation() {
    geolocationAttempts = 0;
    updateWeather(true);
}

function refreshWeather() {
    updateWeather(true);
}

// ============ NAVEGAÇÃO ============
function showTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.add('hidden'));
    const tab = document.getElementById(id);
    if (tab) {
        tab.classList.remove('hidden');
        
        // Ações específicas por aba
        if (id === 'weather') {
            setTimeout(() => updateWeather(), 300);
        }
    }
}

// ============ RELÓGIO ============
function updateClock() {
    const d = new Date();
    
    // Atualiza clima a cada 5 minutos
    if (d.getMinutes() % 5 === 0 && d.getSeconds() === 0) {
        updateWeather();
    }
    
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    if (timeFormat24h) {
        document.getElementById("time").textContent = `${hours}:${minutes}:${seconds}`;
    } else {
        const h12 = d.getHours() % 12 || 12;
        const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
        document.getElementById("time").textContent = `${String(h12).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    }

    // Data
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    document.getElementById("date").textContent = `${day}/${month}/${year}`;

    // Fusos padrão
    const timeZones = {
        sp: { timeZone: 'America/Sao_Paulo', locale: 'pt-BR' },
        ny: { timeZone: 'America/New_York', locale: 'en-US' },
        ld: { timeZone: 'Europe/London', locale: 'en-GB' },
        pa: { timeZone: 'Europe/Paris', locale: 'fr-FR' },
        tk: { timeZone: 'Asia/Tokyo', locale: 'ja-JP' },
        sy: { timeZone: 'Australia/Sydney', locale: 'en-AU' }
    };

    Object.keys(timeZones).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = d.toLocaleTimeString(timeZones[id].locale, { 
                timeZone: timeZones[id].timeZone 
            });
        }
    });

    // Fusos customizados
    renderCustomTimezones();
}

function toggleTimeFormat() {
    timeFormat24h = !timeFormat24h;
    updateClock();
}

function addCustomTimezone() {
    const name = document.getElementById("tzName")?.value;
    const offset = document.getElementById("tzOffset")?.value;

    if (!name || !offset) {
        alert("Preencha todos os campos");
        return;
    }

    customTimezones.push({ name, offset });
    localStorage.setItem("customTimezones", JSON.stringify(customTimezones));
    
    const nameInput = document.getElementById("tzName");
    const offsetInput = document.getElementById("tzOffset");
    if (nameInput) nameInput.value = "";
    if (offsetInput) offsetInput.value = "";
    
    renderCustomTimezones();
}

function renderCustomTimezones() {
    const list = document.getElementById("customTzList");
    if (!list) return;
    
    list.innerHTML = "";

    customTimezones.forEach((tz, idx) => {
        const d = new Date();
        try {
            const time = d.toLocaleTimeString('en-US', { timeZone: tz.offset });
            const div = document.createElement("div");
            div.className = "timezone-item";
            div.innerHTML = `
                <span class="tz-name">${tz.name}</span>
                <span class="tz-time">${time}</span>
                <button onclick="removeCustomTimezone(${idx})" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; margin-top: 5px;">✕</button>
            `;
            list.appendChild(div);
        } catch (e) {
            console.error("Fuso horário inválido:", tz.offset);
        }
    });
}

function removeCustomTimezone(idx) {
    customTimezones.splice(idx, 1);
    localStorage.setItem("customTimezones", JSON.stringify(customTimezones));
    renderCustomTimezones();
}

// ============ ALARMES ============
function saveAlarm() {
    const time = document.getElementById("alarmTime")?.value;
    const day = document.getElementById("alarmDay")?.value || "Todos";
    const label = document.getElementById("alarmLabel")?.value || "Alarme";

    if (!time) {
        alert("Por favor, defina um horário");
        return;
    }

    if (alarms.length >= 10) {
        alert("Máximo de 10 alarmes atingido");
        return;
    }

    alarms.push({
        id: Date.now(),
        t: time,
        d: day,
        l: label
    });

    localStorage.setItem("alarms", JSON.stringify(alarms));
    
    const timeInput = document.getElementById("alarmTime");
    const labelInput = document.getElementById("alarmLabel");
    const daySelect = document.getElementById("alarmDay");
    
    if (timeInput) timeInput.value = "";
    if (labelInput) labelInput.value = "";
    if (daySelect) daySelect.value = "Todos";
    
    renderAlarms();
}

function deleteAlarm(id) {
    alarms = alarms.filter(a => a.id !== id);
    localStorage.setItem("alarms", JSON.stringify(alarms));
    renderAlarms();
}

function renderAlarms() {
    const alarmList = document.getElementById("alarmList");
    const noAlarms = document.getElementById("noAlarms");

    if (!alarmList || !noAlarms) return;

    alarmList.innerHTML = "";

    if (alarms.length === 0) {
        noAlarms.style.display = "block";
        return;
    }

    noAlarms.style.display = "none";

    alarms.forEach(a => {
        const li = document.createElement("li");
        li.className = "alarm-item";
        li.innerHTML = `
            <div class="alarm-info">
                <div class="alarm-time">${a.t}</div>
                <div class="alarm-details">
                    <strong>${a.l}</strong> - ${a.d}
                </div>
            </div>
            <div class="alarm-buttons">
                <button class="btn-delete" onclick="deleteAlarm(${a.id})">🗑️ Deletar</button>
            </div>
        `;
        alarmList.appendChild(li);
    });
}

// Verificação de alarmes
setInterval(() => {
    const now = new Date();
    const cur = now.toTimeString().slice(0, 5);
    const day = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"][now.getDay()];
    
    alarms.forEach(a => {
        if (a.t === cur && (a.d === "Todos" || a.d === day)) {
            triggerAlarm(a);
        }
    });
}, 60000);

// ============ CORREÇÃO: SISTEMA DE SOM (ALARME E POMODORO) ============

function triggerAlarm(alarm) {
    const alarmSound = document.getElementById("alarmSound");
    
    if (alarmSound) {
        // Resetar o som caso ele já esteja tocando
        alarmSound.pause();
        alarmSound.currentTime = 0;
        
        // Promessa para lidar com restrições de autoplay do navegador
        alarmSound.play().catch(e => {
            console.warn("Autoplay bloqueado pelo navegador. Interaja com a página para habilitar o som.", e);
        });
    }

    // Notificação Visual
    if (Notification.permission === "granted") {
        new Notification("⏰ Alarme PONTUAL", {
            body: `${alarm.l} - ${alarm.t}`,
            icon: "🔔"
        });
    } else {
        alert(`⏰ ALARME: ${alarm.l} (${alarm.t})`);
    }
}

function completePomo() {
    clearInterval(pomoInterval);
    pomoInterval = null;

    if (isWorkSession) {
        pomoStats.cycles++;
        pomoStats.workTime += workDuration;
        currentCycle++;

        if (currentCycle >= cyclesUntilLongBreak) {
            pomoTime = longBreakDuration;
            currentCycle = 0;
        } else {
            pomoTime = breakDuration;
        }
    } else {
        pomoStats.breakTime += breakDuration;
        pomoTime = workDuration;
    }

    isWorkSession = !isWorkSession;
    localStorage.setItem("pomoStats", JSON.stringify(pomoStats));

    // --- LÓGICA DE SOM CORRIGIDA ---
    const notificationSound = document.getElementById("notificationSound");
    const soundEnabled = document.getElementById("enableSound")?.checked;

    if (notificationSound && soundEnabled) {
        notificationSound.pause();
        notificationSound.currentTime = 0;
        notificationSound.play().catch(err => console.log("Erro ao tocar som do Pomodoro:", err));
    }
    // -------------------------------

    updatePomo();
    updatePomoStatus();
    updatePomoStats();

    if (document.getElementById("enableNotifications")?.checked && Notification.permission === "granted") {
        const msg = isWorkSession ? "Pausa terminada! Volta ao trabalho!" : "Trabalho completado! Hora de descansar!";
        new Notification("🍅 Pomodoro", { body: msg });
    }
}

// ============ CRONÔMETRO ============
function startSW() {
    if (swInterval) return;
    swInterval = setInterval(() => {
        swTime += 10;
        updateSWDisplay();
    }, 10);
    
    const lapBtn = document.getElementById("lapBtn");
    if (lapBtn) lapBtn.disabled = false;
}

function stopSW() {
    clearInterval(swInterval);
    swInterval = null;
}

function resetSW() {
    stopSW();
    swTime = 0;
    laps = [];
    localStorage.setItem("laps", JSON.stringify(laps));
    updateSWDisplay();
    renderLaps();
    
    const lapBtn = document.getElementById("lapBtn");
    if (lapBtn) lapBtn.disabled = true;
}

function recordLap() {
    if (!swInterval) return;

    laps.push({
        number: laps.length + 1,
        time: swTime
    });

    localStorage.setItem("laps", JSON.stringify(laps));
    renderLaps();
}

function updateSWDisplay() {
    const swElement = document.getElementById("sw");
    if (!swElement) return;
    
    const totalSeconds = Math.floor(swTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((swTime % 1000) / 10);

    swElement.textContent = `${minutes}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}

function renderLaps() {
    const lapsList = document.getElementById("lapsList");
    const noLaps = document.getElementById("noLaps");

    if (!lapsList || !noLaps) return;

    lapsList.innerHTML = "";

    if (laps.length === 0) {
        noLaps.style.display = "block";
        document.getElementById("bestLap").textContent = "--:--:--";
        document.getElementById("worstLap").textContent = "--:--:--";
        document.getElementById("totalLaps").textContent = "0";
        return;
    }

    noLaps.style.display = "none";

    let bestTime = Infinity;
    let worstTime = 0;

    laps.forEach(lap => {
        const lapSeconds = Math.floor(lap.time / 1000);
        const lapMinutes = Math.floor(lapSeconds / 60);
        const lapSec = lapSeconds % 60;
        const lapMs = Math.floor((lap.time % 1000) / 10);

        const li = document.createElement("li");
        li.className = "lap-item";
        li.innerHTML = `
            <span class="lap-number">Volta ${lap.number}</span>
            <span class="lap-time">${lapMinutes}:${String(lapSec).padStart(2, '0')}:${String(lapMs).padStart(2, '0')}</span>
        `;
        lapsList.appendChild(li);

        if (lap.time < bestTime) bestTime = lap.time;
        if (lap.time > worstTime) worstTime = lap.time;
    });

    const formatTime = (ms) => {
        const totalSec = Math.floor(ms / 1000);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;
        const ms2 = Math.floor((ms % 1000) / 10);
        return `${min}:${String(sec).padStart(2, '0')}:${String(ms2).padStart(2, '0')}`;
    };

    document.getElementById("bestLap").textContent = formatTime(bestTime);
    document.getElementById("worstLap").textContent = formatTime(worstTime);
    document.getElementById("totalLaps").textContent = laps.length;
}

// ============ POMODORO ============
function setPomo(min) {
    resetPomo();
    workDuration = min * 60;
    pomoTime = workDuration;
    updatePomo();
}

function updatePomo() {
    const pomoElement = document.getElementById("pomo");
    if (!pomoElement) return;
    
    const minutes = Math.floor(pomoTime / 60);
    const seconds = pomoTime % 60;
    pomoElement.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function startPomo() {
    if (pomoInterval) return;

    pomoInterval = setInterval(() => {
        pomoTime--;
        updatePomo();

        if (pomoTime <= 0) {
            completePomo();
        }
    }, 1000);

    updatePomoStatus();
}

function pausePomo() {
    clearInterval(pomoInterval);
    pomoInterval = null;
    updatePomoStatus();
}

function resetPomo() {
    pausePomo();
    pomoTime = workDuration;
    isWorkSession = true;
    currentCycle = 0;
    updatePomo();
    updatePomoStatus();
}

function completePomo() {
    clearInterval(pomoInterval);
    pomoInterval = null;

    if (isWorkSession) {
        pomoStats.cycles++;
        pomoStats.workTime += workDuration;
        currentCycle++;

        if (currentCycle >= cyclesUntilLongBreak) {
            pomoTime = longBreakDuration;
            currentCycle = 0;
        } else {
            pomoTime = breakDuration;
        }
    } else {
        pomoStats.breakTime += breakDuration;
        pomoTime = workDuration;
    }

    isWorkSession = !isWorkSession;
    localStorage.setItem("pomoStats", JSON.stringify(pomoStats));

    // Som de notificação
    try {
        const notificationSound = document.getElementById("notificationSound");
        if (notificationSound && document.getElementById("enableSound")?.checked) {
            notificationSound.play();
        }
    } catch (e) {}
    
    updatePomo();
    updatePomoStatus();
    updatePomoStats();

    // Notificação
    if (document.getElementById("enableNotifications")?.checked && Notification.permission === "granted") {
        const msg = isWorkSession ? "Pausa terminada! Volta ao trabalho!" : "Trabalho completado! Hora de descansar!";
        new Notification("🍅 Pomodoro", { body: msg });
    }
}

function updatePomoStatus() {
    const statusElement = document.getElementById("pomoStatus");
    if (!statusElement) return;
    
    const status = pomoInterval ? (isWorkSession ? "🔴 Trabalhando..." : "🟢 Descansando...") : "⏸ Pausado";
    statusElement.textContent = status;
}

function updatePomoStats() {
    document.getElementById("completedCycles").textContent = pomoStats.cycles;

    const workHours = Math.floor(pomoStats.workTime / 3600);
    const workMinutes = Math.floor((pomoStats.workTime % 3600) / 60);
    document.getElementById("totalWorkTime").textContent = `${workHours}h ${workMinutes}m`;

    const breakHours = Math.floor(pomoStats.breakTime / 3600);
    const breakMinutes = Math.floor((pomoStats.breakTime % 3600) / 60);
    document.getElementById("totalBreakTime").textContent = `${breakHours}h ${breakMinutes}m`;

    document.getElementById("currentSession").textContent = isWorkSession ? "Trabalho" : "Pausa";
}

function applyPomoSettings() {
    const workInput = document.getElementById("workDuration");
    const breakInput = document.getElementById("breakDuration");
    const longBreakInput = document.getElementById("longBreakDuration");
    const cyclesInput = document.getElementById("cyclesUntilLongBreak");
    
    if (workInput) workDuration = parseInt(workInput.value) * 60;
    if (breakInput) breakDuration = parseInt(breakInput.value) * 60;
    if (longBreakInput) longBreakDuration = parseInt(longBreakInput.value) * 60;
    if (cyclesInput) cyclesUntilLongBreak = parseInt(cyclesInput.value);

    resetPomo();
    alert("Configurações aplicadas!");
}

// ============ INICIALIZAÇÃO ============
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 PONTUAL v5.5 inicializando...");
    
    // Mostra aba do relógio por padrão
    showTab('clock');
    
    // Inicializa componentes
    updateClock();
    renderAlarms();
    renderLaps();
    renderCustomTimezones();
    updatePomo();
    updatePomoStatus();
    updatePomoStats();
    updateSWDisplay();
    
    // Solicita permissões
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    
    // Inicia relógio
    setInterval(updateClock, 1000);
    
    // Inicia clima após 1 segundo
    setTimeout(() => {
        updateWeather();
        updateSaoPauloWidget();
    }, 1000);
    
    // Atualiza clima a cada 15 minutos
    setInterval(updateWeather, 900000);
    
    // Atualiza cache info periodicamente
    setInterval(updateCacheInfo, 60000);
    
    console.log("✅ PONTUAL v5.5 inicializado com sucesso!");
});

// ============ EXPORTA FUNÇÕES GLOBAIS ============
window.showTab = showTab;
window.toggleTimeFormat = toggleTimeFormat;
window.addCustomTimezone = addCustomTimezone;
window.removeCustomTimezone = removeCustomTimezone;
window.saveAlarm = saveAlarm;
window.deleteAlarm = deleteAlarm;
window.startSW = startSW;
window.stopSW = stopSW;
window.resetSW = resetSW;
window.recordLap = recordLap;
window.setPomo = setPomo;
window.startPomo = startPomo;
window.pausePomo = pausePomo;
window.resetPomo = resetPomo;
window.applyPomoSettings = applyPomoSettings;
window.searchCity = searchCity;
window.useMyLocation = useMyLocation;
window.refreshWeather = refreshWeather;
window.updateWeather = updateWeather;
window.fetchWeatherByCity = fetchWeatherByCity;

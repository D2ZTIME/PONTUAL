import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Bell } from "lucide-react";
import { toast } from "sonner";

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

/**
 * Componente de Alarmes com funcionalidade de criar, editar e deletar alarmes.
 * Os alarmes são persistidos em localStorage e notificam o usuário quando acionados.
 */
export default function Alarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState("");
  const [newAlarmLabel, setNewAlarmLabel] = useState("Alarme");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Carrega alarmes do localStorage ao montar o componente
  useEffect(() => {
    const savedAlarms = localStorage.getItem("alarms");
    if (savedAlarms) {
      try {
        setAlarms(JSON.parse(savedAlarms));
      } catch (error) {
        console.error("Erro ao carregar alarmes:", error);
      }
    }
  }, []);

  // Atualiza a hora atual a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Salva alarmes no localStorage sempre que a lista muda
  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  // Verifica se algum alarme deve disparar
  useEffect(() => {
    alarms.forEach((alarm) => {
      if (!alarm.enabled) return;

      const [alarmHours, alarmMinutes] = alarm.time.split(":").map(Number);
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      if (currentHours === alarmHours && currentMinutes === alarmMinutes) {
        triggerAlarm(alarm);
      }
    });
  }, [currentTime, alarms]);

  const triggerAlarm = (alarm: Alarm) => {
    // Toca um som de alarme
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Notificação do navegador
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`🔔 ${alarm.label}`, {
        body: `Alarme para ${alarm.time}`,
        icon: "🔔",
      });
    }

    toast.success(`Alarme: ${alarm.label}`);
  };

  const addAlarm = () => {
    if (!newAlarmTime) {
      toast.error("Por favor, defina um horário");
      return;
    }

    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: newAlarmTime,
      label: newAlarmLabel || "Alarme",
      enabled: true,
    };

    setAlarms([...alarms, newAlarm]);
    setNewAlarmTime("");
    setNewAlarmLabel("Alarme");
    toast.success("Alarme adicionado com sucesso!");
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
    toast.success("Alarme removido");
  };

  const toggleAlarm = (id: string) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        toast.info("Notificações já estão ativadas");
        return;
      }

      if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          toast.success("Notificações ativadas!");
        }
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold text-white">Alarmes</h1>
          </div>
          <p className="text-slate-400">Gerencie seus alarmes e receba notificações</p>
        </div>

        {/* Hora Atual */}
        <Card className="bg-slate-800 border-slate-700 mb-6 p-6">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">Hora Atual</p>
            <p className="text-5xl font-bold text-white font-mono">
              {formatTime(currentTime)}
            </p>
          </div>
        </Card>

        {/* Adicionar Novo Alarme */}
        <Card className="bg-slate-800 border-slate-700 mb-6 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Novo Alarme</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="time"
                value={newAlarmTime}
                onChange={(e) => setNewAlarmTime(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white flex-1"
                placeholder="Horário"
              />
              <Input
                type="text"
                value={newAlarmLabel}
                onChange={(e) => setNewAlarmLabel(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white flex-1"
                placeholder="Descrição do alarme"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={addAlarm}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Alarme
              </Button>
              <Button
                onClick={requestNotificationPermission}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Ativar Notificações
              </Button>
            </div>
          </div>
        </Card>

        {/* Lista de Alarmes */}
        <div className="space-y-3">
          {alarms.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700 p-8 text-center">
              <p className="text-slate-400">Nenhum alarme configurado</p>
              <p className="text-slate-500 text-sm mt-2">
                Adicione um novo alarme acima para começar
              </p>
            </Card>
          ) : (
            alarms.map((alarm) => (
              <Card
                key={alarm.id}
                className={`border-slate-700 p-4 transition-all ${
                  alarm.enabled
                    ? "bg-slate-800 border-amber-500/50"
                    : "bg-slate-900 border-slate-700 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={alarm.enabled}
                        onChange={() => toggleAlarm(alarm.id)}
                        className="w-5 h-5 rounded border-slate-600 bg-slate-700 cursor-pointer accent-amber-500"
                      />
                      <div>
                        <p className="text-white font-semibold text-lg">
                          {alarm.time}
                        </p>
                        <p className="text-slate-400 text-sm">{alarm.label}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteAlarm(alarm.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Info Footer */}
        {alarms.length > 0 && (
          <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <p className="text-slate-400 text-sm">
              💡 <span className="font-semibold">Dica:</span> Os alarmes são salvos
              automaticamente. Desmarque a caixa para desativar um alarme sem deletá-lo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

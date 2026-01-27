import { useState } from 'react';
import { Bell, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Alarm {
  id: string;
  time: string;
  days: string[];
  description: string;
  enabled: boolean;
}

const daysOfWeek = [
  { key: 'seg', label: 'S' },
  { key: 'ter', label: 'T' },
  { key: 'qua', label: 'Q' },
  { key: 'qui', label: 'Q' },
  { key: 'sex', label: 'S' },
  { key: 'sab', label: 'S' },
  { key: 'dom', label: 'D' },
];

const Alarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAlarm, setNewAlarm] = useState({
    time: '08:00',
    days: [] as string[],
    description: '',
  });

  const toggleDay = (day: string) => {
    setNewAlarm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  const addAlarm = () => {
    if (newAlarm.time) {
      setAlarms([
        ...alarms,
        {
          id: Date.now().toString(),
          ...newAlarm,
          enabled: true,
        },
      ]);
      setNewAlarm({ time: '08:00', days: [], description: '' });
      setDialogOpen(false);
    }
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const formatDays = (days: string[]) => {
    if (days.length === 0) return 'Uma vez';
    if (days.length === 7) return 'Todos os dias';
    return days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ');
  };

  return (
    <div className="section-card card-glow-alarm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[hsl(var(--alarm-accent)/0.2)]">
            <Bell className="w-6 h-6 text-alarm" />
          </div>
          <h2 className="text-xl font-semibold">Alarmes</h2>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Alarme
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Criar Alarme</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div>
                <Label className="text-muted-foreground">Horário</Label>
                <Input
                  type="time"
                  value={newAlarm.time}
                  onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                  className="mt-2 bg-secondary border-border text-3xl font-mono h-16 text-center"
                />
              </div>

              <div>
                <Label className="text-muted-foreground">Repetir</Label>
                <div className="flex gap-2 mt-2">
                  {daysOfWeek.map((day, index) => (
                    <button
                      key={day.key + index}
                      onClick={() => toggleDay(day.key)}
                      className={`day-toggle ${
                        newAlarm.days.includes(day.key)
                          ? 'day-toggle-active'
                          : 'day-toggle-inactive'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Descrição (opcional)</Label>
                <Input
                  value={newAlarm.description}
                  onChange={(e) => setNewAlarm({ ...newAlarm, description: e.target.value })}
                  placeholder="Ex: Acordar, Reunião..."
                  className="mt-2 bg-secondary border-border"
                />
              </div>

              <Button onClick={addAlarm} className="w-full btn-alarm">
                Criar Alarme
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {alarms.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Nenhum alarme programado</p>
            <p className="text-sm">Clique em "Novo Alarme" para criar</p>
          </div>
        ) : (
          alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`flex items-center justify-between p-4 rounded-xl bg-secondary/50 transition-opacity ${
                !alarm.enabled ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <Switch
                  checked={alarm.enabled}
                  onCheckedChange={() => toggleAlarm(alarm.id)}
                />
                <div>
                  <p className="font-mono text-2xl font-semibold text-alarm">
                    {alarm.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {alarm.description || formatDays(alarm.days)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteAlarm(alarm.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alarms;

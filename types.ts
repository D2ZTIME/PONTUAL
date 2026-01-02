
export enum AppMode {
  CLOCK = 'clock',
  ALARM = 'alarm',
  STOPWATCH = 'stopwatch',
  TIMER = 'timer',
  POMODORO = 'pomodoro'
}

export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  repeat: string[]; // ['Mon', 'Tue', ...]
}

export interface Lap {
  id: string;
  time: number;
  overallTime: number;
}

export enum AppMode {
  CLOCK = 'clock',
  ALARM = 'alarm',
  STOPWATCH = 'stopwatch',
  TIMER = 'timer',
  POMODORO = 'pomodoro',
  STATS = 'stats',
  TODO = 'todo',
  SETTINGS = 'settings'
}

export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  repeat: string[];
}

export interface Lap {
  id: string;
  time: number;
  overallTime: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface PomodoroSession {
  id: string;
  duration: number; // em minutos
  timestamp: number;
  type: 'work' | 'break';
}

export type ThemeColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'purple';

export interface UserSettings {
  theme: ThemeColor;
  notificationsEnabled: boolean;
  voiceCommandsEnabled: boolean;
  pomodoroWorkTime: number;
  pomodoroBreakTime: number;
}

import React, { useState, useEffect } from 'react';
import { AppMode } from './types.ts';
import { useLocalStorage } from './hooks/useLocalStorage.ts';
import { useVoiceCommands } from './hooks/useVoiceCommands.ts';
import { UserSettings } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import ClockView from './components/ClockView.tsx';
import AlarmView from './components/AlarmView.tsx';
import StopwatchView from './components/StopwatchView.tsx';
import TimerView from './components/TimerView.tsx';
import PomodoroView from './components/PomodoroView.tsx';
import TodoView from './components/TodoView.tsx';
import StatsView from './components/StatsView.tsx';
import SettingsView from './components/SettingsView.tsx';
import SmartAdvice from './components/SmartAdvice.tsx';

/**
 * PONTUAL | Dashboard de Produtividade
 * Componente central que orquestra a navegação e o estado global.
 */
const App: React.FC = () => {
  // Configurações e Temas
  const [settings] = useLocalStorage<UserSettings>('pontual_settings', {
    theme: 'indigo',
    notificationsEnabled: true,
    voiceCommandsEnabled: false,
    pomodoroWorkTime: 25,
    pomodoroBreakTime: 5
  });

  // Estado de navegação persistente
  const [currentMode, setCurrentMode] = useLocalStorage<AppMode>('pontual_current_mode', AppMode.CLOCK);
  
  // Ativar Comandos de Voz
  useVoiceCommands(settings.voiceCommandsEnabled, setCurrentMode);

  // Estado do tempo global (Sincronizado para todos os componentes)
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Renderizador de Conteúdo Dinâmico
   * Alterna entre as ferramentas mantendo a consistência visual.
   */
  const renderContent = () => {
    switch (currentMode) {
      case AppMode.CLOCK: 
        return <ClockView time={currentTime} />;
      case AppMode.ALARM: 
        return <AlarmView />;
      case AppMode.STOPWATCH: 
        return <StopwatchView />;
      case AppMode.TIMER: 
        return <TimerView />;
      case AppMode.POMODORO: 
        return <PomodoroView />;
      case AppMode.TODO: 
        return <TodoView />;
      case AppMode.STATS: 
        return <StatsView />;
      case AppMode.SETTINGS: 
        return <SettingsView />;
      default: 
        return <ClockView time={currentTime} />;
    }
  };

  // Mapeamento de cores de tema para classes Tailwind
  const themeClasses: Record<string, string> = {
    indigo: 'selection:bg-indigo-500/30 [--accent:theme(colors.indigo.500)]',
    emerald: 'selection:bg-emerald-500/30 [--accent:theme(colors.emerald.500)]',
    rose: 'selection:bg-rose-500/30 [--accent:theme(colors.rose.500)]',
    amber: 'selection:bg-amber-500/30 [--accent:theme(colors.amber.500)]',
    purple: 'selection:bg-purple-500/30 [--accent:theme(colors.purple.500)]',
  };

  return (
    <div className={`flex flex-col md:flex-row h-screen w-screen bg-[#030712] text-gray-100 overflow-hidden ${themeClasses[settings.theme]}`}>
      
      {/* Navegação Lateral/Inferior Otimizada */}
      <Sidebar activeMode={currentMode} onSelectMode={setCurrentMode} />

      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        
        {/* Camada de Gradiente de Fundo (Aura) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-transparent pointer-events-none"></div>

        {/* Área Principal de Conteúdo */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scroll p-6 md:p-12 lg:p-16 z-10">
          
          {/* Header Discreto do Dashboard */}
          <header className="flex justify-between items-center mb-8 md:mb-12">
            <div className="flex flex-col">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] opacity-80">
                Dashboard de Produtividade
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            
            {/* Tag de Versão e Status */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">v1.2.0 Stable</span>
              </div>
            </div>
          </header>

          {/* Renderização da Ferramenta Ativa */}
          <div className="flex-1 flex items-center justify-center w-full max-w-6xl mx-auto transition-all duration-500 ease-in-out">
            <div className="w-full animate-in fade-in zoom-in-95 duration-700">
              {renderContent()}
            </div>
          </div>

          {/* Insights de IA Contextuais */}
          <footer className="max-w-2xl mx-auto w-full mt-12 mb-24 md:mb-0">
             <SmartAdvice mode={currentMode} />
          </footer>
        </div>

        {/* Efeito de Vinheta nas bordas */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none"></div>
      </main>
    </div>
  );
};

export default App;

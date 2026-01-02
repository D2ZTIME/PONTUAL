
import React, { useState, useEffect } from 'react';
import { AppMode } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import ClockView from './components/ClockView.tsx';
import AlarmView from './components/AlarmView.tsx';
import StopwatchView from './components/StopwatchView.tsx';
import TimerView from './components/TimerView.tsx';
import PomodoroView from './components/PomodoroView.tsx';
import SmartAdvice from './components/SmartAdvice.tsx';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.CLOCK);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderContent = () => {
    switch (currentMode) {
      case AppMode.CLOCK: return <ClockView time={currentTime} />;
      case AppMode.ALARM: return <AlarmView />;
      case AppMode.STOPWATCH: return <StopwatchView />;
      case AppMode.TIMER: return <TimerView />;
      case AppMode.POMODORO: return <PomodoroView />;
      default: return <ClockView time={currentTime} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#030712] text-gray-100 overflow-hidden">
      <Sidebar activeMode={currentMode} onSelectMode={setCurrentMode} />

      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scroll p-6 md:p-12 lg:p-20">
          
          <div className="flex-1 flex items-center justify-center max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>

          {/* AI Insights - Fixed but discrete */}
          <div className="max-w-xl mx-auto w-full mt-12 mb-20 md:mb-0 animate-in slide-in-up duration-1000">
             <SmartAdvice mode={currentMode} />
          </div>
        </div>

        {/* Floating Version Tag */}
        <div className="absolute top-6 right-6 hidden md:block">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-indigo-500/50 transition-colors cursor-default">
              Pontual v1.2.0-STABLE
            </span>
        </div>
      </main>
    </div>
  );
};

export default App;

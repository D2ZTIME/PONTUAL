import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Clock, Zap } from "lucide-react";
import { useLocation } from "wouter";

/**
 * Página inicial do PONTUAL - Aplicação de Gerenciamento de Tempo
 * Design elegante com tema escuro e gradiente sofisticado
 */
export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">PONTUAL</h1>
          </div>
          <p className="text-slate-400 text-sm">Gerenciador de Tempo & Produtividade</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Bem-vindo ao PONTUAL</h2>
          <p className="text-xl text-slate-300 max-w-2xl">
            Sua solução completa para gerenciar tempo, alarmes, cronômetros e técnicas de
            produtividade como Pomodoro.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Alarmes Card */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-amber-500/50 transition-all p-6 cursor-pointer group" onClick={() => setLocation("/alarms")}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors">
                <Bell className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Alarmes</h3>
            </div>
            <p className="text-slate-400 mb-4">
              Configure alarmes personalizados com notificações. Adicione, edite e delete
              alarmes facilmente.
            </p>
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
              Gerenciar Alarmes
            </Button>
          </Card>

          {/* Relógio Card */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Relógio</h3>
            </div>
            <p className="text-slate-400 mb-4">
              Visualize a hora atual com suporte a múltiplos fusos horários ao redor do
              mundo.
            </p>
            <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700" disabled>
              Em Breve
            </Button>
          </Card>

          {/* Pomodoro Card */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Pomodoro</h3>
            </div>
            <p className="text-slate-400 mb-4">
              Aumente sua produtividade com ciclos de trabalho e pausa bem definidos.
            </p>
            <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700" disabled>
              Em Breve
            </Button>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="bg-slate-800 border-slate-700 p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Sobre PONTUAL v5.0</h3>
          <p className="text-slate-300 mb-4">
            PONTUAL é uma aplicação web moderna que oferece ferramentas essenciais para
            gerenciar seu tempo de forma eficiente. Com uma interface intuitiva e recursos
            poderosos, você pode:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Criar e gerenciar alarmes personalizados
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Visualizar a hora em diferentes fusos horários
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Usar a técnica Pomodoro para melhorar a produtividade
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Acessar a aplicação offline como um PWA
            </li>
          </ul>
        </Card>
      </main>
    </div>
  );
}

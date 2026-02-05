"use client"

import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/ui/stats-card"
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para el dashboard
const recentActivity = [
  {
    id: 1,
    user: "Valentina Rios",
    action: "completó el módulo",
    target: "Técnicas Avanzadas",
    time: "Hace 5 min",
  },
  {
    id: 2,
    user: "Camila Torres",
    action: "se registró en",
    target: "WC Training",
    time: "Hace 23 min",
  },
  {
    id: 3,
    user: "Isabella Luna",
    action: "inició el curso",
    target: "Fundamentos",
    time: "Hace 1 hora",
  },
  {
    id: 4,
    user: "Sofia Mendoza",
    action: "alcanzó nivel",
    target: "Gold",
    time: "Hace 2 horas",
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Header
        title="Dashboard"
        description="Bienvenido al panel de administración de WC Training"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            label="Total Modelos"
            value={124}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            label="Modelos Activas"
            value={98}
            icon={UserCheck}
            trend={{ value: 2, isPositive: true }}
            highlight
          />
          <StatsCard
            label="Ingresos del Mes"
            value="$12,450"
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            label="Tasa de Conversión"
            value="24.8%"
            icon={TrendingUp}
            trend={{ value: 4, isPositive: true }}
          />
        </div>

        {/* Quick Actions & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Accesos Rápidos</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/models"
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Gestión de Modelos</p>
                    <p className="text-xs text-slate-400">124 registradas</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </Link>

              <Link
                href="/dashboard/studios"
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Estudios</p>
                    <p className="text-xs text-slate-400">12 activos</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </Link>

              <Link
                href="/dashboard/reports"
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Reportes</p>
                    <p className="text-xs text-slate-400">Ver analíticas</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Actividad Reciente</h3>
              <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Ver todo
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-blue-600/20 flex items-center justify-center text-white text-sm font-bold">
                      {activity.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-white">
                        <span className="font-semibold">{activity.user}</span>{" "}
                        <span className="text-slate-400">{activity.action}</span>{" "}
                        <span className="font-semibold text-blue-400">{activity.target}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

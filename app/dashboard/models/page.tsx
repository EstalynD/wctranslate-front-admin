"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/ui/stats-card"
import { FilterBar } from "@/components/ui/filter-bar"
import { Pagination } from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/progress-bar"
import {
  Users,
  UserCheck,
  UserPlus,
  Eye,
  Pencil,
  Ban,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface Model {
  id: string
  name: string
  email: string
  avatar?: string
  level: "diamond" | "gold" | "silver" | "banned"
  lastConnection: string
  trainingProgress: number
  status: "active" | "inactive" | "suspended"
}

// Mock Data
const mockModels: Model[] = [
  {
    id: "WCT-9042",
    name: "Valentina Rios",
    email: "v.rios@studio.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    level: "diamond",
    lastConnection: "Hace 14 min",
    trainingProgress: 92,
    status: "active",
  },
  {
    id: "WCT-8821",
    name: "Camila Torres",
    email: "c.torres@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    level: "gold",
    lastConnection: "Hace 2 horas",
    trainingProgress: 65,
    status: "active",
  },
  {
    id: "WCT-9100",
    name: "Isabella Luna",
    email: "luna_isa@outlook.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    level: "silver",
    lastConnection: "Hace 3 días",
    trainingProgress: 12,
    status: "inactive",
  },
  {
    id: "WCT-7789",
    name: "Sofia Mendoza",
    email: "s.mendoza@studio.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    level: "banned",
    lastConnection: "Hace 1 mes",
    trainingProgress: 45,
    status: "suspended",
  },
]

const levelLabels: Record<Model["level"], string> = {
  diamond: "Diamond",
  gold: "Gold",
  silver: "Silver",
  banned: "Banned",
}

export default function ModelsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [models] = useState<Model[]>(mockModels)

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddModel = () => {
    // TODO: Implementar modal de agregar modelo
    console.log("Agregar nueva modelo")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Header
        title="Gestión de Usuarios"
        description="Administra y monitorea el progreso de tus modelos en tiempo real"
        action={{
          label: "Agregar Nueva Modelo",
          icon: UserPlus,
          onClick: handleAddModel,
        }}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            label="Total Modelos"
            value={124}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            label="Activas"
            value={98}
            icon={UserCheck}
            trend={{ value: 2, isPositive: false }}
            highlight
          />
          <StatsCard
            label="Pendientes de Registro"
            value={26}
            icon={UserPlus}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Filters */}
        <FilterBar
          searchPlaceholder="Buscar por nombre, email o ID..."
          onSearch={setSearchTerm}
          filters={[
            {
              label: "Estado",
              options: [
                { label: "Todas", value: "all" },
                { label: "Activas", value: "active" },
                { label: "Inactivas", value: "inactive" },
              ],
              value: "all",
            },
            {
              label: "Nivel",
              options: [
                { label: "Todos", value: "all" },
                { label: "Diamond", value: "diamond" },
                { label: "Gold", value: "gold" },
                { label: "Silver", value: "silver" },
              ],
              value: "all",
            },
            {
              label: "Estudio",
              options: [
                { label: "Todos", value: "all" },
              ],
              value: "all",
            },
          ]}
          onAdvancedFilter={() => console.log("Advanced filter")}
        />

        {/* Data Table */}
        <div className="glass-effect rounded-2xl overflow-hidden shadow-2xl">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="px-6 py-4">Modelo</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4 text-center">Nivel</th>
                <th className="px-6 py-4">Última Conexión</th>
                <th className="px-6 py-4">Progreso Training</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((model) => (
                <tr
                  key={model.id}
                  className={cn(
                    "hover:bg-white/5 transition-colors group",
                    model.status === "suspended" && "bg-rose-500/[0.02]"
                  )}
                >
                  {/* Model Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "size-10 rounded-full p-0.5",
                          model.status === "suspended"
                            ? "bg-rose-500/20 grayscale"
                            : "bg-blue-600/20"
                        )}
                      >
                        {model.avatar ? (
                          <Image
                            src={model.avatar}
                            alt={model.name}
                            width={40}
                            height={40}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold">
                            {model.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-sm font-bold text-white",
                            model.status === "suspended" && "opacity-50"
                          )}
                        >
                          {model.name}
                        </p>
                        {model.status === "suspended" ? (
                          <p className="text-[11px] text-rose-500/70 font-bold uppercase">
                            Cuenta Suspendida
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-500">
                            ID: {model.id}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <p
                      className={cn(
                        "text-sm",
                        model.status === "suspended"
                          ? "text-slate-500"
                          : "text-slate-300"
                      )}
                    >
                      {model.email}
                    </p>
                  </td>

                  {/* Level */}
                  <td className="px-6 py-4 text-center">
                    <Badge variant={model.level}>
                      {levelLabels[model.level]}
                    </Badge>
                  </td>

                  {/* Last Connection */}
                  <td className="px-6 py-4">
                    <p
                      className={cn(
                        "text-sm",
                        model.status === "suspended"
                          ? "text-slate-500"
                          : "text-slate-400"
                      )}
                    >
                      {model.lastConnection}
                    </p>
                  </td>

                  {/* Training Progress */}
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        model.status === "suspended" && "opacity-40"
                      )}
                    >
                      <ProgressBar
                        value={model.trainingProgress}
                        showLabel={model.status !== "suspended"}
                      />
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="action-btn"
                        title="Ver Perfil"
                      >
                        <Eye className="w-[18px] h-[18px]" />
                      </button>
                      {model.status !== "suspended" ? (
                        <>
                          <button
                            className="action-btn action-btn-edit"
                            title="Editar"
                          >
                            <Pencil className="w-[18px] h-[18px]" />
                          </button>
                          <button
                            className="action-btn action-btn-danger"
                            title="Suspender"
                          >
                            <Ban className="w-[18px] h-[18px]" />
                          </button>
                        </>
                      ) : (
                        <button
                          className="action-btn action-btn-success"
                          title="Reactivar"
                        >
                          <CheckCircle className="w-[18px] h-[18px]" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={31}
            totalItems={124}
            itemsPerPage={4}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}

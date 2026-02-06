"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
  Loader2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  usersService,
  UserRole,
  UserStatus,
  userRoleLabels,
  userStatusLabels,
  type UserModel,
  type QueryUsersParams,
} from "@/lib/api"

/* ===== Helpers ===== */
// Mapea el nivel de gamificación a la variante del badge
function getLevelVariant(level: number): "diamond" | "gold" | "silver" | "banned" {
  if (level >= 10) return "diamond"
  if (level >= 5) return "gold"
  if (level >= 1) return "silver"
  return "banned"
}

function getLevelLabel(level: number): string {
  if (level >= 10) return "Diamond"
  if (level >= 5) return "Gold"
  if (level >= 1) return "Silver"
  return "Sin nivel"
}

// Formatea la última conexión de forma relativa
function formatLastLogin(dateStr: string | null): string {
  if (!dateStr) return "Nunca"
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return "Ahora"
  if (diffMin < 60) return `Hace ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `Hace ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 30) return `Hace ${diffD}d`
  const diffM = Math.floor(diffD / 30)
  return `Hace ${diffM} mes${diffM > 1 ? "es" : ""}`
}

const ITEMS_PER_PAGE = 10

export default function ModelsPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [users, setUsers] = useState<UserModel[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estadísticas locales
  const totalModels = totalItems
  const activeModels = users.filter((u) => u.status === UserStatus.ACTIVE).length
  const inactiveModels = users.filter((u) => u.status === UserStatus.INACTIVE).length

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params: QueryUsersParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }

      if (searchTerm.trim()) params.search = searchTerm.trim()
      if (statusFilter !== "all") params.status = statusFilter as UserStatus
      if (roleFilter !== "all") params.role = roleFilter as UserRole

      const result = await usersService.getAll(params)
      setUsers(result.users)
      setTotalItems(result.total)
      setTotalPages(result.totalPages)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar usuarios"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchTerm, statusFilter, roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, roleFilter])

  const handleAddModel = () => {
    router.push("/dashboard/models/new")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Header
        title="Gestión de Usuarios"
        description="Administra y monitorea el progreso de tus modelos en tiempo real"
        action={{
          label: "Agregar Nuevo Usuario",
          icon: UserPlus,
          onClick: handleAddModel,
        }}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            label="Total Usuarios"
            value={totalModels}
            icon={Users}
          />
          <StatsCard
            label="Activos"
            value={activeModels}
            icon={UserCheck}
            highlight
          />
          <StatsCard
            label="Inactivos"
            value={inactiveModels}
            icon={UserPlus}
          />
        </div>

        {/* Filters */}
        <FilterBar
          searchPlaceholder="Buscar por nombre, email..."
          onSearch={setSearchTerm}
          filters={[
            {
              label: "Estado",
              options: [
                { label: "Todos", value: "all" },
                ...Object.values(UserStatus).map((s) => ({
                  label: userStatusLabels[s],
                  value: s,
                })),
              ],
              value: statusFilter,
              onChange: setStatusFilter,
            },
            {
              label: "Rol",
              options: [
                { label: "Todos", value: "all" },
                ...Object.values(UserRole).map((r) => ({
                  label: userRoleLabels[r],
                  value: r,
                })),
              ],
              value: roleFilter,
              onChange: setRoleFilter,
            },
          ]}
        />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        )}

        {/* Data Table */}
        {!isLoading && !error && (
          <div className="glass-effect rounded-2xl overflow-hidden shadow-2xl">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4 text-center">Rol</th>
                  <th className="px-6 py-4 text-center">Nivel</th>
                  <th className="px-6 py-4">Última Conexión</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const levelVariant = getLevelVariant(user.gamification.level)
                    const isSuspended = user.status === UserStatus.SUSPENDED
                    const fullName = `${user.profile.firstName} ${user.profile.lastName}`

                    return (
                      <tr
                        key={user._id}
                        className={cn(
                          "hover:bg-white/5 transition-colors group",
                          isSuspended && "bg-rose-500/[0.02]"
                        )}
                      >
                        {/* User Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "size-10 rounded-full p-0.5",
                                isSuspended
                                  ? "bg-rose-500/20 grayscale"
                                  : "bg-blue-600/20"
                              )}
                            >
                              {user.profile.avatarUrl ? (
                                <Image
                                  src={user.profile.avatarUrl}
                                  alt={fullName}
                                  width={40}
                                  height={40}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold">
                                  {user.profile.firstName.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-bold text-white",
                                  isSuspended && "opacity-50"
                                )}
                              >
                                {fullName}
                              </p>
                              {user.profile.nickName && (
                                <p className="text-[11px] text-slate-500">
                                  @{user.profile.nickName}
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
                              isSuspended ? "text-slate-500" : "text-slate-300"
                            )}
                          >
                            {user.email}
                          </p>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={cn(
                              "inline-flex px-2.5 py-1 rounded-lg text-xs font-bold uppercase",
                              user.role === UserRole.ADMIN
                                ? "bg-amber-500/15 text-amber-400"
                                : user.role === UserRole.STUDIO
                                  ? "bg-purple-500/15 text-purple-400"
                                  : "bg-blue-500/15 text-blue-400"
                            )}
                          >
                            {userRoleLabels[user.role]}
                          </span>
                        </td>

                        {/* Level */}
                        <td className="px-6 py-4 text-center">
                          {user.role === UserRole.MODEL ? (
                            <Badge variant={levelVariant}>
                              {getLevelLabel(user.gamification.level)}
                            </Badge>
                          ) : (
                            <span className="text-xs text-slate-600">—</span>
                          )}
                        </td>

                        {/* Last Connection */}
                        <td className="px-6 py-4">
                          <p
                            className={cn(
                              "text-sm",
                              isSuspended ? "text-slate-500" : "text-slate-400"
                            )}
                          >
                            {formatLastLogin(user.lastLoginAt)}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={cn(
                              "inline-flex px-2.5 py-1 rounded-lg text-xs font-bold",
                              user.status === UserStatus.ACTIVE
                                ? "bg-emerald-500/15 text-emerald-400"
                                : user.status === UserStatus.INACTIVE
                                  ? "bg-slate-500/15 text-slate-400"
                                  : "bg-rose-500/15 text-rose-400"
                            )}
                          >
                            {userStatusLabels[user.status]}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="action-btn"
                              title="Ver Perfil"
                              onClick={() =>
                                router.push(`/dashboard/models/${user._id}`)
                              }
                            >
                              <Eye className="w-[18px] h-[18px]" />
                            </button>
                            {!isSuspended ? (
                              <>
                                <button
                                  className="action-btn action-btn-edit"
                                  title="Editar"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/models/${user._id}/edit`
                                    )
                                  }
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
                    )
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

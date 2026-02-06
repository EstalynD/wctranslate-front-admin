import { httpClient } from "./client"
import { apiConfig } from "./config"

/* ===== Enums ===== */
export enum UserRole {
  MODEL = "MODEL",
  ADMIN = "ADMIN",
  STUDIO = "STUDIO",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export enum PlanType {
  TESTER = "TESTER",
  FREE = "FREE",
  PRO = "PRO",
  ELITE = "ELITE",
}

export enum UserStage {
  INICIACION = "INICIACION",
  INTERMEDIO = "INTERMEDIO",
  AVANZADO = "AVANZADO",
}

/* ===== Types ===== */
export interface UserProfile {
  firstName: string
  lastName: string
  nickName?: string | null
  avatarUrl?: string | null
  bio?: string | null
}

export interface UserGamification {
  level: number
  stars: number
  currentXp: number
}

export interface SubscriptionAccess {
  isActive: boolean
  planType: PlanType
  expiresAt: string | null
  subscriptionId?: string | null
}

export interface ModelConfig {
  platformId: string | null
  stage: UserStage
  isSuperUser: boolean
  isDemo: boolean
  studioId: string | null
}

export interface DailyProgress {
  tasksCompletedToday: number
  lastTaskDate: string | null
  maxDailyTasks: number
}

export interface UserModel {
  _id: string
  email: string
  role: UserRole
  status: UserStatus
  profile: UserProfile
  gamification: UserGamification
  subscriptionAccess: SubscriptionAccess
  modelConfig: ModelConfig
  dailyProgress: DailyProgress
  lastLoginAt: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminCreateUserData {
  email: string
  password: string
  profile: {
    firstName: string
    lastName: string
    nickName?: string
  }
  role?: UserRole
  platformId?: string
  stage?: UserStage
  isSuperUser?: boolean
  isDemo?: boolean
  studioId?: string
  planType?: PlanType
}

export interface UpdateUserData {
  email?: string
  profile?: Partial<UserProfile>
  role?: UserRole
  status?: UserStatus
}

export interface AssignPlatformData {
  platformId: string
}

export interface UpdateSubscriptionData {
  isActive?: boolean
  planType?: PlanType
  expiresAt?: string | null
  subscriptionId?: string
}

export interface QueryUsersParams {
  status?: UserStatus
  role?: UserRole
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedUsers {
  users: UserModel[]
  total: number
  page: number
  totalPages: number
}

/* ===== Labels ===== */
export const userRoleLabels: Record<UserRole, string> = {
  [UserRole.MODEL]: "Modelo",
  [UserRole.ADMIN]: "Administrador",
  [UserRole.STUDIO]: "Estudio",
}

export const userStatusLabels: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: "Activo",
  [UserStatus.INACTIVE]: "Inactivo",
  [UserStatus.SUSPENDED]: "Suspendido",
}

export const planTypeLabels: Record<PlanType, string> = {
  [PlanType.TESTER]: "Tester",
  [PlanType.FREE]: "Free",
  [PlanType.PRO]: "Pro",
  [PlanType.ELITE]: "Elite",
}

export const userStageLabels: Record<UserStage, string> = {
  [UserStage.INICIACION]: "Iniciaci\u00f3n",
  [UserStage.INTERMEDIO]: "Intermedio",
  [UserStage.AVANZADO]: "Avanzado",
}

/* ===== Users Service ===== */
export const usersService = {
  /**
   * Obtiene todos los usuarios con paginaci\u00f3n y filtros
   */
  async getAll(params?: QueryUsersParams): Promise<PaginatedUsers> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.append(key, String(value))
        }
      })
    }

    const query = searchParams.toString()
    const endpoint = query
      ? `${apiConfig.endpoints.users.list}?${query}`
      : apiConfig.endpoints.users.list

    return httpClient.get<PaginatedUsers>(endpoint)
  },

  /**
   * Obtiene un usuario por ID
   */
  async getById(id: string): Promise<UserModel> {
    return httpClient.get<UserModel>(apiConfig.endpoints.users.detail(id))
  },

  /**
   * Crea un nuevo usuario (admin)
   */
  async create(data: AdminCreateUserData): Promise<{ message: string; user: UserModel }> {
    return httpClient.post<{ message: string; user: UserModel }>(
      apiConfig.endpoints.users.list,
      data
    )
  },

  /**
   * Actualiza un usuario
   */
  async update(id: string, data: UpdateUserData): Promise<UserModel> {
    return httpClient.put<UserModel>(apiConfig.endpoints.users.detail(id), data)
  },

  /**
   * Asigna plataforma de streaming a un modelo
   */
  async assignPlatform(id: string, data: AssignPlatformData): Promise<{ message: string; user: UserModel }> {
    return httpClient.put<{ message: string; user: UserModel }>(
      apiConfig.endpoints.users.platform(id),
      data
    )
  },

  /**
   * Actualiza suscripción de un usuario
   */
  async updateSubscription(id: string, data: UpdateSubscriptionData): Promise<UserModel> {
    return httpClient.put<UserModel>(
      apiConfig.endpoints.users.subscription(id),
      data
    )
  },

  /**
   * Elimina un usuario (soft delete)
   */
  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(apiConfig.endpoints.users.detail(id))
  },
}

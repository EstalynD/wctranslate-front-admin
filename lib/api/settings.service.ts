import { httpClient } from "./client"

// --- Interfaces ---

export interface DailyTasksConfig {
  maxDailyTasks: number
  enabled: boolean
}

export interface SystemSettings {
  _id: string
  key: string
  dailyTasks: DailyTasksConfig
  lastModifiedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateSystemSettingsData {
  dailyTasks?: Partial<DailyTasksConfig>
}

// --- Service ---

class SettingsService {
  private readonly basePath = "/settings"

  /**
   * Obtiene toda la configuración del sistema (admin)
   */
  async getSettings(): Promise<SystemSettings> {
    return httpClient.get<SystemSettings>(this.basePath)
  }

  /**
   * Obtiene solo la configuración de tareas diarias
   */
  async getDailyTasksConfig(): Promise<DailyTasksConfig> {
    return httpClient.get<DailyTasksConfig>(`${this.basePath}/daily-tasks`)
  }

  /**
   * Actualiza la configuración del sistema (admin)
   */
  async updateSettings(data: UpdateSystemSettingsData): Promise<SystemSettings> {
    return httpClient.put<SystemSettings>(this.basePath, data)
  }
}

export const settingsService = new SettingsService()

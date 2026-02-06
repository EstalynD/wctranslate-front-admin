/**
 * Configuración de la API para WC Training Admin
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3556/api"

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    auth: {
      login: "/auth/login",
      logout: "/auth/logout",
      me: "/auth/me",
    },
    courses: {
      list: "/courses",
      detail: (id: string) => `/courses/${id}`,
      bySlug: (slug: string) => `/courses/slug/${slug}`,
      withThemes: (id: string) => `/courses/${id}/with-themes`,
      reorderThemes: (id: string) => `/courses/${id}/reorder-themes`,
      updateStats: (id: string) => `/courses/${id}/update-stats`,
    },
    themes: {
      list: (courseId: string) => `/themes/course/${courseId}`,
      detail: (id: string) => `/themes/${id}`,
      reorderLessons: (id: string) => `/themes/${id}/reorder-lessons`,
    },
    lessons: {
      list: (themeId: string) => `/lessons/theme/${themeId}`,
      detail: (id: string) => `/lessons/${id}`,
      bySlug: (slug: string) => `/lessons/slug/${slug}`,
      blocks: (id: string) => `/lessons/${id}/blocks`,
      blockByIndex: (id: string, index: number) => `/lessons/${id}/blocks/${index}`,
      reorderBlocks: (id: string) => `/lessons/${id}/blocks/reorder`,
      resources: (id: string) => `/lessons/${id}/resources`,
      resourceById: (id: string, resourceId: string) => `/lessons/${id}/resources/${resourceId}`,
      uploadHtml: "/lessons/upload-html",
      deleteHtml: "/lessons/delete-html",
    },
    users: {
      list: "/users",
      detail: (id: string) => `/users/${id}`,
      profile: (id: string) => `/users/${id}/profile`,
      platform: (id: string) => `/users/${id}/platform`,
      subscription: (id: string) => `/users/${id}/subscription`,
      gamification: (id: string) => `/users/${id}/gamification`,
      addXp: (id: string) => `/users/${id}/gamification/xp`,
      addStars: (id: string) => `/users/${id}/gamification/stars`,
      stats: "/users/stats",
    },
    studios: {
      list: "/studios",
      detail: (id: string) => `/studios/${id}`,
    },
  },
  defaultHeaders: {
    "Content-Type": "application/json",
  },
} as const

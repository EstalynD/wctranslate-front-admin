export { httpClient, ApiError } from "./client"
export { apiConfig } from "./config"
export { authService } from "./auth.service"
export {
  coursesService,
  generateSlug,
  levelLabels,
  categoryLabels,
  statusLabels,
  planLabels,
  CourseStatus,
  CourseLevel,
  CourseCategory,
  PlanType,
} from "./courses.service"
export {
  platformsService,
  generatePlatformSlug,
  platformStatusLabels,
  platformTypeLabels,
  PlatformStatus,
  PlatformType,
} from "./platforms.service"
export {
  themesService,
  generateThemeSlug,
  calculateThemeDuration,
} from "./themes.service"
export {
  lessonsService,
  lessonTypeLabels,
  lessonStatusLabels,
  lessonTypeIcons,
  generateLessonSlug,
  formatDuration,
  hasContent,
  LessonType,
  LessonStatus,
  BlockType,
} from "./lessons.service"
export { settingsService } from "./settings.service"
export {
  usersService,
  userRoleLabels,
  userStatusLabels,
  planTypeLabels as userPlanLabels,
  userStageLabels,
  UserRole,
  UserStatus,
  UserStage,
} from "./users.service"
export { PlanType as UserPlanType } from "./users.service"

export type {
  User,
  LoginResponse,
  LoginCredentials,
} from "./auth.service"

export type {
  Course,
  Theme,
  CourseWithThemes,
  CreateCourseData,
  UpdateCourseData,
  QueryCoursesParams,
  PaginatedCourses,
} from "./courses.service"

export type {
  Platform,
  CreatePlatformData,
  UpdatePlatformData,
  QueryPlatformsParams,
  PaginatedPlatforms,
} from "./platforms.service"

export type {
  Theme as ThemeAPI,
  ThemeWithLessons,
  LessonBasic,
  CreateThemeData,
  UpdateThemeData,
} from "./themes.service"

export type {
  Lesson,
  ContentBlock,
  BlockSettings,
  LessonResource,
  SubmissionConfig,
  CreateLessonData,
  UpdateLessonData,
  HtmlUploadResult,
} from "./lessons.service"

export type {
  SystemSettings,
  DailyTasksConfig,
  UpdateSystemSettingsData,
} from "./settings.service"

export type {
  UserModel,
  AdminCreateUserData,
  UpdateUserData,
  AssignPlatformData,
  UpdateSubscriptionData,
  QueryUsersParams,
  PaginatedUsers,
  UserProfile,
  UserGamification,
  SubscriptionAccess,
  ModelConfig,
} from "./users.service"

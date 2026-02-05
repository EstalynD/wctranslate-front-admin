"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  CreditCard,
  Settings,
  Dumbbell,
} from "lucide-react"
import Image from "next/image"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Modelos",
    href: "/dashboard/models",
    icon: Users,
  },
  {
    title: "Estudios",
    href: "/dashboard/studios",
    icon: Building2,
  },
  {
    title: "Reportes",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Pagos",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
]

interface SidebarProps {
  user?: {
    name: string
    role: string
    avatar?: string
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_auth_token")
    localStorage.removeItem("admin_user")
    window.location.href = "/login"
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col shrink-0 h-screen fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
          <Dumbbell className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tighter leading-none text-white">
            WC TRAINING
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                active
                  ? "sidebar-item-active text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <Icon className={cn("w-[22px] h-[22px]", active && "fill-current")} />
              <span className="text-sm font-medium">{item.title}</span>
              {item.badge && (
                <span className="ml-auto bg-blue-600/20 text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Support Card */}
      <div className="p-4 mt-auto">
        <div className="glass-effect rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">
            Soporte 24/7
          </p>
          <button className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-all">
            Contactar Soporte
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 py-2 border-t border-white/5 pt-4">
          <div className="size-8 rounded-full bg-white/10 overflow-hidden">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
            )}
          </div>
          <div className="flex flex-col overflow-hidden flex-1">
            <p className="text-xs font-bold text-white truncate">
              {user?.name || "Admin User"}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {user?.role || "Super Admin"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white transition-colors"
            title="Cerrar sesión"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  )
}

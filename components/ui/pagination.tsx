"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        pages.push(currentPage)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div
      className={cn(
        "bg-white/5 p-4 flex items-center justify-between",
        className
      )}
    >
      <p className="text-xs text-slate-500 font-medium">
        Mostrando <span className="text-slate-300">{startItem} - {endItem}</span> de{" "}
        <span className="text-slate-300">{totalItems}</span> modelos
      </p>

      <div className="flex gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="size-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={typeof page === "string"}
            className={cn(
              "size-8 flex items-center justify-center rounded-lg font-bold text-xs transition-colors",
              currentPage === page
                ? "bg-blue-600 text-white"
                : typeof page === "string"
                ? "text-slate-600 cursor-default"
                : "bg-white/5 text-slate-400 hover:text-white"
            )}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="size-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

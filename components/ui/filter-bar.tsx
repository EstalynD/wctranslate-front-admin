"use client"

import { Search, ChevronDown, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

interface FilterOption {
  label: string
  value: string
}

interface FilterBarProps {
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  filters?: {
    label: string
    options: FilterOption[]
    value?: string
    onChange?: (value: string) => void
  }[]
  onAdvancedFilter?: () => void
}

export function FilterBar({
  searchPlaceholder = "Buscar...",
  onSearch,
  filters,
  onAdvancedFilter,
}: FilterBarProps) {
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    onSearch?.(e.target.value)
  }

  return (
    <div className="glass-effect rounded-2xl p-4 flex flex-wrap gap-4 items-center">
      {/* Search Input */}
      <div className="flex-1 min-w-[300px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          placeholder={searchPlaceholder}
          className="w-full bg-slate-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-blue-600 rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-slate-500 text-white"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {filters?.map((filter, index) => (
          <button
            key={index}
            className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-slate-300"
          >
            {filter.label}: {filter.options.find(o => o.value === filter.value)?.label || "Todas"}
            <ChevronDown className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Advanced Filter Button */}
      {onAdvancedFilter && (
        <button
          onClick={onAdvancedFilter}
          className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 p-3 rounded-xl transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

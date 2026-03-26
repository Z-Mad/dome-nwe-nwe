import { LucideIcon } from 'lucide-react'

export type TabItem<T extends string> = {
  id: T
  label: string
  icon: LucideIcon
}

interface TabNavProps<T extends string> {
  tabs: TabItem<T>[]
  currentTab: T
  onChange: (tab: T) => void
  activeClassName: string
}

const TabNav = <T extends string>({
  tabs,
  currentTab,
  onChange,
  activeClassName,
}: TabNavProps<T>) => {
  return (
    <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            currentTab === tab.id
              ? activeClassName
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <tab.icon size={16} /> {tab.label}
        </button>
      ))}
    </div>
  )
}

export default TabNav

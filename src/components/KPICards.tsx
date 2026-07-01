import { useStore } from '../store/useStore'
import { formatCompactCurrency } from '../utils/calculations'

const icons: Record<string, string> = {
  'Общий объём продаж': '💰',
  'Количество транзакций': '📋',
  'Средний чек': '🧾',
  'Доля рынка': '📊',
  'Темп роста': '📈',
}

export default function KPICards() {
  const { kpis } = useStore()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {kpis.map((kpi, i) => {
        const isGrowth = kpi.title === 'Темп роста'
        const isPositive = kpi.change > 0

        return (
          <div
            key={kpi.title}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-indigo-100 transition-all duration-300 animate-slide-up group cursor-default"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg">{icons[kpi.title] || '📊'}</span>
              {isGrowth && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isPositive
                      ? 'bg-emerald-50 text-emerald-600'
                      : kpi.change < 0
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {isPositive ? '+' : ''}{kpi.change.toFixed(1)}%
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{kpi.title}</p>
            <p className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {kpi.value}
              {kpi.suffix && !kpi.value.includes('%') && kpi.suffix}
            </p>
          </div>
        )
      })}
    </div>
  )
}

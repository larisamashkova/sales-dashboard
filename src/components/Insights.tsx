import { useStore } from '../store/useStore'

const icons: Record<string, string> = {
  positive: '📈',
  negative: '📉',
  info: '💡',
}

const bgColors: Record<string, string> = {
  positive: 'bg-emerald-50 border-emerald-200',
  negative: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
}

const textColors: Record<string, string> = {
  positive: 'text-emerald-800',
  negative: 'text-red-800',
  info: 'text-blue-800',
}

export default function Insights() {
  const { insights } = useStore()

  if (insights.length === 0) return null

  return (
    <div className="animate-slide-up">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Автоматические выводы</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-4 rounded-xl border ${bgColors[insight.type]} transition-all duration-300 hover:shadow-sm`}
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{icons[insight.type]}</span>
            <p className={`text-sm leading-relaxed ${textColors[insight.type]}`}>{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useStore } from '../store/useStore'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { formatCompactCurrency } from '../utils/calculations'

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-100 p-3 text-sm">
      <p className="font-semibold text-gray-900 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-medium text-gray-900">
            {entry.name === 'Продажи' || entry.name === 'Прибыль'
              ? formatCompactCurrency(entry.value)
              : entry.value.toLocaleString('ru-RU')}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function SalesChart() {
  const { monthlySales } = useStore()

  if (monthlySales.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Динамика продаж</h3>
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Нет данных</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-slide-up">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Динамика продаж</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={monthlySales} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="sales"
            name="Продажи"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#6366f1' }}
            activeDot={{ r: 5, fill: '#6366f1' }}
            animationDuration={1000}
          />
          <Line
            type="monotone"
            dataKey="profit"
            name="Прибыль"
            stroke="#14b8a6"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#14b8a6' }}
            activeDot={{ r: 5, fill: '#14b8a6' }}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

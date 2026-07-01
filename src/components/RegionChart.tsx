import { useStore } from '../store/useStore'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { formatCompactCurrency } from '../utils/calculations'

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#14b8a6']

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-100 p-3 text-sm">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      <p className="text-gray-600">
        Продажи: <span className="font-medium text-gray-900">{formatCompactCurrency(payload[0].value)}</span>
      </p>
      <p className="text-gray-600">
        Транзакции: <span className="font-medium text-gray-900">{payload[1]?.value?.toLocaleString('ru-RU')}</span>
      </p>
    </div>
  )
}

export default function RegionChart() {
  const { regionSales } = useStore()

  if (regionSales.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Продажи по регионам</h3>
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Нет данных</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-slide-up">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Продажи по регионам</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={regionSales} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="region" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="sales" name="Продажи" radius={[6, 6, 0, 0]} animationDuration={800}>
            {regionSales.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

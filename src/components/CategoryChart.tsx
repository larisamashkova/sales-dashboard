import { useStore } from '../store/useStore'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatCompactCurrency } from '../utils/calculations'

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16']

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-100 p-3 text-sm">
      <p className="font-semibold text-gray-900 mb-1">{d.category}</p>
      <p className="text-gray-600">
        Продажи: <span className="font-medium text-gray-900">{formatCompactCurrency(d.sales)}</span>
      </p>
      <p className="text-gray-600">
        Доля: <span className="font-medium text-gray-900">{d.percentage.toFixed(1)}%</span>
      </p>
    </div>
  )
}

function renderLabel({ category, percentage }: { category: string; percentage: number }) {
  return `${percentage.toFixed(0)}%`
}

export default function CategoryChart() {
  const { categorySales } = useStore()

  if (categorySales.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Распределение по категориям</h3>
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Нет данных</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-slide-up">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Распределение по категориям</h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={categorySales}
            dataKey="sales"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={60}
            paddingAngle={3}
            animationDuration={1000}
            animationBegin={200}
            label={renderLabel}
          >
            {categorySales.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value: string) => <span className="text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

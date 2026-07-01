import { useState } from 'react'
import { useStore } from '../store/useStore'
import { formatCurrency, parseDate } from '../utils/calculations'

const PAGE_SIZE = 25

export default function DataTable() {
  const { filteredRecords } = useStore()
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<string>('Date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const sorted = [...filteredRecords].sort((a, b) => {
    let aVal: any = a[sortField as keyof typeof a]
    let bVal: any = b[sortField as keyof typeof b]
    if (sortField === 'Date') {
      aVal = parseDate(aVal).getTime()
      bVal = parseDate(bVal).getTime()
    }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
    setPage(1)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="text-indigo-500 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const cols = [
    { key: 'Date', label: 'Дата' },
    { key: 'Region', label: 'Регион' },
    { key: 'Category', label: 'Категория' },
    { key: 'Product', label: 'Товар' },
    { key: 'Sales', label: 'Продажи' },
    { key: 'Profit', label: 'Прибыль' },
    { key: 'CustomerType', label: 'Клиент' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Детализация продаж</h3>
        <span className="text-xs text-gray-400">{filteredRecords.length} записей</span>
      </div>

      {sorted.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Нет данных</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {cols.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="text-left py-3 px-3 font-medium text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap text-xs uppercase tracking-wider"
                    >
                      {col.label}
                      <SortIcon field={col.key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((r) => (
                  <tr
                    key={r.OrderID}
                    className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-gray-900">{r.Date}</td>
                    <td className="py-2.5 px-3 text-gray-600">{r.Region}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                        {r.Category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-900 font-medium">{r.Product}</td>
                    <td className="py-2.5 px-3 text-gray-900">{formatCurrency(r.Sales)}</td>
                    <td className="py-2.5 px-3">
                      <span className={r.Profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                        {formatCurrency(r.Profit)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">{r.CustomerType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Назад
              </button>
              <span className="text-xs text-gray-500">
                {page} из {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Вперёд
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

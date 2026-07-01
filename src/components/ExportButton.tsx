import { useState } from 'react'
import { useStore } from '../store/useStore'
import * as XLSX from 'xlsx'

export default function ExportButton() {
  const { filteredRecords } = useStore()
  const [exporting, setExporting] = useState(false)

  const handleExport = () => {
    setExporting(true)
    try {
      const data = filteredRecords.map((r) => ({
        'ID заказа': r.OrderID,
        'Дата': r.Date,
        'Регион': r.Region,
        'Категория': r.Category,
        'Товар': r.Product,
        'Тип клиента': r.CustomerType,
        'Продавец': r.Salesperson,
        'Количество': r.Quantity,
        'Цена за ед.': r.UnitPrice,
        'Скидка %': r.DiscountPct,
        'Продажи': r.Sales,
        'Прибыль': r.Profit,
      }))

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(data)

      const colWidths = [
        { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 18 },
        { wch: 22 }, { wch: 14 }, { wch: 14 }, { wch: 10 },
        { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
      ]
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Sales')
      XLSX.writeFile(wb, `sales_export_${new Date().toISOString().slice(0, 10)}.xlsx`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={filteredRecords.length === 0 || exporting}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
    >
      {exporting ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
      Экспорт в Excel
    </button>
  )
}

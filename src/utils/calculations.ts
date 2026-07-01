import type { SalesRecord, MonthlySales, RegionSales, CategorySales, KPI, Insight, Filters } from '../types'

export function parseDate(dateStr: string): Date {
  let day: number, month: number, year: number
  if (dateStr.includes('-')) {
    [year, month, day] = dateStr.split('-').map(Number)
  } else {
    [day, month, year] = dateStr.split('.').map(Number)
  }
  return new Date(year, month - 1, day)
}

export function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}.${m}.${y}`
}

function getMonthKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${m}`
}

function getMonthLabel(date: Date): string {
  const months = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
  ]
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

export function applyFilters(records: SalesRecord[], filters: Filters): SalesRecord[] {
  return records.filter((r) => {
    const date = parseDate(r.Date)

    if (filters.dateFrom && date < parseDate(filters.dateFrom)) return false
    if (filters.dateTo && date > parseDate(filters.dateTo)) return false
    if (filters.region && filters.region !== 'all' && r.Region !== filters.region) return false
    if (filters.category && filters.category !== 'all' && r.Category !== filters.category) return false
    if (filters.salesperson && filters.salesperson !== 'all' && r.Salesperson !== filters.salesperson) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (
        !r.Product.toLowerCase().includes(q) &&
        !r.Category.toLowerCase().includes(q) &&
        !r.Region.toLowerCase().includes(q) &&
        !r.Salesperson.toLowerCase().includes(q)
      ) return false
    }

    return true
  })
}

export function calculateKPIs(records: SalesRecord[], allRecords: SalesRecord[]): KPI[] {
  const totalSales = records.reduce((sum, r) => sum + r.Sales, 0)
  const totalTransactions = records.length
  const totalQuantity = records.reduce((sum, r) => sum + r.Quantity, 0)
  const avgCheck = totalTransactions > 0 ? totalSales / totalTransactions : 0

  const totalAllSales = allRecords.reduce((sum, r) => sum + r.Sales, 0)
  const marketShare = totalAllSales > 0 ? (totalSales / totalAllSales) * 100 : 0

  return [
    { title: 'Общий объём продаж', value: formatCurrency(totalSales), change: 0, prefix: '₽' },
    { title: 'Количество транзакций', value: totalTransactions.toLocaleString('ru-RU'), change: 0 },
    { title: 'Продано единиц', value: totalQuantity.toLocaleString('ru-RU'), change: 0, suffix: ' шт' },
    { title: 'Средний чек', value: formatCurrency(avgCheck), change: 0, prefix: '₽' },
    { title: 'Доля продаж', value: marketShare.toFixed(1), change: 0, suffix: '%' },
  ]
}

export function getMonthlySales(records: SalesRecord[]): MonthlySales[] {
  const grouped = new Map<string, { sales: number; transactions: number; profit: number }>()

  for (const r of records) {
    const key = getMonthKey(parseDate(r.Date))
    const existing = grouped.get(key) || { sales: 0, transactions: 0, profit: 0 }
    existing.sales += r.Sales
    existing.transactions += r.Transactions
    existing.profit += r.Profit
    grouped.set(key, existing)
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({
      month: getMonthLabel(parseDate(`${key}-01`)),
      sales: Number(val.sales.toFixed(2)),
      transactions: val.transactions,
      profit: Number(val.profit.toFixed(2)),
    }))
}

export function getRegionSales(records: SalesRecord[]): RegionSales[] {
  const grouped = new Map<string, { sales: number; transactions: number }>()

  for (const r of records) {
    const existing = grouped.get(r.Region) || { sales: 0, transactions: 0 }
    existing.sales += r.Sales
    existing.transactions += r.Transactions
    grouped.set(r.Region, existing)
  }

  return Array.from(grouped.entries())
    .map(([region, val]) => ({
      region,
      sales: Number(val.sales.toFixed(2)),
      transactions: val.transactions,
    }))
    .sort((a, b) => b.sales - a.sales)
}

export function getCategorySales(records: SalesRecord[]): CategorySales[] {
  const totalSales = records.reduce((sum, r) => sum + r.Sales, 0)
  const grouped = new Map<string, number>()

  for (const r of records) {
    grouped.set(r.Category, (grouped.get(r.Category) || 0) + r.Sales)
  }

  return Array.from(grouped.entries())
    .map(([category, sales]) => ({
      category,
      sales: Number(sales.toFixed(2)),
      percentage: totalSales > 0 ? (sales / totalSales) * 100 : 0,
    }))
    .sort((a, b) => b.sales - a.sales)
}

export function getInsights(records: SalesRecord[], allRecords: SalesRecord[]): Insight[] {
  const insights: Insight[] = []
  const filteredTotal = records.reduce((sum, r) => sum + r.Sales, 0)

  if (records.length === 0) {
    insights.push({ type: 'info', text: 'Нет данных для выбранного периода.' })
    return insights
  }

  const regionSales = getRegionSales(records)
  const categorySales = getCategorySales(records)
  const monthlySales = getMonthlySales(records)

  const totalSales = records.reduce((sum, r) => sum + r.Sales, 0)
  const totalProfit = records.reduce((sum, r) => sum + r.Profit, 0)
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0

  insights.push({
    type: 'info',
    text: `Общая выручка: ${formatCurrency(totalSales)}. Прибыль: ${formatCurrency(totalProfit)} (рентабельность ${profitMargin.toFixed(1)}%).`,
  })

  if (regionSales.length > 0) {
    const top = regionSales[0]
    const last = regionSales.length > 1 ? regionSales[regionSales.length - 1] : null
    insights.push({
      type: 'positive',
      text: `Регион-лидер: ${top.region} (${formatCurrency(top.sales)}).${last ? ` Отстающий: ${last.region} (${formatCurrency(last.sales)}).` : ''}`,
    })
  }

  if (categorySales.length > 0) {
    const top = categorySales[0]
    insights.push({
      type: 'positive',
      text: `Категория-лидер: ${top.category} — ${top.percentage.toFixed(1)}% продаж (${formatCurrency(top.sales)}).`,
    })
  }

  if (monthlySales.length >= 2) {
    const last = monthlySales[monthlySales.length - 1]
    const prev = monthlySales[monthlySales.length - 2]
    const growth = prev.sales > 0 ? ((last.sales - prev.sales) / prev.sales) * 100 : 0

    if (growth > 0) {
      insights.push({
        type: 'positive',
        text: `Рост продаж в ${last.month}: ${growth.toFixed(1)}% по сравнению с ${prev.month}.`,
      })
    } else if (growth < 0) {
      insights.push({
        type: 'negative',
        text: `Спад продаж в ${last.month}: ${Math.abs(growth).toFixed(1)}% по сравнению с ${prev.month}.`,
      })
    }
  }

  const salespersonSales = new Map<string, number>()
  for (const r of records) {
    salespersonSales.set(r.Salesperson, (salespersonSales.get(r.Salesperson) || 0) + r.Sales)
  }
  const sortedSalespersons = Array.from(salespersonSales.entries()).sort((a, b) => b[1] - a[1])
  if (sortedSalespersons.length > 0) {
    const [topName, topAmount] = sortedSalespersons[0]
    insights.push({
      type: 'info',
      text: `Лучший менеджер: ${topName} (${formatCurrency(topAmount)}).`,
    })
  }

  const avgCheck = filteredTotal / records.length
  const overallAvgCheck = allRecords.length > 0
    ? allRecords.reduce((s, r) => s + r.Sales, 0) / allRecords.length
    : 0

  if (avgCheck > overallAvgCheck && overallAvgCheck > 0) {
    insights.push({
      type: 'positive',
      text: `Средний чек ${formatCurrency(avgCheck)} выше общего среднего (${formatCurrency(overallAvgCheck)}).`,
    })
  } else if (avgCheck < overallAvgCheck && overallAvgCheck > 0) {
    insights.push({
      type: 'negative',
      text: `Средний чек ${formatCurrency(avgCheck)} ниже общего среднего (${formatCurrency(overallAvgCheck)}).`,
    })
  }

  return insights
}

export function getUniqueSalespersons(records: SalesRecord[]): string[] {
  return [...new Set(records.map((r) => r.Salesperson))].sort()
}

export function getUniqueRegions(records: SalesRecord[]): string[] {
  return [...new Set(records.map((r) => r.Region))].sort()
}

export function getUniqueCategories(records: SalesRecord[]): string[] {
  return [...new Set(records.map((r) => r.Category))].sort()
}

export function getDateRange(records: SalesRecord[]): { min: string; max: string } {
  if (records.length === 0) return { min: '', max: '' }
  const dates = records.map((r) => parseDate(r.Date))
  return {
    min: formatDate(new Date(Math.min(...dates.map((d) => d.getTime())))),
    max: formatDate(new Date(Math.max(...dates.map((d) => d.getTime())))),
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} млн ₽`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)} тыс ₽`
  return formatCurrency(value)
}

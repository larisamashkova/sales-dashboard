export interface SalesRecord {
  OrderID: number
  Date: string
  Region: string
  Category: string
  Product: string
  CustomerType: string
  Salesperson: string
  Quantity: number
  UnitPrice: number
  DiscountPct: number
  Transactions: number
  Sales: number
  Profit: number
}

export interface Filters {
  dateFrom: string
  dateTo: string
  region: string
  category: string
  search: string
}

export interface KPI {
  title: string
  value: string
  change: number
  prefix?: string
  suffix?: string
}

export interface MonthlySales {
  month: string
  sales: number
  transactions: number
  profit: number
}

export interface RegionSales {
  region: string
  sales: number
  transactions: number
}

export interface CategorySales {
  category: string
  sales: number
  percentage: number
}

export interface Insight {
  type: 'positive' | 'negative' | 'info'
  text: string
}

import * as XLSX from 'xlsx'
import type { SalesRecord } from '../types'

export function parseExcelFile(buffer: ArrayBuffer): SalesRecord[] {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) throw new Error('Файл Excel не содержит листов')

  const sheet = workbook.Sheets[sheetName]
  const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

  if (!rawData || rawData.length === 0) {
    throw new Error('Файл Excel не содержит данных')
  }

  const records: SalesRecord[] = []
  const errors: string[] = []

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i]
    const rowNum = i + 2

    try {
      const record = validateAndTransform(row, rowNum)
      if (record) records.push(record)
    } catch (e) {
      errors.push(`Строка ${rowNum}: ${(e as Error).message}`)
    }
  }

  if (records.length === 0) {
    throw new Error(
      errors.length > 0
        ? `Не удалось обработать данные. ${errors[0]}`
        : 'Не удалось обработать данные'
    )
  }

  return records
}

const REQUIRED_FIELDS = [
  'OrderID', 'Date', 'Region', 'Category', 'Product',
  'CustomerType', 'Salesperson', 'Quantity', 'UnitPrice',
  'DiscountPct', 'Transactions', 'Sales', 'Profit',
] as const

function validateAndTransform(row: Record<string, unknown>, rowNum: number): SalesRecord | null {
  for (const field of REQUIRED_FIELDS) {
    if (row[field] === undefined || row[field] === null || row[field] === '') {
      throw new Error(`Отсутствует поле "${field}"`)
    }
  }

  const parseNumber = (val: unknown): number => {
    if (typeof val === 'number') return val
    if (typeof val === 'string') {
      const cleaned = val.replace(',', '.').replace(/\s/g, '')
      const num = parseFloat(cleaned)
      if (isNaN(num)) throw new Error(`Невозможно преобразовать "${val}" в число`)
      return num
    }
    throw new Error(`Невозможно преобразовать "${val}" в число`)
  }

  return {
    OrderID: parseNumber(row.OrderID),
    Date: String(row.Date),
    Region: String(row.Region),
    Category: String(row.Category),
    Product: String(row.Product),
    CustomerType: String(row.CustomerType),
    Salesperson: String(row.Salesperson),
    Quantity: parseNumber(row.Quantity),
    UnitPrice: parseNumber(row.UnitPrice),
    DiscountPct: parseNumber(row.DiscountPct),
    Transactions: parseNumber(row.Transactions),
    Sales: parseNumber(row.Sales),
    Profit: parseNumber(row.Profit),
  }
}

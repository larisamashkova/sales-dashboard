/**
 * API Service — адаптер для будущего подключения CRM.
 * Сейчас данные загружаются из Excel, но компоненты используют этот сервис.
 * При переходе на API достаточно реализовать методы ниже.
 */
import type { SalesRecord } from '../types'

export interface DataSource {
  getSalesData(): Promise<SalesRecord[]>
}

class ExcelDataSource implements DataSource {
  private data: SalesRecord[] = []

  setData(data: SalesRecord[]) {
    this.data = data
  }

  async getSalesData(): Promise<SalesRecord[]> {
    return this.data
  }
}

class CRMDataSource implements DataSource {
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  async getSalesData(): Promise<SalesRecord[]> {
    const response = await fetch(`${this.apiUrl}/sales`)
    if (!response.ok) throw new Error('Failed to fetch sales data')
    return response.json()
  }
}

export const dataSource = new ExcelDataSource()

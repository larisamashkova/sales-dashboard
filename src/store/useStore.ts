import { create } from 'zustand'
import type { SalesRecord, Filters, KPI, MonthlySales, RegionSales, CategorySales, Insight } from '../types'
import {
  applyFilters,
  calculateKPIs,
  getMonthlySales,
  getRegionSales,
  getCategorySales,
  getInsights,
  getUniqueRegions,
  getUniqueCategories,
  getDateRange,
} from '../utils/calculations'
import { parseExcelFile } from '../utils/dataParser'
import { dataSource } from '../api/apiService'

interface AppState {
  allRecords: SalesRecord[]
  filteredRecords: SalesRecord[]
  filters: Filters
  kpis: KPI[]
  monthlySales: MonthlySales[]
  regionSales: RegionSales[]
  categorySales: CategorySales[]
  insights: Insight[]
  regions: string[]
  categories: string[]
  dateRange: { min: string; max: string }
  loading: boolean
  error: string | null

  setFilters: (filters: Partial<Filters>) => void
  resetFilters: () => void
  loadExcelFile: (buffer: ArrayBuffer) => void
  recalculate: () => void
}

const DEFAULT_FILTERS: Filters = {
  dateFrom: '',
  dateTo: '',
  region: 'all',
  category: 'all',
  search: '',
}

export const useStore = create<AppState>((set, get) => ({
  allRecords: [],
  filteredRecords: [],
  filters: DEFAULT_FILTERS,
  kpis: [],
  monthlySales: [],
  regionSales: [],
  categorySales: [],
  insights: [],
  regions: [],
  categories: [],
  dateRange: { min: '', max: '' },
  loading: false,
  error: null,

  setFilters: (partial) => {
    const current = get().filters
    const newFilters = { ...current, ...partial }
    set({ filters: newFilters })
    const { allRecords } = get()
    const filteredRecords = applyFilters(allRecords, newFilters)
    const kpis = calculateKPIs(filteredRecords, allRecords)
    const monthlySales = getMonthlySales(filteredRecords)
    const regionSales = getRegionSales(applyFilters(allRecords, { ...newFilters, region: 'all' }))
    const categorySales = getCategorySales(applyFilters(allRecords, { ...newFilters, category: 'all' }))
    const insights = getInsights(filteredRecords, allRecords)
    set({
      filteredRecords,
      kpis,
      monthlySales,
      regionSales,
      categorySales,
      insights,
    })
  },

  resetFilters: () => {
    get().setFilters(DEFAULT_FILTERS)
  },

  loadExcelFile: (buffer: ArrayBuffer) => {
    set({ loading: true, error: null })
    try {
      const records = parseExcelFile(buffer)
      dataSource.setData(records)
      const regions = getUniqueRegions(records)
      const categories = getUniqueCategories(records)
      const dateRange = getDateRange(records)
      set({
        allRecords: records,
        regions,
        categories,
        dateRange,
        loading: false,
        error: null,
      })
      get().setFilters({ ...DEFAULT_FILTERS })
    } catch (e) {
      set({
        loading: false,
        error: (e as Error).message,
      })
    }
  },

  recalculate: () => {
    const { allRecords, filters } = get()
    if (allRecords.length > 0) {
      get().setFilters({ ...filters })
    }
  },
}))

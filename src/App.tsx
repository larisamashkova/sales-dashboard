import { useEffect } from 'react'
import { useStore } from './store/useStore'
import FileLoader from './components/FileLoader'
import FilterBar from './components/FilterBar'
import KPICards from './components/KPICards'
import SalesChart from './components/SalesChart'
import RegionChart from './components/RegionChart'
import CategoryChart from './components/CategoryChart'

import Insights from './components/Insights'
import ExportButton from './components/ExportButton'

export default function App() {
  const { allRecords, loadExcelFile } = useStore()

  useEffect(() => {
    const loadFromFile = async () => {
      try {
        const response = await fetch('/Sample_Sales_Data_MVP_Extended.xlsx')
        if (response.ok) {
          const buffer = await response.arrayBuffer()
          loadExcelFile(buffer)
        }
      } catch {
        // File not available via HTTP, user needs to upload manually
      }
    }
    loadFromFile()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Аналитика продаж</h1>
                <p className="text-xs text-gray-400">Дашборд для анализа данных</p>
              </div>
            </div>
            {allRecords.length > 0 && <ExportButton />}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-5">
        <FileLoader />
        {allRecords.length > 0 && (
          <>
            <FilterBar />
            <KPICards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <SalesChart />
              <RegionChart />
            </div>
            <CategoryChart />
            <Insights />
          </>
        )}
      </main>
    </div>
  )
}

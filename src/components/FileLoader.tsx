import { useRef, useState } from 'react'
import { useStore } from '../store/useStore'

export default function FileLoader() {
  const { loadExcelFile, loading, error, allRecords, filteredRecords, recalculate } = useStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      useStore.setState({ error: 'Пожалуйста, выберите файл формата .xlsx или .xls' })
      return
    }
    setFileName(file.name)
    const buffer = await file.arrayBuffer()
    loadExcelFile(buffer)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleClick = () => inputRef.current?.click()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Источник данных</p>
            <p className="text-xs text-gray-400">
              {fileName
                ? `Файл: ${fileName} (${allRecords.length} записей)`
                : 'Загрузите Excel-файл с данными'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`relative cursor-pointer px-4 py-2 text-sm font-medium rounded-lg border-2 border-dashed transition-all ${
              dragOver
                ? 'border-indigo-400 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-indigo-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Загрузка...
              </span>
            ) : (
              'Выбрать файл'
            )}
            <input ref={inputRef} type="file" accept=".xlsx,.xls" onChange={handleChange} className="hidden" />
          </div>

          {allRecords.length > 0 && (
            <button
              onClick={recalculate}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Обновить данные из файла"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {allRecords.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-400">
          <span>Всего записей: {allRecords.length}</span>
          <span>После фильтра: {filteredRecords.length}</span>
        </div>
      )}
    </div>
  )
}

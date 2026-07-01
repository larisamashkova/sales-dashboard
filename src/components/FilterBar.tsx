import { useStore } from '../store/useStore'

export default function FilterBar() {
  const { filters, setFilters, resetFilters, regions, categories, dateRange } = useStore()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">От</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ dateFrom: e.target.value })}
              min={dateRange.min ? dateRange.min.split('.').reverse().join('-') : ''}
              max={dateRange.max ? dateRange.max.split('.').reverse().join('-') : ''}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all bg-gray-50 hover:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">До</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ dateTo: e.target.value })}
              min={dateRange.min ? dateRange.min.split('.').reverse().join('-') : ''}
              max={dateRange.max ? dateRange.max.split('.').reverse().join('-') : ''}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all bg-gray-50 hover:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Регион</label>
            <select
              value={filters.region}
              onChange={(e) => setFilters({ region: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all bg-gray-50 hover:bg-white"
            >
              <option value="all">Все регионы</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Категория</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all bg-gray-50 hover:bg-white"
            >
              <option value="all">Все категории</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex-1 md:w-52">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Поиск</label>
            <input
              type="text"
              placeholder="Товар, категория, регион..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all bg-gray-50 hover:bg-white"
            />
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors self-end whitespace-nowrap"
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  )
}

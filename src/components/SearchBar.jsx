import { useState } from 'react'
import { SORT_OPTIONS } from '../hooks/useScryfall'

function SearchBar({ onSearch, onRandom, loading, showExpensive, onToggleExpensive }) {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState('name')
  const [dir, setDir] = useState('asc')
  const [lastQuery, setLastQuery] = useState(null) // the query of the results on screen, null after random cards

  function handleSubmit(e) {
    e.preventDefault() // prevent page reload (default form behaviour)
    setLastQuery(query)
    onSearch(query, order, dir)
  }

  // changing the sort re-runs the search that is on screen
  function changeSort(newOrder, newDir) {
    setOrder(newOrder)
    setDir(newDir)
    if (lastQuery && !loading) onSearch(lastQuery, newOrder, newDir)
  }

  function handleRandom() {
    setLastQuery(null)
    onRandom(showExpensive)
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        {/* switch for also showing cards that are too expensive to be legal */}
        <button
          type="button"
          role="switch"
          aria-checked={showExpensive}
          onClick={() => onToggleExpensive(!showExpensive)}
          title="Also show cards that are too expensive to be legal"
          className="shrink-0 flex items-center gap-2 px-3 rounded-lg bg-gray-800 border border-gray-600 hover:border-gray-400 text-sm text-gray-300 transition-colors"
        >
          <span className={`relative w-9 h-5 rounded-full transition-colors ${showExpensive ? 'bg-red-500' : 'bg-gray-600'}`}>
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showExpensive ? 'translate-x-4' : ''}`} />
          </span>
          <span className="hidden sm:inline whitespace-nowrap">Show banned</span>
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a card... e.g. Ball Lightning"
          className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors">
          Search
        </button>
      </form>

      <div className="w-full flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <label htmlFor="sort-order">Sort by</label>
          <select
            id="sort-order"
            value={order}
            onChange={(e) => changeSort(e.target.value, dir)}
            disabled={loading}
            className="px-2 py-1 rounded-md bg-gray-800 border border-gray-600 text-white cursor-pointer focus:outline-none focus:border-amber-400 disabled:opacity-50"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => changeSort(order, dir === 'asc' ? 'desc' : 'asc')}
            disabled={loading}
            title={dir === 'asc' ? 'Ascending, click for descending' : 'Descending, click for ascending'}
            className="px-2 py-1 rounded-md bg-gray-800 border border-gray-600 hover:border-gray-400 text-white disabled:opacity-50 transition-colors"
          >
            {dir === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>

        <button
          onClick={handleRandom}
          disabled={loading}
          className="text-sm text-gray-400 hover:text-amber-400 disabled:opacity-50 transition-colors underline underline-offset-2"
        >
          or show me some random {showExpensive ? '' : 'legal '}cards
        </button>
      </div>
    </div>
  )
}

export default SearchBar
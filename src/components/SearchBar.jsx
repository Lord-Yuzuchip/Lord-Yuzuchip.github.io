import { useState } from 'react'

function SearchBar({ onSearch, onRandom, loading }) {
  const [query, setQuery] = useState('')

  function handleSubmit(e) {
    e.preventDefault() // prevent page reload (default form behaviour)
    onSearch(query)
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a card... e.g. Ball Lightning"
          className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors">
          Search
        </button>
      </form>

      <button
        onClick={onRandom}
        disabled={loading}
        className="text-sm text-gray-400 hover:text-amber-400 disabled:opacity-50 transition-colors underline underline-offset-2"
      >
        or show me a random card
      </button>
    </div>
  )
}

export default SearchBar
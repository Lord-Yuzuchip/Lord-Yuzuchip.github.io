import { useState } from 'react'
import SearchBar from './components/SearchBar'
import CardGrid from './components/CardGrid'
import DeckChecker from './components/DeckChecker'
import { useScryfall } from './hooks/useScryfall'
import { usePrices } from './hooks/usePrices'

const TABS = [
  { id: 'search', label: 'Search cards' },
  { id: 'deck', label: 'Check a deck' },
]

function App() {
  const [tab, setTab] = useState('search')
  const { prices, getPrice, loading: pricesLoading } = usePrices()
  const { cards, loading, loadingMore, error, hasMore, hasSearched, searchCards, loadMoreCards, loadRandomCard } = useScryfall(getPrice, prices)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-amber-400">
              Modest - Magic the Gathering
            </h1>
            <nav className="flex gap-1 rounded-lg bg-gray-900 p-1 border border-gray-800">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    tab === id ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
            {/* tabs are hidden rather than removed, so typed text survives switching */}
            <div className={tab === 'search' ? 'w-full' : 'hidden'}>
              <SearchBar
                onSearch={searchCards}
                onRandom={loadRandomCard}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className={tab === 'search' ? '' : 'hidden'}>
          <CardGrid
            cards={cards}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            hasMore={hasMore}
            hasSearched={hasSearched}
            onLoadMoreCards={loadMoreCards}
            getPrice={getPrice}
          />
        </div>
        <div className={tab === 'deck' ? '' : 'hidden'}>
          <DeckChecker prices={prices} loading={pricesLoading} />
        </div>
      </main>
    </div>
  )
}

export default App

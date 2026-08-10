import SearchBar from './components/SearchBar'
import CardGrid from './components/CardGrid'
import { useScryfall } from './hooks/useScryfall'
import { usePrices } from './hooks/usePrices'

function App() {
  const { cards, loading, loadingMore, error, totalCards, hasMore, searchCards, loadMoreCards, loadRandomCard } = useScryfall()
  const { getPrice } = usePrices()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-amber-400">
              Modest - Magic the Gathering
            </h1>
            <SearchBar
              onSearch={searchCards}
              onRandom={loadRandomCard}
              loading={loading}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <CardGrid
          cards={cards}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          totalCards={totalCards}
          hasMore={hasMore}
          onLoadMoreCards={loadMoreCards}
          getPrice={getPrice}
        />
      </main>
    </div>
  )
}

export default App
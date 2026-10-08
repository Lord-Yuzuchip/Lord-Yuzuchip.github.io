import { useState, useCallback, useMemo } from 'react'
import SearchBar from './components/SearchBar'
import CardGrid from './components/CardGrid'
import CardDetail from './components/CardDetail'
import DeckChecker from './components/DeckChecker'
import { useScryfall } from './hooks/useScryfall'
import { usePrices } from './hooks/usePrices'

const TABS = [
  { id: 'search', label: 'Search cards' },
  { id: 'deck', label: 'Check a deck' },
]

function App() {
  const [tab, setTab] = useState('search')
  const [selectedCard, setSelectedCard] = useState(null) // card whose details are open, or null
  const closeCardDetail = useCallback(() => setSelectedCard(null), [])
  const { cardStatus, loadedSets, isLegal, loading: pricesLoading } = usePrices()
  const { cards, loading, loadingMore, error, hasMore, hasSearched, searchCards, loadMoreCards, loadRandomCard } = useScryfall(cardStatus)

  // the search keeps every card in the price files; too expensive ones are only shown when the toggle is on
  const [showExpensive, setShowExpensive] = useState(false)
  const visibleCards = useMemo(
    () => (showExpensive ? cards : cards.filter((card) => isLegal(card.name))),
    [cards, showExpensive, isLegal]
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col items-center gap-3">
            {/* title in the middle, page picker on the right (the empty first column keeps the title centered) */}
            <div className="w-full flex items-center justify-between gap-3 sm:grid sm:grid-cols-[1fr_auto_1fr]">
              <div className="hidden sm:block" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-400">
                Modest - Magic the Gathering
              </h1>
              <select
                value={tab}
                onChange={(e) => setTab(e.target.value)}
                aria-label="Choose page"
                className="justify-self-end px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-600 text-sm font-semibold text-white cursor-pointer focus:outline-none focus:border-amber-400 hover:border-gray-400 transition-colors"
              >
                {TABS.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>
            {/* tabs are hidden rather than removed, so typed text survives switching */}
            <div className={tab === 'search' ? 'w-full' : 'hidden'}>
              <SearchBar
                onSearch={searchCards}
                onRandom={loadRandomCard}
                loading={loading}
                showExpensive={showExpensive}
                onToggleExpensive={setShowExpensive}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className={tab === 'search' ? '' : 'hidden'}>
          <CardGrid
            cards={visibleCards}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            hasMore={hasMore}
            hasSearched={hasSearched}
            onLoadMoreCards={loadMoreCards}
            onSelectCard={setSelectedCard}
            isLegal={isLegal}
          />
        </div>
        <div className={tab === 'deck' ? '' : 'hidden'}>
          <DeckChecker cardStatus={cardStatus} loading={pricesLoading} />
        </div>
      </main>

      {selectedCard && (
        <CardDetail
          key={selectedCard.id}
          card={selectedCard}
          cardStatus={cardStatus}
          loadedSets={loadedSets}
          onClose={closeCardDetail}
        />
      )}
    </div>
  )
}

export default App

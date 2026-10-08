import { useEffect, useRef } from 'react'
import MagicCard from './MagicCard'

// how close (in pixels) the load more button must be to the bottom of the screen before it triggers
const AUTO_LOAD_DISTANCE = 800

function CardGrid({ cards, loading, loadingMore, error, hasMore, hasSearched, onLoadMoreCards, onSelectCard, isLegal }) {
  const loadMoreRef = useRef(null)

  // automatically "click" load more when the button gets close to the screen
  useEffect(() => {
    const button = loadMoreRef.current
    if (!button || loadingMore) return

    // re-created after every load, and fires right away if the button is still close
    // (e.g. when the price filter removed most of the last page)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMoreCards()
      },
      { rootMargin: `0px 0px ${AUTO_LOAD_DISTANCE}px 0px` }
    )
    observer.observe(button)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, loading, error, cards.length, onLoadMoreCards])

  // Loading state — show placeholder shimmer cards
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-5/7 rounded-xl bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-lg">{error}</p>
        <p className="text-gray-500 text-sm mt-2">
          Try a different search term.
        </p>
      </div>
    )
  }

  // Empty state (before any search, or every result was filtered out).
  // If there are more pages, show the normal view instead so load more triggers and keeps looking
  if (cards.length === 0 && !hasMore) {
    return (
      <div className="text-center py-20">
        {hasSearched ? (
          <>
            <p className="text-gray-400 text-lg">No cards found.</p>
            <p className="text-gray-500 text-sm mt-2">
              No legal cards matching your search are within the price limit.
            </p>
          </>
        ) : (
          <p className="text-gray-500 text-lg">Search for a card to get started.</p>
        )}
      </div>
    )
  }

  return (
    <div>
      <p className="text-gray-500 text-sm mb-4">
        {/* the filtered total is only known once every page has been loaded */}
        Showing {cards.length} of {hasMore ? '???' : cards.length} cards
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
        {cards.map((card) => (
          <MagicCard key={card.id} card={card} onSelect={onSelectCard} isLegal={isLegal(card.name)} />
        ))}
      </div>

      {hasMore && (
      <div className="flex justify-center mt-10">
        <button
          ref={loadMoreRef}
          onClick={onLoadMoreCards}
          disabled={loadingMore}
          className="px-8 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg border border-gray-600 hover:border-gray-400 transition-all"
        >
        {loadingMore ? 'Loading...' : `Load more`}
          </button>
        </div>
    )}



    {loadingMore && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-5/7 rounded-xl bg-gray-800 animate-pulse" />
          ))}
        </div>
      )}
    </div>

    
    

  )
}

export default CardGrid
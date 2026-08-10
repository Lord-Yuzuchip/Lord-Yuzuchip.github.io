import MagicCard from './MagicCard'

function CardGrid({ cards, loading, loadingMore, error, totalCards, hasMore, onLoadMoreCards, getPrice }) {
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

  // Empty state (before any search)
  if (cards.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Search for a card to get started.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-gray-500 text-sm mb-4">
        Showing {cards.length} of {totalCards.toLocaleString()} results
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
        {cards.map((card) => (
          <MagicCard key={card.id} card={card} getPrice={getPrice} />
        ))}
      </div>

      {hasMore && (
      <div className="flex justify-center mt-10">
        <button 
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
            <div key={i} className="aspect-[5/7] rounded-xl bg-gray-800 animate-pulse" />
          ))}
        </div>
      )}
    </div>

    
    

  )
}

export default CardGrid
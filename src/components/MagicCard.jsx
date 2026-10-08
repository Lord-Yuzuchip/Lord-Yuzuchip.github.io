import { useState } from 'react'

function MagicCard({ card, onSelect, isLegal }) {
  const [showBack, setShowBack] = useState(false)

  // Double sided cards (e.g. transform cards) have an image per face instead of one for the whole card.
  // Split and adventure cards have two faces but only one image, so they can't be flipped.
  const faceImages = card.image_uris
    ? []
    : (card.card_faces ?? []).map((face) => face.image_uris?.normal).filter(Boolean)
  const isDoubleSided = faceImages.length > 1

  const imageUrl =
    card.image_uris?.normal ||
    faceImages[showBack ? 1 : 0] ||
    null

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Show details for ${card.name}`}
      onClick={() => onSelect(card)}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(card) }}
      className={`cursor-pointer group relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 ${
        // outline shows whether the card is legal or too expensive
        isLegal
          ? 'hover:ring-emerald-400 hover:shadow-emerald-900/30 focus-visible:ring-emerald-400'
          : 'hover:ring-red-500 hover:shadow-red-900/30 focus-visible:ring-red-500'
      }`}
    >
      {/* Card image (name, price etc. are in the card details) */}
      <div className="relative aspect-5/7 bg-gray-800 overflow-hidden">
        {isDoubleSided && (
          <button
            onClick={(e) => {
              e.stopPropagation() // only flip, don't also open the card details
              setShowBack(!showBack)
            }}
            title={showBack ? 'Show front side' : 'Show back side'}
            aria-label={showBack ? 'Show front side' : 'Show back side'}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-gray-950/80 hover:bg-amber-500 text-white hover:text-black text-sm border border-gray-600 hover:border-amber-400 backdrop-blur-sm transition-colors"
          >
            ⟲
          </button>
        )}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={isDoubleSided ? card.card_faces[showBack ? 1 : 0].name : card.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No image available
          </div>
        )}
      </div>
    </div>
  )
}

export default MagicCard
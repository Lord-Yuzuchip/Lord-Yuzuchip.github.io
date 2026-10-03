import { useState } from 'react'
import { PRICE_LIMIT } from '../hooks/useScryfall'

function MagicCard({ card, getPrice }) {
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

  const manaCost =
    card.mana_cost ||
    card.card_faces?.[0]?.mana_cost ||
    ''

  const cachedPrice = getPrice(card.name)?.toFixed(2)

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-gray-900 border border-gray-700 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/30">
      {/* Card image */}
      <div className="relative aspect-5/7 bg-gray-800 overflow-hidden">
        {isDoubleSided && (
          <button
            onClick={() => setShowBack(!showBack)}
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

      {/* Card info below the image */}
      <div className="p-3 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-sm leading-tight">
            {card.name}
          </h3>
          {cachedPrice && (
            <span className={`text-xs shrink-0 font-mono ${parseFloat(cachedPrice) > PRICE_LIMIT ? 'text-red-400' : 'text-emerald-400'}`}>
              {cachedPrice} €
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 leading-tight">{card.type_line}</p>
        {card.set_name && (
          <p className="text-xs text-gray-600 mt-1">{card.set_name}</p>
        )}
      </div>
    </div>
  )
}

export default MagicCard
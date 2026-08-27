function MagicCard({ card, getPrice }) {
  // Some cards have two faces (e.g. transform cards) — handle both cases
  const imageUrl =
    card.image_uris?.normal ||
    card.card_faces?.[0]?.image_uris?.normal ||
    null

  const manaCost =
    card.mana_cost ||
    card.card_faces?.[0]?.mana_cost ||
    ''

  const cachedPrice = getPrice(card.name).toFixed(2)

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-gray-900 border border-gray-700 hover:border-amber-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/30">
      {/* Card image */}
      <div className="aspect-5/7 bg-gray-800 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={card.name}
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
            <span className={`text-xs shrink-0 font-mono ${parseFloat(cachedPrice) > 5.49/14 ? 'text-red-400' : 'text-emerald-400'}`}>
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
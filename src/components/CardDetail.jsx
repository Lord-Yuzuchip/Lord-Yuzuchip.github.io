import { useState, useEffect } from 'react'
import ManaText from './ManaText'
import { SET_CODES, PRICE_FILE_SETS, PRICE_LIMIT, BAN_LIMIT } from '../config'

// printings already fetched, by Scryfall search url, so reopening a card doesn't call the API again
const printingsCache = new Map()

// image urls for each side of a card: one for normal/split/adventure cards, two for double sided cards
function cardImages(card, size) {
  if (card.image_uris) return [card.image_uris[size]]
  return (card.card_faces ?? []).map((face) => face.image_uris?.[size]).filter(Boolean)
}

// Name, mana cost, type and rules text, once per face for split / adventure / double sided cards
function CardText({ card }) {
  const faces = card.card_faces && !card.oracle_text ? card.card_faces : [card]

  return (
    <div className="flex flex-col gap-4">
      {faces.map((face, i) => (
        <div key={i} className={i > 0 ? 'pt-4 border-t border-gray-800' : ''}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-white leading-tight">{face.name}</h3>
            {face.mana_cost && (
              <span className="shrink-0 text-base"><ManaText text={face.mana_cost} /></span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">{face.type_line}</p>
          {face.oracle_text && (
            <div className="mt-3 flex flex-col gap-2 text-sm text-gray-200 leading-relaxed">
              {face.oracle_text.split('\n').map((line, j) => (
                <p key={j}><ManaText text={line} /></p>
              ))}
            </div>
          )}
          {face.power !== undefined && (
            <p className="mt-2 text-sm font-semibold text-gray-300">{face.power}/{face.toughness}</p>
          )}
          {face.loyalty !== undefined && (
            <p className="mt-2 text-sm font-semibold text-gray-300">Loyalty: {face.loyalty}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// Green: legal because of this set's price. Yellow: legal only because of an earlier set
// (this set's price is between PRICE_LIMIT and BAN_LIMIT, or missing). Red: not legal.
function LegalStatus({ entry }) {
  if (!entry.legal) return <span className="text-red-400">Not legal</span>

  // rulePrice is the group's average for grouped cards, otherwise the card's own price
  const carriedOver = entry.rulePrice === null || entry.rulePrice > PRICE_LIMIT
  return carriedOver ? (
    <span className="text-yellow-400" title="Legal because of an earlier set's price, not this one">Legal</span>
  ) : (
    <span className="text-emerald-400">Legal</span>
  )
}

// Price and legality in each of the price list sets
function PriceHistory({ status, loadedSets }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 text-xs">
          <th className="font-normal pb-1">Set</th>
          <th className="font-normal pb-1 text-right">Price</th>
          {status?.group && <th className="font-normal pb-1 text-right">Group avg</th>}
          <th className="font-normal pb-1 text-right">Status after</th>
        </tr>
      </thead>
      <tbody>
        {PRICE_FILE_SETS.map((set) => {
          const entry = status?.history.find((h) => h.set === set)
          let priceText
          if (!loadedSets.includes(set)) priceText = 'No price list yet'
          else if (!entry) priceText = 'Not printed yet'
          else if (entry.price === null) priceText = 'No price'
          else priceText = `${entry.price.toFixed(2)} €`

          return (
            <tr key={set} className="border-t border-gray-800">
              <td className="py-1.5 font-mono uppercase text-gray-300">{set}</td>
              <td className={`py-1.5 text-right ${entry?.price != null ? 'font-mono text-white' : 'text-gray-500'}`}>
                {priceText}
              </td>
              {status?.group && (
                <td className={`py-1.5 text-right ${entry?.rulePrice != null ? 'font-mono text-white' : 'text-gray-500'}`}>
                  {entry?.rulePrice != null ? `${entry.rulePrice.toFixed(2)} €` : '-'}
                </td>
              )}
              <td className="py-1.5 text-right">
                {entry ? (
                  <LegalStatus entry={entry} />
                ) : (
                  <span className="text-gray-600">-</span>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// Scryfall's printings link is a search ("oracleid:..."), so add game:paper to leave out digital only printings
function paperPrintingsUrl(card) {
  if (!card.prints_search_uri) return null
  const url = new URL(card.prints_search_uri)
  url.searchParams.set('q', `${url.searchParams.get('q')} game:paper`)
  return url.toString()
}

function Printings({ card, selectedId, onSelect }) {
  const printingsUrl = paperPrintingsUrl(card)
  const [printings, setPrintings] = useState(printingsCache.get(printingsUrl) ?? null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const url = printingsUrl
    if (!url || printingsCache.has(url)) return

    let cancelled = false
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.object === 'error') throw new Error(data.details)
        const result = { cards: data.data, total: data.total_cards }
        printingsCache.set(url, result)
        if (!cancelled) setPrintings(result)
      })
      .catch((err) => {
        console.log(err)
        if (!cancelled) setError('Could not load printings.')
      })
    return () => { cancelled = true }
  }, [printingsUrl])

  if (error) return <p className="text-sm text-red-400">{error}</p>
  if (!printings) return <p className="text-sm text-gray-500">Loading printings...</p>

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        {printings.total} printings{printings.total > printings.cards.length && `, showing the first ${printings.cards.length}`}.
        Click one to show it above.
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {printings.cards.map((printing) => {
          const isLegalSet = SET_CODES.includes(printing.set)
          return (
            <button
              key={printing.id}
              onClick={() => onSelect(printing)}
              className={`flex flex-col text-left rounded-lg overflow-hidden border transition-colors ${
                printing.id === selectedId ? 'border-amber-400' : 'border-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="aspect-5/7 bg-gray-800">
                {cardImages(printing, 'small')[0] && (
                  <img src={cardImages(printing, 'small')[0]} alt={printing.set_name} className="w-full h-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="p-1.5 bg-gray-900">
                <p className="text-[11px] leading-tight text-gray-300 line-clamp-2">{printing.set_name}</p>
                <p className="text-[10px] text-gray-500">
                  {printing.released_at?.slice(0, 4)}
                  {isLegalSet && <span className="text-emerald-500"> · legal set</span>}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CardDetail({ card, cardStatus, loadedSets, onClose }) {
  const [shownPrinting, setShownPrinting] = useState(card)
  const [showBack, setShowBack] = useState(false)

  const status = cardStatus[card.name]
  const images = cardImages(shownPrinting, 'large')
  const isDoubleSided = images.length > 1

  // close with Escape, and stop the page behind from scrolling while open
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = oldOverflow
    }
  }, [onClose])

  function selectPrinting(printing) {
    setShownPrinting(printing)
    setShowBack(false)
  }

  return (
    <div
      className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm overflow-y-auto px-4 py-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={card.name}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl mx-auto rounded-2xl bg-gray-950 border border-gray-700 p-5 sm:p-8 flex flex-col gap-8"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-gray-800 text-xl transition-colors"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="md:w-80 shrink-0 flex flex-col items-center gap-2">
            <div className="relative w-full max-w-80 aspect-5/7 rounded-xl overflow-hidden bg-gray-800">
              {images.length > 0 ? (
                <img
                  src={images[showBack ? 1 : 0]}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No image available</div>
              )}
            </div>
            {isDoubleSided && (
              <button
                onClick={() => setShowBack(!showBack)}
                className="px-4 py-1.5 rounded-full bg-gray-800 hover:bg-amber-500 hover:text-black text-sm font-semibold border border-gray-600 transition-colors"
              >
                ⟲ Show {showBack ? 'front' : 'back'}
              </button>
            )}
            <p className="text-xs text-gray-500 text-center">
              {shownPrinting.set_name} ({shownPrinting.set?.toUpperCase()}) · #{shownPrinting.collector_number}
            </p>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <div className="flex items-center gap-3 pr-10">
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  status?.legal ? 'bg-emerald-900/60 text-emerald-300' : 'bg-red-900/60 text-red-300'
                }`}
              >
                {status?.legal ? 'Legal' : 'Not legal'}
              </span>
              <span className="text-sm text-gray-400">
                {status
                  ? status.price !== null ? `Newest price: ${status.price.toFixed(2)} €` : 'No price data'
                  : 'Not in any legal set'}
              </span>
            </div>

            <CardText card={card} />

            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-1">Prices</h4>
              <p className="text-xs text-gray-500 mb-2">
                Legal at or below {PRICE_LIMIT.toFixed(2)} €, stays legal until above {BAN_LIMIT.toFixed(2)} € in a later set.
              </p>
              {status?.group && (
                <p className="text-xs text-gray-400 mb-2">
                  Part of the <span className="text-white">{status.group.name}</span>, so legality uses the group's average
                  price: {status.group.cards.join(', ')}.
                </p>
              )}
              <PriceHistory status={status} loadedSets={loadedSets} />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-1">Printings</h4>
          <Printings card={card} selectedId={shownPrinting.id} onSelect={selectPrinting} />
        </div>
      </div>
    </div>
  )
}

export default CardDetail

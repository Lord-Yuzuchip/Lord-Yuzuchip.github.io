import { useState, useMemo } from 'react'
import { PRICE_LIMIT, BAN_LIMIT, PRICE_FILE_SETS } from '../config'
import { parseDecklist, buildNameIndex, checkDeck } from '../utils/decklist'

function ResultSection({ title, description, cards, showPrice }) {
  if (cards.length === 0) return null

  return (
    <div className="rounded-xl border border-red-900/60 bg-gray-900 p-4">
      <h3 className="font-semibold text-red-400">
        {title} ({cards.length})
      </h3>
      <p className="text-xs text-gray-500 mb-3">{description}</p>
      <ul className="flex flex-col gap-1 text-sm">
        {cards.map((card) => (
          <li key={card.name} className="flex justify-between gap-4">
            <span className="text-white">
              <span className="text-gray-500 font-mono mr-2">{card.count}</span>
              {card.name}
              {card.group && (
                <span
                  className="ml-2 px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300 text-xs whitespace-nowrap"
                  title="Legality uses the average price of this group"
                >
                  {card.group}
                </span>
              )}
            </span>
            {showPrice && (
              card.group ? (
                // for grouped cards the group average decides, the card's own price is just for reference
                <span className="shrink-0 text-right font-mono text-xs leading-tight">
                  <span className="block text-red-400 text-sm">avg {card.groupPrice.toFixed(2)} €</span>
                  <span className="block text-gray-500">own {card.price !== null ? `${card.price.toFixed(2)} €` : '-'}</span>
                </span>
              ) : (
                <span className="font-mono text-red-400 shrink-0">{card.price.toFixed(2)} €</span>
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function DeckChecker({ cardStatus, loading }) {
  const [decklist, setDecklist] = useState('')
  const [result, setResult] = useState(null)

  // rebuilding the name lookup on every check would be slow with ~20,000 cards
  const nameIndex = useMemo(() => buildNameIndex(cardStatus), [cardStatus])

  function handleCheck() {
    const deck = parseDecklist(decklist)
    const totalCards = deck.reduce((sum, card) => sum + card.count, 0)
    setResult({ ...checkDeck(deck, cardStatus, nameIndex), uniqueCards: deck.length, totalCards })
  }

  const allGood = result && result.tooExpensive.length === 0 && result.notLegal.length === 0 && result.noPrice.length === 0

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-3">
        <textarea
          value={decklist}
          onChange={(e) => setDecklist(e.target.value)}
          placeholder={'Paste your decklist here, e.g.\n4 Lightning Bolt\n4x Counterspell\n20 Island'}
          rows={14}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-amber-400 transition-colors"
        />
        <button
          onClick={handleCheck}
          disabled={loading || !decklist.trim()}
          className="self-end px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors"
        >
          {loading ? 'Loading prices...' : 'Check deck'}
        </button>
      </div>

      {result && (
        <div className="flex flex-col gap-4">
          <p className="text-gray-500 text-sm">
            Checked {result.totalCards} cards ({result.uniqueCards} unique). A card becomes legal at or below {PRICE_LIMIT.toFixed(2)} € in
            one of the last {PRICE_FILE_SETS.length} sets' price lists, and stays legal until it goes above {BAN_LIMIT.toFixed(2)} € in a later one.
          </p>

          {allGood && (
            <div className="rounded-xl border border-emerald-800 bg-gray-900 p-4 text-emerald-400 font-semibold">
              All cards are legal and within the price limit.
            </div>
          )}

          <ResultSection
            title="Over the price limit"
            description="Not legal under the price rules. The price shown is the newest one."
            cards={result.tooExpensive}
            showPrice
          />
          <ResultSection
            title="Not in the legal card pool"
            description="Not printed in any legal set, or the name is misspelled."
            cards={result.notLegal}
          />
          <ResultSection
            title="No price data"
            description="Legal, but Cardmarket has no price for any printing yet."
            cards={result.noPrice}
          />
        </div>
      )}
    </div>
  )
}

export default DeckChecker

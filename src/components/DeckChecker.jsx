import { useState, useMemo } from 'react'
import { PRICE_LIMIT } from '../hooks/useScryfall'
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
            </span>
            {showPrice && (
              <span className="font-mono text-red-400 shrink-0">{card.price.toFixed(2)} €</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function DeckChecker({ prices, loading }) {
  const [decklist, setDecklist] = useState('')
  const [result, setResult] = useState(null)

  // rebuilding the name lookup on every check would be slow with ~20,000 cards
  const nameIndex = useMemo(() => buildNameIndex(prices), [prices])

  function handleCheck() {
    const deck = parseDecklist(decklist)
    const totalCards = deck.reduce((sum, card) => sum + card.count, 0)
    setResult({ ...checkDeck(deck, prices, nameIndex), uniqueCards: deck.length, totalCards })
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
            Checked {result.totalCards} cards ({result.uniqueCards} unique) against a limit of {PRICE_LIMIT.toFixed(2)} €
          </p>

          {allGood && (
            <div className="rounded-xl border border-emerald-800 bg-gray-900 p-4 text-emerald-400 font-semibold">
              All cards are legal and within the price limit.
            </div>
          )}

          <ResultSection
            title="Over the price limit"
            description={`Cheapest printing costs more than ${PRICE_LIMIT.toFixed(2)} €.`}
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

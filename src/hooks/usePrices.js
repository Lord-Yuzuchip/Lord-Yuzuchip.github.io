import { useState, useEffect, useCallback } from 'react'
import { PRICE_FILE_SETS, PRICE_LIMIT, BAN_LIMIT, CARD_GROUPS } from '../config'

// Loads one set's price file, or null if it doesn't exist (yet)
async function loadPriceFile(set) {
  try {
    const res = await fetch(`/${set}_prices.json`)
    if (!res.ok) return null
    return await res.json() // a missing file can come back as the index.html page, which fails here
  } catch {
    return null
  }
}

// average price of each grouped card's group in one price file: name -> average (null if no member has a price)
function groupAverages(prices, groups) {
  const averages = {}
  for (const group of groups) {
    const groupPrices = group.cards.map((name) => prices[name]).filter((price) => price != null)
    const average = groupPrices.length > 0
      ? groupPrices.reduce((sum, price) => sum + price, 0) / groupPrices.length
      : null
    for (const name of group.cards) averages[name] = average
  }
  return averages
}

// Goes through the price files oldest to newest and decides each card's legality:
// - at or below PRICE_LIMIT in a set: legal
// - above BAN_LIMIT in a set: not legal
// - in between, or no price: keeps whatever it was in the set before (not legal if it's the first set it shows up in)
// Cards in CARD_GROUPS use their group's average price for this instead of their own.
// priceFiles: [{ set, prices }], oldest first
export function computeCardStatus(priceFiles, groups = CARD_GROUPS) {
  // name -> { price: newest known own price or null, legal, group (if any),
  //           history: [{ set, price: own price, rulePrice: price the rule used, legal }] for each set the card is in }
  const status = {}

  const groupOf = {}
  for (const group of groups) {
    for (const name of group.cards) groupOf[name] = group
  }

  for (const { set, prices } of priceFiles) {
    const averages = groupAverages(prices, groups)

    for (const [name, price] of Object.entries(prices)) {
      const previous = status[name] ?? { price: null, legal: false, history: [] }
      const rulePrice = name in averages ? averages[name] : price
      let legal = previous.legal
      if (rulePrice !== null) {
        if (rulePrice <= PRICE_LIMIT) legal = true
        else if (rulePrice > BAN_LIMIT) legal = false
      }
      status[name] = {
        price: price ?? previous.price,
        legal,
        group: groupOf[name],
        history: [...previous.history, { set, price, rulePrice, legal }],
      }
    }
  }

  return status
}

export function usePrices() {
  const [cardStatus, setCardStatus] = useState({})
  const [loadedSets, setLoadedSets] = useState([]) // sets whose price file was found
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all(PRICE_FILE_SETS.map(loadPriceFile))
      .then((files) => {
        const found = PRICE_FILE_SETS
          .map((set, i) => ({ set, prices: files[i] }))
          .filter((file) => file.prices)
        if (found.length === 0) console.error('Could not load any price files')
        const status = computeCardStatus(found)
        // catch typos in CARD_GROUPS: names that aren't in any price file
        for (const group of CARD_GROUPS) {
          const unknown = group.cards.filter((name) => !(name in status))
          if (found.length > 0 && unknown.length > 0) {
            console.warn(`CARD_GROUPS "${group.name}" has names not in any price file:`, unknown)
          }
        }
        setCardStatus(status)
        setLoadedSets(found.map((file) => file.set))
      })
      .finally(() => setLoading(false))
  }, []) // runs once when the app first loads

  const getPrice = useCallback((cardName) => {
    return cardStatus[cardName]?.price ?? null
  }, [cardStatus])

  const isLegal = useCallback((cardName) => {
    return cardStatus[cardName]?.legal ?? false
  }, [cardStatus])

  return { cardStatus, loadedSets, getPrice, isLegal, loading }
}

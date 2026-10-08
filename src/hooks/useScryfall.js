import { useState, useCallback } from 'react'
import { NEWEST_SET } from '../config'

// How long to wait between API calls (Scryfall asks for politeness)
const DELAY_MS = 1000

// how many cards "show me some random legal cards" displays
const RANDOM_COUNT = 10

// sort orders the user can pick, as Scryfall's "order" values
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'released', label: 'Release date' },
  { value: 'rarity', label: 'Rarity' },
  { value: 'color', label: 'Color' },
  { value: 'cmc', label: 'Mana value' },
  { value: 'power', label: 'Power' },
  { value: 'toughness', label: 'Toughness' },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const mainQuery = `game:paper (in:core or in:expansion or is:tangoland or is:bicycleland) not:melded not:ub date>=8ed date<=${NEWEST_SET} -set:tsb`

// keeps cards that are in the price files. Whether too expensive cards are shown is decided when displaying,
// so the "show expensive" toggle works instantly without searching again
function filterInPriceFiles(data, cardStatus){
  return data.data.filter((card) => card.name in cardStatus)
}

export function useScryfall(cardStatus) {
  const [cards, setCards] = useState([])       // the array of card results
  const [loading, setLoading] = useState(false) // true while fetching
  const [loadingMore, setLoadingMore] = useState(false) //true while doing later searches for big queries
  const [error, setError] = useState(null)      // holds any error message
  const [totalCards, setTotalCards] = useState(0) //remember total cards from search
  const [nextPage, setNextPage] = useState(null) //url for the next page, or null when small search
  const [hasSearched, setHasSearched] = useState(false) //false until the first search, to tell "no results" from "not searched yet"


  const searchCards = useCallback(async (query, order = 'name', dir = 'asc') => {
    // sorting goes in its own url parameters, never in the query text, and only known values are allowed
    if (!SORT_OPTIONS.some((option) => option.value === order)) order = 'name'
    if (dir !== 'asc' && dir !== 'desc') dir = 'asc'

    if (!query.trim()) return // don't search on empty input
    query = "(" + query + ") " + mainQuery

    setLoading(true)
    setError(null)
    setCards([])
    setNextPage(null)

    try {
      await delay(DELAY_MS)

      const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=${order}&dir=${dir}`
      const response = await fetch(url)
      let data = await response.json()

      if (data.object === 'error') {
        // Scryfall returns an error object if nothing is found
        setError(data.details || 'No cards found.')
        setCards([])
      } else {
        setTotalCards(data.total_cards)
        let filteredCards = filterInPriceFiles(data, cardStatus)

        // if the whole page was filtered out, keep going until something is left or there are no more pages
        while (filteredCards.length === 0 && data.has_more) {
          await delay(DELAY_MS)
          const nextResponse = await fetch(data.next_page)
          data = await nextResponse.json()
          if (data.object === 'error') break
          filteredCards = filterInPriceFiles(data, cardStatus)
        }

        setCards([...filteredCards])
        setNextPage(data.has_more ? data.next_page : null)
      }
      setHasSearched(true)
    } catch (err) {
        console.log(err)
        setError('Something went wrong. Check your internet connection.')
    } finally {
        setLoading(false)
    }
  }, [cardStatus])

  const loadMoreCards = useCallback(async () => {
    if (!nextPage) return

    setLoadingMore(true)

    try {
      await delay(DELAY_MS)

      const response = await fetch(nextPage)
      const data = await response.json()

      if (data.object !== 'error') {
        const filteredCards = filterInPriceFiles(data, cardStatus)
        setCards(prev => [...prev, ...filteredCards])
        setNextPage(data.has_more ? data.next_page : null)
      }

    } catch (err) {
        console.log(err)
        setError('Could not load additional cards.')
    } finally {
        setLoadingMore(false)
    }
  }, [nextPage, cardStatus])

  const loadRandomCard = useCallback(async (includeExpensive = false) => {
    setLoading(true)
    setError(null)
    setNextPage(null)
    try {
      await delay(DELAY_MS)

      // pick random names from the price files (only legal ones unless includeExpensive),
      // then fetch them all in one request instead of one request per card
      const names = Object.keys(cardStatus).filter((name) => includeExpensive || cardStatus[name].legal)
      const picked = new Set()
      while (picked.size < Math.min(RANDOM_COUNT, names.length)) {
        picked.add(names[Math.floor(Math.random() * names.length)])
      }

      const response = await fetch('https://api.scryfall.com/cards/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // the collection endpoint doesn't find "Front // Back" names, only the front face
        body: JSON.stringify({ identifiers: [...picked].map((name) => ({ name: name.split(' // ')[0] })) }),
      })
      const data = await response.json()
      if (data.object === 'error') {
        setError(data.details || 'Could not load random cards.')
        return
      }

      setCards(data.data)
      setTotalCards(data.data.length)
      setHasSearched(true)
    } catch (err) {
      console.log(err)
      setError('Could not load random cards.')
    } finally {
      setLoading(false)
    }
  }, [cardStatus])

  return { cards, loading, loadingMore, error, totalCards, hasMore: nextPage!==null, hasSearched, searchCards, loadMoreCards, loadRandomCard }
}
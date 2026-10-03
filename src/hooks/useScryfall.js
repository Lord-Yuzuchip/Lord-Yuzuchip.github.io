import { useState, useCallback } from 'react'

// How long to wait between API calls (Scryfall asks for politeness)
const DELAY_MS = 1000

// how many cards "show me some random legal cards" displays
const RANDOM_COUNT = 10

const MSRP = 5.49
const BOOSTER_SIZE = 14
export const PRICE_LIMIT = MSRP / BOOSTER_SIZE
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const mainQuery = "game:paper (is:core or is:expansion or is:tangoland or is:bicycleland) not:melded not:ub date>=8ed date<=fra -set:tsb"

function filterByPrice(data, getPrice){
  let tempCards = []
  for (const point of data.data){
    const price = getPrice(point.name)
    if (price !== null && price<=PRICE_LIMIT){
      tempCards = [...tempCards, point]
    }
  }
  return tempCards
}

export function useScryfall(getPrice, prices) {
  const [cards, setCards] = useState([])       // the array of card results
  const [loading, setLoading] = useState(false) // true while fetching
  const [loadingMore, setLoadingMore] = useState(false) //true while doing later searches for big queries
  const [error, setError] = useState(null)      // holds any error message
  const [totalCards, setTotalCards] = useState(0) //remember total cards from search
  const [nextPage, setNextPage] = useState(null) //url for the next page, or null when small search
  const [hasSearched, setHasSearched] = useState(false) //false until the first search, to tell "no results" from "not searched yet"


  const searchCards = useCallback(async (query) => {
    if (!query.trim()) return // don't search on empty input
    query = "(" + query + ") " + mainQuery

    setLoading(true)
    setError(null)
    setCards([])
    setNextPage(null)

    try {
      await delay(DELAY_MS)

      const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=name`
      const response = await fetch(url)
      let data = await response.json()

      if (data.object === 'error') {
        // Scryfall returns an error object if nothing is found
        setError(data.details || 'No cards found.')
        setCards([])
      } else {
        setTotalCards(data.total_cards)
        let filteredCards = filterByPrice(data, getPrice)

        // if the price filter removed the whole page, keep going until something is left or there are no more pages
        while (filteredCards.length === 0 && data.has_more) {
          await delay(DELAY_MS)
          const nextResponse = await fetch(data.next_page)
          data = await nextResponse.json()
          if (data.object === 'error') break
          filteredCards = filterByPrice(data, getPrice)
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
  }, [getPrice])

  const loadMoreCards = useCallback(async () => {
    if (!nextPage) return

    setLoadingMore(true)

    try {
      await delay(DELAY_MS)

      const response = await fetch(nextPage)
      const data = await response.json()

      if (data.object !== 'error') {
        const filteredCards = filterByPrice(data, getPrice)
        setCards(prev => [...prev, ...filteredCards])
        setNextPage(data.has_more ? data.next_page : null)
      }

    } catch (err) {
        console.log(err)
        setError('Could not load additional cards.')
    } finally {
        setLoadingMore(false)
    }
  }, [nextPage, getPrice])

  const loadRandomCard = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNextPage(null)
    try {
      await delay(DELAY_MS)

      // pick random names that already pass the price check from prices.json,
      // then fetch them all in one request instead of one request per card
      const cheapNames = Object.keys(prices).filter((name) => prices[name] !== null && prices[name] <= PRICE_LIMIT)
      const picked = new Set()
      while (picked.size < Math.min(RANDOM_COUNT, cheapNames.length)) {
        picked.add(cheapNames[Math.floor(Math.random() * cheapNames.length)])
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
  }, [prices])

  return { cards, loading, loadingMore, error, totalCards, hasMore: nextPage!==null, hasSearched, searchCards, loadMoreCards, loadRandomCard }
}
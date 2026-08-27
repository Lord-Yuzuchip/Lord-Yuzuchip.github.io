import { useState, useCallback } from 'react'

// How long to wait between API calls (Scryfall asks for politeness)
const DELAY_MS = 1000

const MSRP = 5.49
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const mainQuery = "game:paper (is:core or is:expansion or is:tangoland or is:bicycleland) not:melded not:ub date>=8ed date<=sos -set:tsb"

function filterByPrice(data, getPrice){
  const tempCards = []
  for (const point of data.data){
    if (getPrice(point.name)<=0.37){
      tempCards.push(point)
    }
  }
  return tempCards
}

export function useScryfall(getPrice) {
  const [cards, setCards] = useState([])       // the array of card results
  const [loading, setLoading] = useState(false) // true while fetching
  const [loadingMore, setLoadingMore] = useState(false) //true while doing later searches for big queries
  const [error, setError] = useState(null)      // holds any error message
  const [totalCards, setTotalCards] = useState(0) //remember total cards from search
  const [nextPage, setNextPage] = useState(null) //url for the next page, or null when small search


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
      const data = await response.json()

      if (data.object === 'error') {
        // Scryfall returns an error object if nothing is found
        setError(data.details || 'No cards found.')
        setCards([])
      } else {
        const filteredCards = filterByPrice(data, getPrice)
        setCards(filteredCards)
        // console.log(data.data[0])
        // console.log(data.data[0].prints_search_uri)
        setTotalCards(data.total_cards)
        setNextPage(data.has_more ? data.next_page : null)
      }
    } catch (err) {
        console.log(err)
        setError('Something went wrong. Check your internet connection.')
    } finally {
        setLoading(false)
    }
  }, [])

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
  }, [nextPage])

  const loadRandomCard = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNextPage(null)
    try {
      await delay(DELAY_MS)
      let url = `https://api.scryfall.com/cards/random?q=${encodeURIComponent(mainQuery)}&order=name`
      const response = await fetch(url)
      const card = await response.json()
      setCards([card])
      setTotalCards(1)
    } catch (err) {
      console.log(err)
      setError('Could not load a random card.')
    } finally {
      setLoading(false)
    }
  }, [])

  return { cards, loading, loadingMore, error, totalCards, hasMore: nextPage!==null, searchCards, loadMoreCards, loadRandomCard }
}
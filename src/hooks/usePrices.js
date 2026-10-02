import { useState, useEffect, useCallback } from 'react'

const BACKEND_URL = 'http://localhost:3001'

export function usePrices() {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/prices.json`)
      .then(res => res.json())
      .then(data => setPrices(data))
      .catch(() => console.error('Could not load prices'))
      .finally(() => setLoading(false))
  }, []) // runs once when the app first loads

  const getPrice = useCallback((cardName) => {
    return prices[cardName] ?? null
  }, [prices])

  return { prices, getPrice, loading }
}
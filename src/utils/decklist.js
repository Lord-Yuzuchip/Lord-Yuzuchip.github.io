import { PRICE_LIMIT } from '../hooks/useScryfall'

// Lines that are section headers rather than cards (MTGA, Moxfield, MTGO exports)
const SECTION_HEADERS = /^(deck|main ?deck|mainboard|sideboard|commander|companion|maybeboard|about|name\s.*)\s*:?$/i

// lowercase, no accents, "Æther" -> "aether", and any "/" or "//" split written as " // "
export function normalizeName(name) {
  return name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/æ/gi, 'ae')
    .replace(/\s*\/\/?\s*/g, ' // ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

// "4 Lightning Bolt", "4x Lightning Bolt", "4 Lightning Bolt (M10) 146", "SB: 2 Duress", "Island"
export function parseDecklist(text) {
  const cards = new Map() // normalized name -> { name, count }

  for (let line of text.split('\n')) {
    line = line.trim()
    if (!line || line.startsWith('//') || line.startsWith('#') || SECTION_HEADERS.test(line)) {
      continue
    }
    line = line.replace(/^SB:\s*/i, '')

    const match = line.match(/^(\d+)\s*x?\s+(.+)$/i)
    const count = match ? parseInt(match[1]) : 1
    let name = match ? match[2] : line

    // remove set code / collector number / foil markers that exporters add after the name
    name = name
      .replace(/\s+\*[^*]+\*\s*$/, '')
      .replace(/\s+\[[^\]]*\]\s*$/, '')
      .replace(/\s+\([A-Za-z0-9]+\)(\s+\S+)?\s*$/, '')
      .trim()

    const key = normalizeName(name)
    const existing = cards.get(key)
    cards.set(key, { name: existing?.name ?? name, count: (existing?.count ?? 0) + count })
  }

  return [...cards.values()]
}

// lookup from normalized name to the real name in prices.json, for full names and front faces
export function buildNameIndex(prices) {
  const index = new Map()
  for (const realName of Object.keys(prices)) {
    index.set(normalizeName(realName), realName)
  }
  // front faces second, so they never override a card whose full name matches
  for (const realName of Object.keys(prices)) {
    if (realName.includes(' // ')) {
      const front = normalizeName(realName.split(' // ')[0])
      if (!index.has(front)) {
        index.set(front, realName)
      }
    }
  }
  return index
}

export function checkDeck(deck, prices, nameIndex) {
  const tooExpensive = []
  const notLegal = []
  const noPrice = []

  for (const card of deck) {
    const realName = nameIndex.get(normalizeName(card.name))
    if (realName === undefined) {
      notLegal.push(card)
    } else if (prices[realName] === null) {
      noPrice.push({ ...card, name: realName })
    } else if (prices[realName] > PRICE_LIMIT) {
      tooExpensive.push({ ...card, name: realName, price: prices[realName] })
    }
  }

  tooExpensive.sort((a, b) => b.price - a.price)
  return { tooExpensive, notLegal, noPrice }
}

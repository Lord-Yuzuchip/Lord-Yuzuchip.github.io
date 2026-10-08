// Renders text like "{2}{U}{U}" or "{T}: Add {G}." with Scryfall's symbol images in place of the {..} codes
function ManaText({ text }) {
  if (!text) return null

  return text.split(/(\{[^}]+\})/).map((part, i) => {
    const match = part.match(/^\{([^}]+)\}$/)
    if (!match) return part

    // {W/U} -> WU.svg, {2/W} -> 2W.svg, {G/P} -> GP.svg
    const file = match[1].replace(/\//g, '').toUpperCase()
    return (
      <img
        key={i}
        src={`https://svgs.scryfall.io/card-symbols/${file}.svg`}
        alt={part}
        title={part}
        className="inline-block h-[1.1em] w-[1.1em] align-[-0.15em] mx-px"
      />
    )
  })
}

export default ManaText

// All legal sets, oldest first (same order as mtg-backend/data/legal_sets.txt).
// Add new sets to the end. The newest one is also the newest set searches include.
export const SET_CODES = [
  '8ed', 'mrd', 'dst', '5dn', 'chk', 'bok', 'sok', '9ed', 'rav', 'gpt', 'dis', 'csp', 'tsp', 'plc', 'fut',
  '10e', 'lrw', 'mor', 'shm', 'eve', 'ala', 'con', 'arb', 'm10', 'zen', 'wwk', 'roe', 'm11', 'som', 'mbs',
  'nph', 'm12', 'isd', 'dka', 'avr', 'm13', 'rtr', 'gtc', 'dgm', 'm14', 'ths', 'bng', 'jou', 'm15', 'ktk',
  'frf', 'dtk', 'ori', 'bfz', 'ogw', 'soi', 'emn', 'kld', 'aer', 'akh', 'hou', 'xln', 'rix', 'dom', 'm19',
  'grn', 'rna', 'war', 'm20', 'eld', 'thb', 'iko', 'm21', 'znr', 'khm', 'stx', 'afr', 'mid', 'vow', 'neo',
  'snc', 'dmu', 'bro', 'one', 'mom', 'mat', 'woe', 'lci', 'mkm', 'big', 'otj', 'blb', 'dsk', 'fdn', 'dft',
  'tdm', 'eoe', 'ecl', 'sos', 'fra',
]

export const NEWEST_SET = SET_CODES[SET_CODES.length - 1]

// Legality uses the price files of the newest sets: public/<set>_prices.json.
// Sets without a price file are skipped, so a new set's file can be added whenever it's ready.
export const PRICE_FILE_COUNT = 4
export const PRICE_FILE_SETS = SET_CODES.slice(-PRICE_FILE_COUNT)

// Cards that belong together (cycles). Their legality uses the group's average price in each set instead of
// each card's own price, so the whole cycle is legal or not legal together. Names must match Scryfall exactly.
export const CARD_GROUPS = [
  {
    name: 'Ravnica Bounce Lands',
    cards: [
      'Azorius Chancery', 'Dimir Aqueduct', 'Rakdos Carnarium', 'Gruul Turf', 'Selesnya Sanctuary',
      'Orzhov Basilica', 'Golgari Rot Farm', 'Simic Growth Chamber', 'Izzet Boilerworks', 'Boros Garrison',
    ],
  },
  {
    name: 'Kaldheim Snow Lands',
    cards: [
      'Snowfield Sinkhole', 'Arctic Treeline', 'Alpine Meadow', 'Sulfurous Mire', 'Highland Forest',
      'Glacial Floodplain', 'Ice Tunnel', 'Rimewood Falls', 'Woodland Chasm', 'Volatile Fjord',
    ],
  },
  {
    name: 'Coldsnap Snow Lands',
    cards: [
      'Arctic Flats', 'Boreal Shelf', 'Frost Marsh', 'Highland Weald', 'Tresserhorn Sinks',
    ],
  },
  {
    name: 'Shock Lands',
    cards: [
      'Hallowed Fountain', 'Watery Grave', 'Blood Crypt', 'Stomping Ground', 'Temple Garden',
      'Godless Shrine', 'Overgrown Tomb', 'Breeding Pool', 'Steam Vents', 'Sacred Foundry',
    ],
  },
  {
    name: 'Slow Lands',
    cards: [
      'Deserted Beach', 'Shipwreck Marsh', 'Haunted Ridge', 'Rockfall Vale', 'Overgrown Farmland',
      'Shattered Sanctum', 'Deathcap Glade', 'Dreamroot Cascade', 'Stormcarved Coast', 'Sundown Pass',
    ],
  },
  {
    name: 'Scry Lands',
    cards: [
      'Temple of Enlightenment', 'Temple of Deceit', 'Temple of Malice', 'Temple of Abandon', 'Temple of Plenty',
      'Temple of Silence', 'Temple of Malady', 'Temple of Mystery', 'Temple of Epiphany', 'Temple of Triumph',
    ],
  },
  {
    name: 'Surveil Lands',
    cards: [
      'Meticulous Archive', 'Undercity Sewers', 'Raucous Theater', 'Commercial District', 'Lush Portico',
      'Shadowy Backstreet', 'Underground Mortuary', 'Hedge Maze', 'Thundering Falls', 'Elegant Parlor',
    ],
  },
  {
    name: 'Verge Lands',
    cards: [
      'Floodfarm Verge', 'Gloomlake Verge', 'Blazemire Verge', 'Thornspire Verge', 'Hushwood Verge',
      'Bleachbone Verge', 'Wastewood Verge', 'Willowrush Verge', 'Riverpyre Verge', 'Sunbillow Verge',
    ],
  },
  {
    name: 'Gain Lands',
    cards: [
      'Tranquil Cove', 'Dismal Backwater', 'Bloodfell Caves', 'Rugged Highlands', 'Blossoming Sands',
      'Scoured Barrens', 'Jungle Hollow', 'Thornwood Falls', 'Swiftwater Cliffs', 'Wind-Scarred Crag',
    ],
  },
  {
    name: 'Fast Lands',
    cards: [
      'Seachrome Coast', 'Darkslick Shores', 'Blackcleave Cliffs', 'Copperline Gorge', 'Razorverge Thicket',
      'Concealed Courtyard', 'Blooming Marsh', 'Botanical Sanctum', 'Spirebluff Canal', 'Inspiring Vantage',
    ],
  },
  {
    name: 'Guildgates',
    cards: [
      'Azorius Guildgate', 'Dimir Guildgate', 'Rakdos Guildgate', 'Gruul Guildgate', 'Selesnya Guildgate',
      'Orzhov Guildgate', 'Golgari Guildgate', 'Simic Guildgate', 'Izzet Guildgate', 'Boros Guildgate',
    ],
  },
  {
    name: 'Desert Pingers',
    cards: [
      'Lonely Arroyo', 'Soured Springs', 'Jagged Barrens', 'Bristling Backwoods', 'Creosote Heath',
      'Forlorn Flats', 'Festering Gulch', 'Lush Oasis', 'Eroded Canyon', 'Abraded Bluffs',
    ],
  },
  {
    name: 'Restless Man-Lands',
    cards: [
      'Restless Anchorage', 'Restless Reef', 'Restless Vents', 'Restless Ridgeline', 'Restless Prairie',
      'Restless Fortress', 'Restless Cottage', 'Restless Vinestalk', 'Restless Spire', 'Restless Bivouac',
    ],
  },
  {
    name: 'Low Life Lands',
    cards: [
      'Abandoned Campground', 'Murky Sewer', 'Razortrap Gorge', 'Bleeding Woods', 'Etched Cornfield',
      'Neglected Manor', 'Strangled Cemetery', 'Lakeside Shack', 'Peculiar Lighthouse', 'Raucous Carnival',
    ],
  },
  {
    name: 'SOS Surveil Lands',
    cards: [
      'Forum of Amity', 'Titan\'s Grave', 'Paradox Gardens', 'Spectacle Summit', 'Fields of Strife',
    ],
  },
  {
    name: 'Planeswalker Lands',
    cards: [
      'Fatehold Annex', 'Theorix Annex', 'Stingerquill Annex', 'Konstrari Annex', 'Vigorbloom Annex',
      'Meticulous Commons', 'Formidable Commons', 'Transformative Commons', 'Innovative Commons', 'Dedicated Commons',
    ],
  },
  {
    name: 'Tango Lands',
    cards: [
      'Prairie Stream', 'Sunken Hollow', 'Smoldering Marsh', 'Cinder Glade', 'Canopy Vista',
      'Eclipsed Steppe', 'Vernal Fen', 'Sodden Verdure', 'Scorched Geyser', 'Radiant Summit',
    ],
  },
  {
    name: 'Check Lands',
    cards: [
      'Glacial Fortress', 'Drowned Catacomb', 'Dragonskull Summit', 'Rootbound Crag', 'Sunpetal Grove',
      'Isolated Chapel', 'Woodland Cemetery', 'Hinterland Harbor', 'Sulfur Falls', 'Clifftop Retreat',
    ],
  },
  {
    name: 'Pain Lands',
    cards: [
      'Adarkar Wastes', 'Underground River', 'Sulfurous Springs', 'Karplusan Forest', 'Brushland',
      'Caves of Koilos', 'Llanowar Wastes', 'Yavimaya Coast', 'Shivan Reef', 'Battlefield Forge',
    ],
  },
  {
    name: 'Reveal Lands',
    cards: [
      'Port Town', 'Choked Estuary', 'Foreboding Ruins', 'Game Trail', 'Fortified Village',
      'Shineshadow Snarl', 'Necroblossom Snarl', 'Vineglimmer Snarl', 'Frostboil Snarl', 'Furycalm Snarl',
    ],
  },
  {
    name: 'Bi-Cycle Lands',
    cards: [
      'Irrigated Farmland', 'Fetid Pools', 'Canyon Slough', 'Sheltered Thicket', 'Scattered Groves',
      'Umbral Expanse', 'Festering Thicket', 'Rain-Slicked Copse', 'Coastal Peak', 'Glittering Massif',
    ],
  },
  {
    name: 'Pathways',
    cards: [
      'Hengegate Pathway // Mistgate Pathway', 'Clearwater Pathway // Murkwater Pathway', 'Blightstep Pathway // Searstep Pathway', 'Cragcrown Pathway // Timbercrown Pathway', 'Branchloft Pathway // Boulderloft Pathway',
      'Brightclimb Pathway // Grimclimb Pathway', 'Darkbore Pathway // Slitherbore Pathway', 'Barkchannel Pathway // Tidechannel Pathway', 'Riverglide Pathway // Lavaglide Pathway', 'Needleverge Pathway // Pillarverge Pathway',
    ],
  },
  {
    name: 'Common Dual Lands',
    cards: [
      'Idyllic Beachfront', 'Contaminated Aquifer', 'Geothermal Bog', 'Wooded Ridgeline', 'Radiant Grove',
      'Sunlit Marsh', 'Haunted Mire', 'Tangled Islet', 'Molten Tributary', 'Sacred Peaks',
    ],
  },
  {
    name: 'Creature Lands',
    cards: [
      'Celestial Colonnade', 'Creeping Tar Pit', 'Lavaclaw Reaches', 'Raging Ravine', 'Stirring Wildwood',
      'Shambling Vent', 'Hissing Quagmire', 'Lumbering Falls', 'Wandering Fumarole', 'Needle Spires',
    ],
  },
  {
    name: 'Strixhaven Campuses',
    cards: [
      'Silverquill Campus', 'Witherbloom Campus', 'Quandrix Campus', 'Prismari Campus', 'Lorehold Campus',
    ],
  },
  {
    name: 'Generic Tapped Lands',
    cards: [
      'Meandering River', 'Submerged Boneyard', 'Cinder Barrens', 'Timber Gorge', 'Tranquil Expanse',
      'Forsaken Sanctuary', 'Foul Orchard', 'Woodland Stream', 'Highland Lake', 'Stone Quarry',
    ],
  },
  {
    name: 'Fetch Lands',
    cards: [
      'Flooded Strand', 'Polluted Delta', 'Bloodstained Mire', 'Wooded Foothills', 'Windswept Heath',
      'Marsh Flats', 'Verdant Catacombs', 'Misty Rainforest', 'Scalding Tarn', 'Arid Mesa',
    ],
  },
  {
    name: 'Filter Lands',
    cards: [
      'Mystic Gate', 'Sunken Ruins', 'Graven Cairns', 'Fire-Lit Thicket', 'Wooded Bastion',
      'Fetid Heath', 'Twilight Mire', 'Flooded Grove', 'Cascade Bluffs', 'Rugged Prairie',
    ],
  },
  {
    name: 'Future Shifted Lands',
    cards: [
      'Nimbus Maze', 'River of Tears', 'Graven Cairns', 'Grove of the Burnwillows', 'Horizon Canopy',
    ],
  },
  {
    name: 'Refuges',
    cards: [
      'Sejiri Refuge', 'Jwar Isle Refuge', 'Akoum Refuge', 'Kazandu Refuge', 'Graypelt Refuge',
    ],
  },
  {
    name: 'Storage Lands',
    cards: [
      'Calciform Pools', 'Dreadship Reef', 'Molten Slagheap', 'Fungal Reaches', 'Saltcrusted Steppe',
    ],
  },
  {
    name: 'Invasion Lands',
    cards: [
      'Coastal Tower', 'Salt Marsh', 'Urborg Volcano', 'Shivan Oasis', 'Elfhame Palace',
    ],
  },
  {
    name: 'Kamigawa Lands',
    cards: [
      'Cloudcrest Lake', 'Waterveil Cavern', 'Lantern-Lit Graveyard', 'Pinecrest Ridge', 'Tranquil Garden',
    ],
  },
  {
    name: 'Tri Lands',
    cards: [
      'Seaside Citadel', 'Arcane Sanctum', 'Crumbling Necropolis', 'Savage Lands', 'Jungle Shrine',
      'Nomad Outpost', 'Frontier Bivouac', 'Sandsteppe Citadel', 'Mystic Monastery', 'Opulent Palace',
    ],
  },
  {
    name: 'Triomes',
    cards: [
      'Spara\'s Headquarters', 'Raffine\'s Tower', 'Xander\'s Lounge', 'Ziatora\'s Proving Ground', 'Jetmir\'s Garden',
      'Savai Triome', 'Ketria Triome', 'Indatha Triome', 'Raugrin Triome', 'Zagoth Triome',
    ],
  },
  {
    name: 'Sac Fetch Lands',
    cards: [
      'Brokers Hideout', 'Obscura Storefront', 'Maestros Theater', 'Riveteers Overlook', 'Cabaretti Courtyard',
    ],
  },
  {
    name: 'Panoramas',
    cards: [
      'Bant Panorama', 'Esper Panorama', 'Grixis Panorama', 'Jund Panorama', 'Naya Panorama',
    ],
  },
  {
    name: 'New Capenna Dual Lands',
    cards: [
      'Skybridge Towers', 'Waterfront District', 'Tramway Station', 'Racers\' Ring', 'Botanical Plaza',
    ],
  },
  {
    name: 'Lorwyn Tribal Lands',
    cards: [
      'Wanderwine Hub', 'Secluded Glen', 'Auntie\'s Hovel', 'Gilt-Leaf Palace', 'Ancient Amphitheater',
    ],
  },
]

const MSRP = 5.49
const BOOSTER_SIZE = 14
export const PRICE_LIMIT = MSRP / BOOSTER_SIZE
// a card that was legal stays legal until a later set's price goes above this
export const BAN_LIMIT = PRICE_LIMIT * 2

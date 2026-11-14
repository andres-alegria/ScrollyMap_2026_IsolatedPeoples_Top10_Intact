const { VITE_MAPBOX_ACCESS_TOKEN } = import.meta.env;

export default {
  style: 'mapbox://styles/mongabay/cmtalpr3p00j901shfgl9bjk0',
  
  accessToken: VITE_MAPBOX_ACCESS_TOKEN,

  showMarkers: false,
  theme: 'mongabay',
  intro: {
    // PLACEHOLDER title — mine, not the desk's. The docx heading, "Top 10
    // lands used by voluntarily isolated peoples with the least threatened
    // primary forests", is a deck rather than a display line.
    title: 'Where the Forest Holds',
    subtitle:
      "Tracking primary forest across isolated tribal lands worldwide. These are the 10 lands whose forests are least touched.",
    date: 'Nov. 0, 2026',
    // The intro collage, assembled from individual elements over the paper
    // ground. Positions are percentages of the viewport and are the knob for
    // arranging this — nothing in the components hard-codes a layout.
    //
    // Seeded from the bands measured in the old flat artwork: pieces occupy a
    // left column (0-27%) and a right column (73-100%), leaving the middle
    // clear for the title. Exact placement wants your eye — the exported files
    // were all normalised to the same width, so they don't record where they
    // sat in the original.
    //
    //   left/top  where the piece rests, as % of the viewport
    //   width     as % of viewport width; height follows the file's aspect
    //   onMobile  include in the top strip on narrow screens
    art: [
      { src: '/intro-art/people-water.webp', left: '0%', top: '10%', width: '24.3%', onMobile: true },
      { src: '/intro-art/house.webp', left: '0%', top: '34%', width: '24.3%', onMobile: true },
      // Flush to the left edge (the file has no transparent gutter), and lifted
      // clear of the social icons, which start at 90.8% of the viewport. That
      // lift means it no longer centres exactly on the "scroll down to
      // discover" cue at 78.7% — it now sits a little above it. Sized by
      // height so its vertical placement holds as the window reshapes.
      // Listed after `house` so it stacks above the piece immediately overhead.
      { src: '/intro-art/earth-left.webp', left: '0%', top: '60.5%', height: '28.2%' },
      { src: '/intro-art/closeupface.webp', left: '74.4%', top: '5%', width: '12.6%', onMobile: true },
      { src: '/intro-art/man.webp', left: '88.3%', top: '5%', width: '11.7%' },
      // Directly below `man`, which ends at 13.8%. Anchored right so it stays
      // flush to the edge at any viewport shape.
      { src: '/intro-art/earth-right.webp', right: '0%', top: '16%', height: '28.2%' },
      { src: '/intro-art/topview-peopleforests.webp', left: '79.3%', top: '46%', width: '20.7%' },
      { src: '/intro-art/people-topview.webp', left: '75.7%', top: '70%', width: '24.3%' },
    ],

    social: [
      {
        name: 'X',
        src: 'x.svg',
        href: 'https://x.com/mongabay',
      },
      {
        name: 'LinkedIn',
        src: 'linkedin.svg',
        href: 'https://www.linkedin.com/company/mongabay/posts/',
      },
    ],
  },
  logos: [
    {
      name: 'mongabay',
      src: 'mongabay-logo.svg',
      width: '150',
      href: 'https://news.mongabay.com',
    },
  ],



  // Globe atmosphere. space-color is matched to the paper texture in
  // src/assets/background-image.jpg so the sphere reads as sitting on the
  // page rather than floating in Mapbox's default starfield.
  // The globe leaves and comes back. It goes out across chapter four's bottom
  // edge, so the hand-off line in chapter five has the screen to itself, then
  // returns for chapter six — bigger and centred — to show the ranked ten on
  // their own. Shown that way it is a beat the reader stops at, rather than
  // something that dissolves under a headline just as it arrives.
  globeWindows: [
    { reveal: { trigger: 'chapter 01', start: 'top bottom', end: 'top 75%' },
      // Out a little earlier than the default would take it. The finale frame
      // is switched on a screen before chapter 06, and the globe has to be
      // gone by then: the frame resize is a jump in the sphere's size, and the
      // reader should not be looking at the globe when it happens.
      fadeOut: { trigger: 'chapter 04', start: 'bottom center', end: 'bottom 25%' } },
    // Rises behind the hand-off line rather than after it: by the time that
    // line's card starts leaving, the globe is already there, and the card
    // slides off over a finished picture instead of a fading one.
    //
    // Both ends are measured from chapter 06's own top so they cannot collide.
    // They used to be read from opposite edges — the reveal from the top, the
    // fade-out from the bottom — and the fade began fifteen pixels before the
    // reveal finished, which capped the globe at four fifths: it never once
    // reached full strength.
    { reveal: { trigger: 'chapter 06', start: 'top 90%', end: 'top 55%' },
      fadeOut: { trigger: 'chapter 06', start: 'top top-=600', end: 'top top-=900' } },
  ],

  // Which chapter gets the larger centred frame (see .map-container--finale).
  // Switched on in the gap between the first globe's fade-out and the second's
  // rise, with margin either side: the frame resize is a jump in the sphere's
  // size, so it has to happen while nothing is on screen to see it.
  globeFinale: { trigger: 'chapter 06', start: 'top 95%' },

  globeAtmosphere: {
    // mapbox-gl creates its WebGL context with alpha:true, so a transparent
    // space-color lets the page's paper texture show through around the globe
    // instead of a flat colour. If this renders black on some browser, fall
    // back to the paper tone: '#f7f4ee'.
    'space-color': 'rgba(0, 0, 0, 0)',
    'star-intensity': 0,                      // no stars
    'horizon-blend': 0.02,                    // adjust: softness at the limb
    'color': 'rgba(247, 244, 238, 0)',
    'high-color': 'rgba(223, 230, 238, 0.35)', // adjust: faint limb glow
  },


  // The legend beneath each panel.
  panelLabels: {
    // One entry per beat, because the two beats do not show the same thing.
    // The first is loss across the whole frame, inside the line and outside
    // it; the second is what the line holds. Naming them separately is what
    // stops a reader taking the pale ground of the second beat for cleared
    // land rather than for ground the panel is simply no longer lit on.
    beats: [
      { label: 'Tree cover lost since 2015',
        color: '#e86d6d', textColor: '#181818' },          /* adjust loss box + text */
      // Pine Green — the colour the panels paint forest with
      { label: 'Primary forest inside the boundary',
        color: '#0a2f29', textColor: '#ffffff' },          /* adjust interior box + text */
    ],
    // the label that has not been reached yet, as plain text with no box
    idleColor: '#6b7672',                                  /* adjust idle label colour */
    note: 'Note: Not all tree cover loss is detected. Fire, for example, can burn trees while the satellite image can sometimes read it as forest extent.',
  },

  alignment: 'left',
  // The footer is now just the dark strip the logo sits on; the credits that
  // used to live here are in the section above it.
  footer: '',

  credits: {
    backToStart: 'Back to the start',
    people: [
      { role: 'Produced by', name: 'Latoya Abulu' },
      { role: 'Creative Director', name: 'Samantha Lee' },
      { role: 'Banner art', name: 'Emilie Languedoc' },
      { role: 'Data collection', name: 'Latoya Abulu & Aimee Gabay' },
      { role: 'Design and development', name: 'Andrés Alegría' },
    ],
    sourcesTitle: 'Sources',
    sources:
      'Territory boundaries were compiled and verified with information provided by '
      + 'AIDESEP, AMAN, CEJIS, CONAIE, FUNAI, GTI-PIACI, Iniciativa Amotocodie, ISA, OPI, '
      + 'OPIAC, ORPIO, Pueblos Vivos and Dr. Manish Chandi. '
      + 'Forest cover and loss are from the Global Forest Change dataset v1.13 '
      + '(Hansen et al., University of Maryland), covering 2000 to 2025 and accessed through '
      + 'Google Earth Engine and Global Nature Watch. '
      + 'Ortiz-Prado, E., Cevallos-Sierra, G., Vasconez, E., Lister, A., & Pichilingue Ramos, E. '
      + '(2021). Avoiding extinction: the importance of protecting isolated Indigenous tribes. '
      + 'AlterNative: An International Journal of Indigenous Peoples, 17(1), 130-135. '
      + 'doi:10.1177/1177180121995567',
  },

  chapters: [

    // chapter 01 — set scene
    {
      id: 'chapter 01',
      // Opens where the copy opens: New Guinea. No dots yet — this chapter is
      // one forest, not the dataset. The island carries no ranked land (the
      // assessment could not include it), so there is no focus mark either.
      //
      // Zooms describe a proportion of the globe's frame, not a pixel size:
      // useGlobeSequence adds log2(frameWidth / 440) before applying them, so
      // the sphere fills the same fraction of the frame at every width.
      globe: {
        center: [138.0, -4.2], zoom: 1.08,
        start: 'top bottom', end: 'top 70%',
        legend: 'The forests of New Guinea',
        layers: { centroids: 0, 'centroids-label': 0, 'centroids top 10': 0,
                  'ranked-ten': 0, 'chapter-focus': 0 },
      },
      alignment: 'fully',
      card: true,
      hidden: false,
      title: ' ',
      description: "<p>Towers of Western New Guinea kauri (<i>Agathis labillardieri</i>) burst beyond the forest ceiling, their buttresses wide and old among the other endemic tree species crowding primary forests in Indonesian Papua.</p><p>Uncontacted tribes protect these forests through traditional ways of living in harmony with nature, said Dorince Mehue, a campaigner of the Papua region for the Indigenous Peoples’ Alliance of the Archipelago (AMAN). She estimates there are two to 10 tribes in West Papua’s forests, located in the Indonesian half of the island of New Guinea, who live in voluntary isolation.</p><p>“For them, the forest is their home, their food source, and a sacred space that must be protected for their survival,” Mehue told Mongabay.</p>",
      // No `location` here on purpose. The camera for these chapters belongs
      // to `globe` above, and only to that — see the note kept in the loss
      // piece about the two cameras taking turns.
      mapAnimation: 'easeTo',
      onChapterEnter: [],
      onChapterExit: [],
    },

    // chapter 02 — the dataset arrives
    {
      id: 'chapter 02',
      // One continuous eastward turn out of New Guinea, across the Pacific, to
      // the Amazon: the two forest blocks this paragraph names, in the order
      // it names them, so the reader sees the spread rather than being told.
      globe: {
        center: [-62.0, -6.0], zoom: 1.08, spin: 'east',
        start: 'top bottom-=10%', end: 'top 25%',
        legend: 'Indigenous and protected lands worldwide',
        layers: { centroids: 0.9, 'centroids-label': 0, 'centroids top 10': 0,
                  'ranked-ten': 0, 'chapter-focus': 0 },
      },
      alignment: 'fully',
      card: true,
      hidden: false,
      title: ' ',
      description: "<p>Around the world, there are an estimated <b>200 groups</b> of people living in voluntary isolation (also known as uncontacted people) and initial contact, like those in West Papua. Many of them inhabit large, intact tropical forest landscapes, similar to ones in New Guinea and the Amazon, where primary forests are also concentrated. The expanding pressures on these forests through logging, mining, roads and agriculture threatens the survival of these communities, researchers say.</p><p>“The [uncontacted tribes’] belief that damaging nature will bring curses or disasters to the community serves as a natural protection that is strictly adhered to,” Mehue explained. In New Guinea, they implement customary prohibitions, like Sasi “on harvesting certain natural resources for a set period of time to allow the ecosystem to recover … For them, the forest is not simply a resource to be exploited, but a sacred space and a ‘mother’ that provides all their needs.”</p>",
      mapAnimation: 'flyTo',
      rotateAnimation: false,
      onChapterEnter: [],
      onChapterExit: [],
    },

    // chapter 03 — method
    {
      id: 'chapter 03',
      globe: {
        center: [-60.0, -10.0], zoom: 1.08,
        start: 'top bottom-=10%', end: 'top 25%',
        legend: 'Indigenous and protected lands in South America',
        layers: { centroids: 0.9, 'centroids-label': 0, 'centroids top 10': 0,
                  'ranked-ten': 0, 'chapter-focus': 0 },
      },
      alignment: 'fully',
      card: true,
      hidden: false,
      title: ' ',
      description: "<p>Mongabay mapped the Indigenous territories, tribal reserves and protected areas around the world with the confirmed presence of peoples living in voluntary isolation and analyzed primary forest cover in the decade from 2015 to 2025. This assessment, using public data, exists to give a general sense of the state of forests in the protected lands uncontacted peoples depend on.</p><p>Based on these figures, we ranked the <b>10 lands in tropical humid forests with the lowest detected primary forest loss</b> between 2015 and 2025.</p><p>Using data provided by national organizations, the international working group on Indigenous Peoples in Isolation and Initial Contact (GTI PIACI) and Indigenous experts on the confirmed presence of uncontacted people, Mongabay overlapped it with Indigenous and protected lands and assembled a list of <b>65 defined lands</b> where they live. These exist across nine countries — Bolivia, Brazil, Colombia, Ecuador, India, Indonesia, Paraguay, Peru and Venezuela.</p><p>Among these, 56 lands are located in tropical moist broadleaf forests. This assessment does not showcase the exact or unique location of isolated peoples but rather the boundaries of Indigenous and protected lands their presence overlaps with.</p>",
      mapAnimation: 'flyTo',
      rotateAnimation: false,
      onChapterEnter: [],
      onChapterExit: [],
    },

    // chapter 04 — the whole dataset, in numbers
    {
      id: 'chapter 04',
      globe: {
        center: [-68.0, -5.0], zoom: 1.08,
        start: 'top bottom-=10%', end: 'top 25%',
        legend: 'Indigenous and protected lands in South America',
        layers: { centroids: 0.9, 'centroids-label': 0, 'centroids top 10': 0,
                  'ranked-ten': 0, 'chapter-focus': 0 },
      },
      alignment: 'fully',
      card: true,
      hidden: false,
      title: ' ',
      description: "<p>At the turn of the millennia, all 65 lands had a tree cover of more than <b>72.38 million hectares</b> (178.85 million acres) — almost the size of Chile. Satellite data in 2001 shows 59.35 million hectares (146.7 million acres) of this was primary forest.</p><p>Between 2015 and 2025, these lands lost a total of nearly 2 million hectares (4.94 million acres). Of this, nearly 568,150 hectares (1.4 million acres) was primary forest loss — roughly the size of Montenegro.</p><p>According to the Food and Agriculture Organization (FAO), primary forests covered at least 1.18 billion hectares (2.92 billion acres) of the Earth in 2025.</p>",
      mapAnimation: 'flyTo',
      rotateAnimation: false,
      onChapterEnter: [],
      onChapterExit: [],
    },

    // chapter 05 — the two ends of the list against each other
    {
      id: 'chapter 05',
      globe: {
        center: [-72.0, -7.0], zoom: 1.08,
        start: 'top bottom-=10%', end: 'top 25%',
        legend: 'Indigenous and protected lands in South America',
        layers: { centroids: 0.9, 'centroids-label': 0, 'centroids top 10': 0,
                  'ranked-ten': 0, 'chapter-focus': 0 },
      },
      alignment: 'fully',
      card: true,
      hidden: false,
      title: ' ',
      // NOTE FOR THE DESK: the 137.7-hectare total below is the figure in the
      // supplied copy, carried here as written. It does not reconcile with the
      // workbook: column I of the "Article 2" tab sums to about 1,562 hectares
      // across the ten, and about 1,231 across the eight built so far — Alto
      // Purús alone is 681. The "less than half of Central Park" comparison
      // stands or falls with it. Flagged, not silently corrected.
      description: "<p>The top 10 lands in tropical humid forests with the most intact primary forests between 2015 and 2025 had an average rate of primary forest loss of just <b>0.03%</b>, compared to an average rate of 3.6% in the top 10 lands with the most primary forest loss — approximately 120 times larger.</p><p>These 10 lands lost a total of approximately 137.7 hectares (340.3 acres) of primary forest in the 10-year period — less than half the size of New York City’s Central Park.</p><p>Management strategy isn’t necessarily the reason why some lands have higher primary forest loss than others, explained researchers. It also has to do with which lands face more threats.</p><p>Some of these primary forests are intact because of remote geography and strict government restrictions, such as the North Sentinel Island in India. While others, so far, remain far from extractive pressures and have Indigenous guardians patrolling the lands.</p>",
      mapAnimation: 'flyTo',
      rotateAnimation: false,
      onChapterEnter: [],
      onChapterExit: [],
    },

    // chapter 06 — the line into the countdown
    {
      id: 'chapter 06',
      alignment: 'fully',
      card: true,
      displayText: true,
      hidden: false,
      title: ' ',
      description: "<p>Below are the <b>10 lands in tropical humid forests</b> with the lowest detected primary forest loss — the least threatened primary forests — between 2015 and 2025. This ranking, with rates of detection accuracy, is approximate.</p>",
      onChapterEnter: [],
      onChapterExit: [],
    },

    // chapter 07 — the globe held still, so the ranked set can be read
    {
      id: 'chapter 07',
      // No copy: one screen whose only job is to hold the globe still long
      // enough to be read. The camera has already moved here while hidden.
      //
      // Centred on the western Amazon, where seven of the eight sit. North
      // Sentinel is most of a hemisphere away and is not in this view — the
      // countdown arrives at it as the climax, which is the better place for
      // the reader to meet it.
      globe: {
        center: [-72.0, -6.0], zoom: 1.18,
        start: 'top bottom', end: 'top 80%',
        legend: 'The 10 lands with the most intact primary forests',
        layers: { centroids: 0, 'centroids-label': 0, 'centroids top 10': 0,
                  'ranked-ten': 0.9, 'chapter-focus': 0 },
      },
      alignment: 'fully',
      globeOnly: true,
      hidden: false,
      onChapterEnter: [],
      onChapterExit: [],
    },

  ],
};

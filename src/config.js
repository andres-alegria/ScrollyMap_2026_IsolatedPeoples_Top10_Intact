// No Mapbox style and no access token: the introduction's map is drawn from
// geometry now (see src/components/standing-map), and nothing else in the
// piece ever used the live map. The ranked sections were always images, and
// the small locator on each panel is its own SVG.
export default {
  theme: 'mongabay',
  intro: {
    // PLACEHOLDER title — mine, not the desk's. The docx heading, "Top 10
    // lands used by voluntarily isolated peoples with the least threatened
    // primary forests", is a deck rather than a display line.
    title: 'Where the Forest Holds',
    subtitle:
      "These are the 10 lands with the lowest primary forest loss",
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
      { src: '/intro-art/yasuni-canopy.webp', left: '0%', top: '10%', width: '24.3%', onMobile: true },
      // Tucked under the forest piece's bottom edge, so the two read as one
      // column rather than as two things sharing a margin.
      { src: '/intro-art/earth-left.webp', left: '0%', top: '38%', height: '28.2%' },
      // Flush to the right edge, and the tallest thing on that side. Listed
      // before the globe so the globe cannot be covered by it; they do not
      // overlap, but the order is what guarantees that.
      { src: '/intro-art/machiguenga-girl.webp', right: '0%', top: '5%', width: '12.6%', onMobile: true },
      { src: '/intro-art/earth-right.webp', left: '76.5%', top: '16%', height: '28.2%' },
      { src: '/intro-art/javari-river.webp', left: '79.3%', top: '46%', width: '20.7%' },
      { src: '/intro-art/canoe-group.webp', left: '75.7%', top: '68%', width: '24.3%', onMobile: true },
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


  // THE THREE MAPS.
  //
  // All three are declared on the chapter they belong to, as `map: { ... }`,
  // and rendered by chapter.jsx directly under that chapter's copy. The first
  // two are plain figures: they hold still and scroll away with the paragraph
  // that introduced them. New Guinea on chapter 01, the world on 02.
  //
  // The last carries `sticky: true`, which is now only a flag for "this is the
  // one that moves". It arrives the same way as the others and keeps going;
  // what it does differently is zoom and fade on its way off the top.
  //
  // A South America close-up sat on chapter 03 and has been taken out. The
  // `south-america` region is still built, so putting it back is a `map`
  // block on that chapter and nothing else.

  // How the fourth map leaves, once it has locked. It has no trigger of its
  // own any more: the move starts at the lock and ends as the runway runs out,
  // both of which the component reads from the layout.
  mapHandover: {
    // Where the camera ends up, by name. The points are declared as lon/lat in
    // build_world_robinson.py and projected there, so this can be read against
    // an atlas: `mediterranean` is 15E 38N. Aiming between the South American
    // and the Asian lands put it on the equator in the Gulf of Guinea instead.
    focus: 'mediterranean',            // adjust the closing camera target
    scale: 4,                          // adjust how far it pushes in
  },

  // The legend beneath each panel.
  panelLabels: {
    // One entry per beat, because the two beats do not show the same thing.
    // The first is loss across the whole frame, inside the line and outside
    // it; the second is what the line holds. Naming them separately is what
    // stops a reader taking the pale ground of the second beat for cleared
    // land rather than for ground the panel is simply no longer lit on.
    beats: [
      { label: 'Tree cover lost since 2015 up to 2025',
        color: '#e86d6d', textColor: '#181818' },          /* adjust loss box + text */
      // Pine Green — the colour the panels paint forest with
      { label: 'Forest inside the area',
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
      // Opens where the copy opens: New Guinea. No dots — this chapter is one
      // forest, not the dataset, and the island carries no mapped land at all.
      map: {
        inline: true,
        heading: 'The forests of New Guinea',
        // No dot: the 101 mapped lands run from 77W to Halmahera at 128E and
        // not one of them is on New Guinea. What the opening describes is the
        // forest, so the map frames the island and leaves it at that.
        region: 'new-guinea',
      },
      alignment: 'fully',
      card: true,
      hidden: false,
      title: ' ',
      description: "<p>Towers of Western New Guinea kauri (Agathis labillardieri) burst beyond the forest ceiling, their buttresses wide and old among the other endemic tree species crowding primary forests in Indonesian Papua.</p><p>Uncontacted tribes protect these forests through traditional ways of living in harmony with nature, said Dorince Mehue, a campaigner of the Papua region for the Indigenous Peoples' Alliance of the Archipelago (AMAN). She estimates there are two to 10 tribes in West Papua’s forests, located in the Indonesian half of the island of New Guinea, who live in voluntary isolation.</p><p>“For them, the forest is their home, their food source, and a sacred space that must be protected for their survival,” Mehue told Mongabay.</p>",
      onChapterEnter: [],
      onChapterExit: [],
    },

    // chapter 02 — the dataset arrives
    {
      id: 'chapter 02',
      // One continuous eastward turn out of New Guinea, across the Pacific, to
      // the Amazon: the two forest blocks this paragraph names, in the order
      // it names them, so the reader sees the spread rather than being told.
      map: {
        inline: true,
        heading: 'Indigenous and protected lands worldwide',
        region: 'world',
      },
      alignment: 'fully',
      card: true,
      hidden: false,
      title: ' ',
      description: "<p>Around the world, there are an estimated <b>200 groups</b> of people living in voluntary isolation (also known as uncontacted people) and initial contact, like those in West Papua. Many of them inhabit intact tropical forest landscapes, similar to ones in New Guinea and the Amazon, where primary forests are also concentrated. The expanding pressures on these forests through logging, mining, roads and agriculture threatens the survival of these communities, researchers say.</p><p>“The [uncontacted tribes’] belief that damaging nature will bring curses or disasters to the community serves as a natural protection that is strictly adhered to,” Mehue explained. In New Guinea, they implement customary prohibitions, like Sasi “on harvesting certain natural resources for a set period of time to allow the ecosystem to recover … For them, the forest is not simply a resource to be exploited, but a sacred space and a ‘mother’ that provides all their needs.”</p>",
      rotateAnimation: false,
      onChapterEnter: [],
      onChapterExit: [],
    },

    // chapter 03 — method
    {
      id: 'chapter 03',
      alignment: 'fully',
      card: true,
      hidden: false,
      title: ' ',
      description: "<p>Mongabay mapped the Indigenous territories, tribal reserves and protected areas around the world with the confirmed presence of peoples living in voluntary isolation and analyzed primary forest cover in the decade from 2015 to 2025.</p><p>This assessment, using public data, exists to give a general sense of the state of forests in the protected lands uncontacted peoples depend on.</p><p>Based on these figures, we ranked the <b>10 lands in tropical humid forests with the lowest detected primary forest loss</b> between 2015 and 2025.</p><p>Using data provided by national organizations, the international working group on Indigenous Peoples in Isolation and Initial Contact (GTI PIACI) and Indigenous experts on the confirmed presence of uncontacted people, Mongabay overlapped it with Indigenous and protected lands (Indigenous territories, tribal reserves and protected areas) and assembled a list of <b>65 defined lands</b> where they live. These exist across nine countries — Bolivia, Brazil, Colombia, Ecuador, India, Indonesia, Paraguay, Peru and Venezuela. Mongabay then analyzed tree cover using Global Nature Watch.</p><p>Among these, 56 lands are located in tropical moist broadleaf forests.</p><p>This assessment does not showcase the exact or unique location of isolated peoples but rather the boundaries of Indigenous and protected lands their presence overlaps with.</p>",
      rotateAnimation: false,
      onChapterEnter: [],
      onChapterExit: [],
    },

    // chapter 04 — the whole dataset, in numbers
    {
      id: 'chapter 04',
      alignment: 'fully',
      card: true,
      hidden: false,
      title: ' ',
      description: "<p>Across all 65 lands, satellite data in 2001 shows <b>59.35 million hectares</b> (146.7 million acres) of this was primary forest.</p><p>Between 2015 and 2025, these lands lost a total of nearly 568,150 hectares (1.4 million acres) of primary forest — roughly the size of Montenegro.</p><p>According to the Food and Agriculture Organization (FAO), primary forests covered at least 1.18 billion hectares (2.92 billion acres) of the Earth in 2025.</p>",
      rotateAnimation: false,
      onChapterEnter: [],
      onChapterExit: [],
    },

    // chapter 05 — the two ends of the list against each other
    {
      id: 'chapter 05',
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
      description: "<p>In the humid tropics, the top 10 lands with the most intact primary forests in the last decade had an average rate of primary forest loss of just <b>0.03%</b>, compared to an average rate of 3.6% in the top 10 lands with the most primary forest loss — approximately 120 times larger.</p><p>These 10 lands with the highest tree cover lost all together just about 137.7 hectares (340.3 acres) of primary forest in the 10-year period — less than half the size of New York City’s Central Park.</p><p>Management strategy isn’t necessarily the reason why some lands have higher primary forest loss than others, explained researchers. It also has to do with which lands face more threats.</p><p>Some of these primary forests are intact because of remote geography and strict government restrictions, such as the North Sentinel Island in India. While others, so far, remain far from extractive pressures and have Indigenous guardians patrolling their lands.</p>",
      rotateAnimation: false,
      onChapterEnter: [],
      onChapterExit: [],
    },

    // chapter 07 — the map's own stretch of page
    {
      id: 'chapter 07',
      // A card, so the step is full width and at full opacity: the non-card
      // chapters carry `opacity-50`, which both dims whatever is inside them
      // and makes a stacking context of the step, trapping the map's z-index.
      // There is no copy; the map is the whole of this chapter.
      card: true,
      alignment: 'fully',
      hidden: false,
      map: {
        sticky: true,
        heading: "Below are the <b>top 10 lands in tropical humid forests</b> with the lowest detected primary tree cover loss — the least threatened primary forests — between 2015 and 2025.",
        // The ranked set, read from panel_meta.json by the build script — so
        // these are the same lands the countdown below actually draws, and
        // they cannot drift from it.
        //
        // NOTE FOR THE DESK: that is EIGHT dots under a heading that says ten,
        // because #9 and #10 are still waiting on the ZITT / Waorani boundary.
        // Nothing here needs changing when they land: the region is built from
        // the panel list, so it becomes ten on the next run of the renderer.
        region: 'ranked',
      },
      onChapterEnter: [],
      onChapterExit: [],
    },

    // Top 8
    {
      id: 'Top 8',
      type: 'stage',
      stage: 'AreaReveal',
      areaId: 8,
      eager: true,
      panels: {
        region: '/panels/08_murunahua_region.webp',
        interior: '/panels/08_murunahua_interior.webp',
      },
      scale: { n: 20, kmFrac: 0.1231, miFrac: 0.1981 },
      locator: [-72.551561, -10.123897],
      adm1: 'Ucayali',
      country: 'Peru',
      rank: '#8',
      title: 'Murunahua Indigenous Reserve',
      menuName: 'Murunahua',
      description: "<p>Home to the Chitonahua (murunahua), Maschco Piro and Amahuaca, this 470,305-hectare (1,162,147-acre) reserve in Peru lost <b>173 hectares</b> of primary forest between 2015 and 2025 — about one hectare in every 2,698.</p><ul class='area-facts'><li><span class='area-facts__label'>Top three drivers of forest loss:</span> Other natural disturbances, logging and shifting cultivation</li><li><span class='area-facts__label'>Tree cover loss due to wildfires:</span> Not recorded</li></ul>",
    },
    // Top 7
    {
      id: 'Top 7',
      type: 'stage',
      stage: 'AreaReveal',
      areaId: 7,
      panels: {
        region: '/panels/07_kichwa_region.webp',
        interior: '/panels/07_kichwa_interior.webp',
      },
      scale: { n: 10, kmFrac: 0.1279, miFrac: 0.2058 },
      locator: [-76.597254, -1.561798],
      adm1: 'Pastaza',
      country: 'Ecuador',
      rank: '#7',
      title: 'Kichwa Curaray Morete Playa Ancestral Community',
      menuName: 'Kichwa Curaray',
      description: "<p>Home to the Tagaeri and Taromenane, this 53,016-hectare (131,005-acre) community land in Ecuador lost <b>19 hectares</b> of primary forest between 2015 and 2025 — about one hectare in every 2,810.</p><ul class='area-facts'><li><span class='area-facts__label'>Top three drivers of forest loss:</span> Other natural disturbances, logging and shifting cultivation</li><li><span class='area-facts__label'>Tree cover loss due to wildfires:</span> Not recorded</li></ul>",
    },
    // Top 6
    {
      id: 'Top 6',
      type: 'stage',
      stage: 'AreaReveal',
      areaId: 6,
      panels: {
        region: '/panels/06_pucacuro_region.webp',
        interior: '/panels/06_pucacuro_interior.webp',
      },
      scale: { n: 50, kmFrac: 0.1777, miFrac: 0.2861 },
      locator: [-75.329147, -2.438491],
      adm1: 'Loreto',
      country: 'Peru',
      rank: '#6',
      title: 'Pucacuro National Reserve',
      menuName: 'Pucacuro',
      description: "<p>This 637,953-hectare (1,576,414-acre) reserve in Peru lost <b>179 hectares</b> of primary forest between 2015 and 2025 — about one hectare in every 3,542.</p><ul class='area-facts'><li><span class='area-facts__label'>Top three drivers of forest loss:</span> Logging, other natural disturbances and shifting cultivation</li><li><span class='area-facts__label'>Tree cover loss due to wildfires:</span> Not recorded</li></ul>",
    },
    // Top 5
    {
      id: 'Top 5',
      type: 'stage',
      stage: 'AreaReveal',
      areaId: 5,
      panels: {
        region: '/panels/05_alto_purus_region.webp',
        interior: '/panels/05_alto_purus_interior.webp',
      },
      scale: { n: 50, kmFrac: 0.1376, miFrac: 0.2215 },
      locator: [-71.544136, -10.762818],
      adm1: 'Ucayali',
      country: 'Peru',
      rank: '#5',
      title: 'Alto Purús National Park',
      menuName: 'Alto Purús',
      description: "<p>Home to the Mashco Piro, Curanjeño Chitonahua and Mastanahua, this 2,510,694-hectare (6,204,050-acre) park in Peru lost <b>681 hectares</b> of primary forest between 2015 and 2025 — about one hectare in every 3,643.</p><ul class='area-facts'><li><span class='area-facts__label'>Top three drivers of forest loss:</span> Other natural disturbances, logging and permanent agriculture</li><li><span class='area-facts__label'>Tree cover loss due to wildfires:</span> Not recorded</li></ul>",
    },
    // Top 4
    {
      id: 'Top 4',
      type: 'stage',
      stage: 'AreaReveal',
      areaId: 4,
      panels: {
        region: '/panels/04_purus_region.webp',
        interior: '/panels/04_purus_interior.webp',
      },
      scale: { n: 25, kmFrac: 0.1348, miFrac: 0.2169 },
      locator: [-71.155236, -10.224041],
      adm1: 'Ucayali',
      country: 'Peru',
      rank: '#4',
      title: 'Purús Communal Reserve',
      menuName: 'Purús',
      description: "<p>Home to the Mashco Piro, this 202,033-hectare (499,234-acre) reserve in Peru lost <b>54 hectares</b> of primary forest between 2015 and 2025 — about one hectare in every 3,665.</p><ul class='area-facts'><li><span class='area-facts__label'>Top three drivers of forest loss:</span> Other natural disturbances, logging and shifting cultivation</li><li><span class='area-facts__label'>Tree cover loss due to wildfires:</span> Not recorded</li></ul>",
    },
    // Top 3
    {
      id: 'Top 3',
      type: 'stage',
      stage: 'AreaReveal',
      areaId: 3,
      panels: {
        region: '/panels/03_mamoria_region.webp',
        interior: '/panels/03_mamoria_interior.webp',
      },
      scale: { n: 25, kmFrac: 0.1481, miFrac: 0.2384 },
      locator: [-66.52104, -7.290541],
      adm1: 'Amazonas',
      country: 'Brazil',
      rank: '#3',
      title: 'Mamoriá Grande Indigenous Territory',
      menuName: 'Mamoriá Grande',
      description: "<p>Home to the Isolados do Mamoriá Grande, this 259,783-hectare (641,937-acre) territory in Brazil lost <b>57 hectares</b> of primary forest between 2015 and 2025 — about one hectare in every 4,526.</p><ul class='area-facts'><li><span class='area-facts__label'>Top three drivers of forest loss:</span> Logging, other natural disturbances and wildfire</li><li><span class='area-facts__label'>Tree cover loss due to wildfires:</span> 8 hectares (14.0% of all tree cover loss)</li></ul>",
    },
    // Top 2
    {
      id: 'Top 2',
      type: 'stage',
      stage: 'AreaReveal',
      areaId: 2,
      panels: {
        region: '/panels/02_chandless_region.webp',
        interior: '/panels/02_chandless_interior.webp',
      },
      scale: { n: 50, kmFrac: 0.2304, miFrac: 0.3708 },
      locator: [-70.363689, -10.021331],
      adm1: 'Acre',
      country: 'Brazil',
      rank: '#2',
      title: 'Mashco do Rio Chandless Indigenous Territory',
      menuName: 'Chandless',
      description: "<p>Home to the Mashco Isolados do Rio Chandless, this 538,338-hectare (1,330,260-acre) territory in Brazil lost <b>68 hectares</b> of primary forest between 2015 and 2025 — about one hectare in every 7,585.</p><ul class='area-facts'><li><span class='area-facts__label'>Top three drivers of forest loss:</span> Other natural disturbances, logging and permanent agriculture</li><li><span class='area-facts__label'>Tree cover loss due to wildfires:</span> Not recorded</li></ul>",
    },
    // Top 1
    {
      id: 'Top 1',
      type: 'stage',
      stage: 'AreaReveal',
      areaId: 1,
      panels: {
        region: '/panels/01_sentinel_region.webp',
        interior: '/panels/01_sentinel_interior.webp',
      },
      scale: { n: 5, kmFrac: 0.1827, miFrac: 0.2941 },
      locator: [92.240531, 11.556794],
      // The one section that fades out completely rather than to 0.45: it
      // gives way to a text card a screen tall, and anything still showing
      // above that reads as a mistake rather than as a crossfade.
      timings: { fade: 1, recedeTo: 0.9 },
      adm1: 'Andaman and Nicobar Islands',
      country: 'India',
      rank: '#1',
      title: 'North Sentinel Island Tribal Reserve',
      menuName: 'North Sentinel',
      description: "<p>Home to the Sentinelese people, this 5,967-hectare (14,745-acre) reserve in India recorded <b>no primary forest loss at all</b> between 2015 and 2025.</p><ul class='area-facts'><li><span class='area-facts__label'>Tree cover loss due to wildfires:</span> Not recorded</li></ul>",
    },
  ],
};

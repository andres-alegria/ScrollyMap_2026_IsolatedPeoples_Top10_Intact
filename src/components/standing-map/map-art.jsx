import React, { useEffect, useState } from 'react';
import WORLD from '../../data/world-robinson-data';

export { WORLD };

// How a dot is drawn, wide screen and narrow. These are attributes rather than
// CSS because `r` as a CSS property is a Blink and Gecko feature: WebKit does
// not implement the SVG geometry properties, so in Safari the rule was simply
// dropped and every circle fell back to the default radius, which is nought.
// Eighty-five invisible dots.
//
// The narrow values are not just smaller. The paper ring that separates dots
// on a wide screen is what breaks first when the map is drawn at a third the
// width: eighty rings inside the width of the Amazon stop being eighty rings
// and fuse into one pale blot, which reads as a hole punched through South
// America. So the ring goes and the dot stays small. Overlapping green on
// green still reads as a crowd, which is what the cluster is.
// The ring is a hairline. It is drawn in screen pixels, not drawing units
// (`vector-effect: non-scaling-stroke` in map-art.scss), and a stroke straddles
// the path — so at 2.6 it took 1.3 px off the dot's radius on the inside as
// well as adding 1.3 outside, and a dot drawn about 8 px across came out more
// ring than dot. The crowd read as a pale mass with green specks in it. One
// pixel is enough to keep eighty overlapping dots apart; below about 0.6 they
// start to merge again.
const DOT = {
  wide:   { r: 8.5, stroke: '#f7f4ee', strokeWidth: 1 },    // adjust dot size
  narrow: { r: 9,   stroke: 'none',    strokeWidth: 0 },    // adjust on phones
};
const NARROW = '(max-width: 999px)';

const useNarrow = () => {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(NARROW).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    on();
    return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
};

/**
 * The Robinson world, drawn for one named set of lands.
 *
 * Shared by the three maps that sit in the flow of the story and by the one
 * that stands at the foot of the screen, so the four cannot drift apart. The
 * geometry is built offline — see 2026_076 `build_world_robinson.py` — and
 * arrives as paths: land, graticule, the projected outline, a bracket for the
 * region a heading names, and every land as a dot.
 *
 * No state and no refs. The standing map animates by scaling the whole <svg>
 * from outside, which needs nothing in here to change.
 */
const MapArt = ({ region = 'world', label = '', className = '' }) => {
  const [W, H] = WORLD.viewBox;
  const dot = useNarrow() ? DOT.narrow : DOT.wide;
  const set = WORLD.regions[region] || WORLD.regions.world;
  const lit = new Set(set.dots);

  return (
    <svg
      className={`map-art ${className}`.trim()}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
    >
      {/* Everything sits inside one group so the closing zoom has something
          to scale that is actually in SVG user units. Scaling the <svg> itself
          does not work: a root <svg> takes a CSS transform in CSS pixels, so a
          transform-origin given in drawing units lands somewhere off the map
          and the view slides away from the target instead of toward it. */}
      <g className="map-art__camera">
      <path className="map-art__edge" d={WORLD.edge} />
      <path className="map-art__graticule" d={WORLD.graticule} />
      <path className="map-art__land" d={WORLD.land} fillRule="evenodd" />
      {set.box && <path className="map-art__box" d={set.box} />}
      <g className="map-art__dots">
        {WORLD.dots.map(([x, y], i) => (
          lit.has(i) ? (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={dot.r}
              stroke={dot.stroke}
              strokeWidth={dot.strokeWidth}
            />
          ) : null
        ))}
      </g>
      </g>
    </svg>
  );
};

export default MapArt;

import React from 'react';
import WORLD from '../../data/world-robinson-data';

export { WORLD };

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
  const set = WORLD.regions[region] || WORLD.regions.world;
  const lit = new Set(set.dots);

  return (
    <svg
      className={`map-art ${className}`.trim()}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
    >
      <path className="map-art__edge" d={WORLD.edge} />
      <path className="map-art__graticule" d={WORLD.graticule} />
      <path className="map-art__land" d={WORLD.land} fillRule="evenodd" />
      {set.box && <path className="map-art__box" d={set.box} />}
      <g className="map-art__dots">
        {WORLD.dots.map(([x, y], i) => (
          lit.has(i) ? <circle key={i} cx={x} cy={y} /> : null
        ))}
      </g>
    </svg>
  );
};

export default MapArt;

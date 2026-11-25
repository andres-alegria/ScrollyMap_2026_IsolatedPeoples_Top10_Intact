import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import MapArt, { WORLD } from './map-art';
import './standing-map.scss';

gsap.registerPlugin(ScrollTrigger);

/**
 * The last of the four maps.
 *
 * It arrives the way the other three do — in the flow of the story, directly
 * after the paragraph it belongs to — and it never stops. What makes it
 * different is that it works while it travels: from the moment its foot
 * reaches the foot of the screen it pushes toward the Mediterranean and fades,
 * and it finishes as it leaves the top.
 *
 * It did hold still for a stretch, locked to the bottom by `position: sticky`.
 * That cost a runway of empty page to hold the lock in, and the reader crossed
 * it between the end of the introduction and the first ranked land. Moving
 * through the zoom instead buys the same stretch of motion out of travel the
 * map was going to do anyway.
 *
 * Config:
 *
 *   chapter.map   { sticky: true, heading, region }
 *   mapHandover   scale, focus — how it leaves
 */
const StandingMap = ({ heading = '', region = 'world', mapHandover = {} }) => {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const leaveRef = useRef(null);
  const frameRef = useRef(null);

  const label = heading ? t(heading) : '';
  // The heading carries emphasis, so it is written as HTML. A screen reader
  // wants the words, not the markup.
  const plain = label.replace(/<[^>]+>/g, '');

  useEffect(() => {
    const root = rootRef.current;
    const leaving = leaveRef.current;
    const frame = frameRef.current;
    if (!root || !leaving || !frame) return undefined;

    // The whole move, measured against the map's own box as it goes past:
    // from its foot arriving at the foot of the screen to its foot leaving the
    // top. That is one screen of scroll, and the map is travelling for every
    // pixel of it — which is the point. Nothing here is a position, so there
    // is no empty page to hold one in.
    const common = {
      trigger: root,
      start: 'bottom bottom',
      end: 'bottom top',
      scrub: true,
    };

    const mm = gsap.matchMedia();
    const fade = gsap.to(leaving, { opacity: 0, ease: 'none',
                                    scrollTrigger: { ...common } });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // svgOrigin is in SVG user units, so it has to be applied to a group
      // INSIDE the svg. On the root <svg> the transform is a CSS one in CSS
      // pixels and the origin lands off the drawing entirely.
      const art = frame.querySelector('.map-art__camera');
      if (!art) return undefined;

      // Named points are projected at build time from lon/lat, so the target
      // can be checked against an atlas rather than against drawing units.
      const [fx, fy] = (mapHandover.focus && WORLD.focusPoints?.[mapHandover.focus])
        || WORLD.focusBetween || WORLD.focus;

      const tw = gsap.to(art, {
        scale: mapHandover.scale ?? 4, ease: 'none',
        svgOrigin: `${fx} ${fy}`, scrollTrigger: { ...common },
      });
      return () => { tw.scrollTrigger?.kill(); };
    });

    return () => {
      fade.scrollTrigger?.kill();
      mm.revert();
    };
  }, [mapHandover]);

  return (
    <div className="standing-map" ref={rootRef}>
      <div className="standing-map__leaving" ref={leaveRef}>
        {/* Type, not an SVG label: it has to wrap on a phone, be read by a
            screen reader and be translated with the rest of the piece.
            Written as HTML because this line carries the emphasis it had as
            the hand-off paragraph, which is where it came from. */}
        {label && (
          <p
            className="standing-map__heading"
            dangerouslySetInnerHTML={{ __html: label }}
          />
        )}

        {/* Nothing clips the map: it grows out of this box and off the
            screen. The scale is applied to a group inside the svg. */}
        <div className="standing-map__frame" ref={frameRef}>
          <MapArt region={region} label={plain} />
        </div>
      </div>
    </div>
  );
};

export default StandingMap;

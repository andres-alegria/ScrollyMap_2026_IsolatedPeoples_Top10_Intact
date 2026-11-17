import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import MapArt, { WORLD } from './map-art';
import './standing-map.scss';

gsap.registerPlugin(ScrollTrigger);

/**
 * The last of the four maps, and the only one that moves.
 *
 * The other three are figures in the flow of the story (see inline-map.jsx).
 * This one is fixed to the foot of the screen for the closing stretch of the
 * introduction, because it has somewhere to go: it carries the hand-over into
 * the countdown. It fades in, holds while the last of the copy scrolls down
 * over it, and then pushes toward the lands the ranking is about and leaves.
 *
 * Two things happen at that hand-over, in that order:
 *
 *   1. it scales toward `focusBetween` — the point halfway between the South
 *      American cluster and the lands off Asia, rather than the middle of the
 *      ranked eight, which sit so tightly in the western Amazon that a zoom
 *      onto them throws the Andamans and Halmahera off the frame. North
 *      Sentinel is where the countdown ends; it should not leave the screen on
 *      the way in.
 *   2. partway through, its frame stops clipping it, so the last of the move
 *      is the map growing out of its own box rather than into it.
 *
 * Config, all in `config.js`:
 *
 *   standingMap   { heading, region }  what it shows; it never changes
 *   mapReveal     the window it fades in over
 *   mapHandover   the window it scales and leaves over, and `unclipAt`, the
 *                 fraction of that window at which the frame lets go
 */
const StandingMap = ({ standingMap = {}, mapReveal, mapHandover }) => {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const leaveRef = useRef(null);
  const frameRef = useRef(null);

  const { heading = '', region = 'world' } = standingMap;
  const label = heading ? t(heading) : '';

  useEffect(() => {
    const root = rootRef.current;
    const leaving = leaveRef.current;
    const frame = frameRef.current;
    if (!root || !leaving || !frame) return undefined;

    const mm = gsap.matchMedia();
    const tweens = [];
    const triggers = [];

    if (mapReveal && document.getElementById(mapReveal.trigger)) {
      tweens.push(gsap.fromTo(root, { opacity: 0 }, {
        opacity: 1, ease: 'none',
        scrollTrigger: {
          trigger: `#${CSS.escape(mapReveal.trigger)}`,
          start: mapReveal.start, end: mapReveal.end, scrub: true,
        },
      }));
    }

    if (mapHandover && document.getElementById(mapHandover.trigger)) {
      // Named points are projected at build time from lon/lat, so the target
      // can be checked against a map rather than against drawing units.
      const [fx, fy] = (mapHandover.focus && WORLD.focusPoints?.[mapHandover.focus])
        || WORLD.focusBetween || WORLD.focus;
      const common = {
        trigger: `#${CSS.escape(mapHandover.trigger)}`,
        start: mapHandover.start, end: mapHandover.end, scrub: true,
      };

      // The fade rides on the inner layer, not on the root. Both windows are
      // scrubbed and both wanted opacity, and a `gsap.to` reads its start
      // value when it is first rendered — which here was at the top of the
      // page, with the root still at the nought the reveal starts from. It
      // then tweened nought to nought and pinned the map invisible for the
      // whole introduction, while the zoom underneath it ran perfectly.
      tweens.push(gsap.to(leaving, { opacity: 0, ease: 'none',
                                     scrollTrigger: { ...common } }));

      // Reduced motion keeps the fade and drops the push toward the lands:
      // the fade is information (the map is leaving), the zoom is only the
      // manner of its leaving — and so is the frame letting go.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // svgOrigin is in SVG user units, so it has to be applied to a group
        // INSIDE the svg. On the root <svg> the transform is a CSS one in CSS
        // pixels and the origin lands off the drawing entirely — which sent
        // the camera north-west, over North America, instead of to its target.
        const art = frame.querySelector('.map-art__camera');
        if (!art) return undefined;
        const tw = gsap.to(art, {
          scale: mapHandover.scale ?? 4, ease: 'none',
          svgOrigin: `${fx} ${fy}`, scrollTrigger: common,
        });
        const at = mapHandover.unclipAt ?? 0;
        const st = ScrollTrigger.create({
          ...common,
          scrub: false,
          // onToggle as well as onUpdate: onUpdate only runs while the window
          // is active, so scrolling back above it would otherwise leave the
          // frame open and the map free to spill over the copy it has just
          // handed back to.
          onUpdate: (self) => {
            frame.classList.toggle('is-unclipped', self.progress >= at);
          },
          onToggle: (self) => {
            if (!self.isActive) frame.classList.remove('is-unclipped');
          },
        });
        return () => { tw.scrollTrigger?.kill(); st.kill(); };
      });
    }

    return () => {
      tweens.forEach((tw) => tw.scrollTrigger?.kill());
      triggers.forEach((st) => st.kill());
      mm.revert();
    };
  }, [mapReveal, mapHandover]);

  return (
    <div className="standing-map" ref={rootRef}>
      <div className="standing-map__leaving" ref={leaveRef}>
        {/* Type, not an SVG label: it has to wrap on a phone, be read by a
            screen reader and be translated with the rest of the piece. */}
        {label && <p className="standing-map__heading">{label}</p>}

        {/* The frame clips the map until the hand-over says otherwise. The
            scale is applied to the <svg> inside it, so the clip and the move
            are separate things and either can be changed without the other. */}
        <div className="standing-map__frame" ref={frameRef}>
          <MapArt region={region} label={label} />
        </div>
      </div>
    </div>
  );
};

export default StandingMap;

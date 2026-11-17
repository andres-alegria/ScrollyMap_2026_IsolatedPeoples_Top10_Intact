import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import MapArt, { WORLD } from './map-art';
import './standing-map.scss';

gsap.registerPlugin(ScrollTrigger);

// How far above the foot of the screen the map locks, as a fraction of the
// viewport's height. The band of paper behind it reaches exactly this far
// below its bottom edge (`bottom: -2.5vh` in the scss), so the two have to
// agree or the band stops short of the screen's edge.
const LOCK_VH = 0.025;

/**
 * The last of the four maps.
 *
 * It arrives the way the other three do — in the flow of the story, directly
 * after the paragraph it belongs to, rising with the copy. What makes it
 * different is that it stops: when its bottom edge reaches the foot of the
 * screen it locks there, and from that point the story scrolls on behind it
 * while it pushes toward the Mediterranean and leaves.
 *
 * Sticky rather than fixed, and the difference is the whole point. A fixed map
 * is in that position from the moment it exists, so it has to be faded in, and
 * the copy that passes it has to be hidden behind a band of paper on the way.
 * A sticky one simply flows until it reaches the place it is going to hold,
 * which is what a reader expects of a figure — and the fade-in and the
 * collisions it caused go with it.
 *
 * The runway is the element's own container, because that is what sticky
 * measures against: the map stays locked for the container's height less its
 * own. Everything that moves is keyed off the moment it locks.
 *
 * Config:
 *
 *   chapter.map   { sticky: true, heading, region, runway }
 *   mapHandover   scale, focus, unclipAt — how it leaves, once it has locked
 */
const StandingMap = ({ heading = '', region = 'world', runway, mapHandover = {} }) => {
  const { t } = useTranslation();
  const runwayRef = useRef(null);
  const stickyRef = useRef(null);
  const leaveRef = useRef(null);
  const frameRef = useRef(null);

  const label = heading ? t(heading) : '';

  useEffect(() => {
    const track = runwayRef.current;
    const sticky = stickyRef.current;
    const leaving = leaveRef.current;
    const frame = frameRef.current;
    if (!track || !sticky || !leaving || !frame) return undefined;

    // Where it locks: its bottom edge this far above the foot of the screen.
    const offset = () => window.innerHeight * LOCK_VH;

    // `top`, not `bottom`.
    //
    // A bottom inset is the mirror of a top one: it holds a box from falling
    // BELOW a line, which pins it while the reader scrolls up. It does nothing
    // on the way down, so with `bottom: 2.5vh` the map simply flowed past and
    // off the top of the screen. What locks a box on the way down is `top` —
    // and the top it has to be given is the screen's height less its own and
    // the offset, which is only knowable once it has been laid out. Hence
    // JavaScript, re-run whenever the window changes.
    const place = () => {
      const top = window.innerHeight - sticky.offsetHeight - offset();
      sticky.style.setProperty('--map-lock', `${Math.round(top)}px`);
    };
    place();
    window.addEventListener('resize', place);

    // The lock point, for the motion. Measured against the runway, whose
    // position stays honest — the sticky box's own rectangle stops moving once
    // it has locked, so reading that would give the same number for ever after.
    const lockPoint = () => `top bottom-=${Math.round(sticky.offsetHeight + offset())}`;

    const common = {
      trigger: track,
      start: lockPoint,
      // Gone by the time the runway runs out, which is also the moment sticky
      // lets go — so it never comes unstuck in view.
      endTrigger: track,
      end: 'bottom bottom',
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

      const at = mapHandover.unclipAt ?? 0;
      const st = ScrollTrigger.create({
        ...common,
        scrub: false,
        // onToggle as well as onUpdate: onUpdate only runs while the window is
        // active, so scrolling back above it would otherwise leave the frame
        // open and the map free to spill over the copy above it.
        onUpdate: (self) => {
          frame.classList.toggle('is-unclipped', self.progress >= at);
        },
        onToggle: (self) => {
          if (!self.isActive) frame.classList.remove('is-unclipped');
        },
      });
      return () => { tw.scrollTrigger?.kill(); st.kill(); };
    });

    const refresh = ScrollTrigger.addEventListener('refreshInit', place);

    return () => {
      window.removeEventListener('resize', place);
      ScrollTrigger.removeEventListener('refreshInit', place);
      fade.scrollTrigger?.kill();
      mm.revert();
    };
  }, [mapHandover]);

  return (
    <div
      className="standing-map__runway"
      ref={runwayRef}
      style={runway ? { height: runway } : undefined}
    >
      <div className="standing-map" ref={stickyRef}>
        <div className="standing-map__leaving" ref={leaveRef}>
          {/* Type, not an SVG label: it has to wrap on a phone, be read by a
              screen reader and be translated with the rest of the piece. */}
          {label && <p className="standing-map__heading">{label}</p>}

          {/* The frame clips the map until the hand-over says otherwise. The
              scale is applied to a group inside the svg, so the clip and the
              move are separate and either can change without the other. */}
          <div className="standing-map__frame" ref={frameRef}>
            <MapArt region={region} label={label} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandingMap;

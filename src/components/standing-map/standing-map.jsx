import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import WORLD from '../../data/world-robinson-data';
import './standing-map.scss';

gsap.registerPlugin(ScrollTrigger);

/**
 * The map the introduction stands on.
 *
 * It replaces the Mapbox globe, and it is a different kind of object. The
 * globe moved: it flew from one chapter's subject to the next, and the reader
 * spent the opening watching a camera rather than reading. This one does not
 * move at all. It is laid along the bottom of the screen for the whole
 * introduction and the copy scrolls up over it, so the only thing that ever
 * changes is which lands are lit and what the heading above them says.
 *
 * Robinson, which is the projection the loss piece's closing map uses and the
 * one Mapbox cannot draw — its list stops at Natural Earth and Winkel Tripel.
 * The geometry is built offline (2026_076 `build_world_robinson.py`) and
 * arrives as paths, not as an image: about 70 KB of text, no second request,
 * nothing to go blurry when the map is scaled into the countdown, and no
 * WebGL context to hold open behind a page that is mostly type.
 *
 * Everything the story controls is in `config.js`:
 *
 *   chapter.map   { heading, region }   what this chapter lights up. A chapter
 *                                       with no block keeps the one before it.
 *   mapReveal     the window it fades in over
 *   mapHandover   the window it scales toward the ranked lands and leaves on
 */
const StandingMap = ({ chapters = [], mapReveal, mapHandover }) => {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const leaveRef = useRef(null);
  const zoomRef = useRef(null);
  const boxRef = useRef(null);
  const headingRef = useRef(null);
  const dotRefs = useRef([]);
  const stateRef = useRef(null);

  const [W, H] = WORLD.viewBox;

  // The chapters that say something about the map, in document order, each
  // carrying the full state to apply rather than a change to make — so
  // arriving at one from above and from below give the same picture.
  const beats = useMemo(() => {
    const out = [];
    let last = { heading: '', region: 'world' };
    (chapters || []).forEach((c) => {
      if (!c || !c.id || !c.map) return;
      last = { heading: c.map.heading ?? last.heading,
               region: c.map.region ?? last.region };
      out.push({ id: c.id, ...last });
    });
    return out;
  }, [chapters]);

  useEffect(() => {
    if (beats.length === 0) return undefined;

    const apply = (beat) => {
      if (!beat || stateRef.current === beat.id) return;
      const previous = stateRef.current;
      stateRef.current = beat.id;

      const region = WORLD.regions[beat.region] || WORLD.regions.world;
      const lit = new Set(region.dots);

      // The first application is a state, not a change: dots and heading are
      // put where they belong with no tween, so a reader who lands mid-story
      // — a jump-bar click, a reload at an anchor — does not watch the map
      // assemble itself from whatever it happened to be showing.
      const dur = previous === null ? 0 : 0.45;   // adjust dot fade

      dotRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, { opacity: lit.has(i) ? 1 : 0, duration: dur,
                      overwrite: 'auto', ease: 'power1.out' });
      });

      if (boxRef.current) {
        const box = boxRef.current;
        if (region.box) {
          box.setAttribute('d', region.box);
          gsap.to(box, { opacity: 1, duration: dur, overwrite: 'auto' });
        } else {
          gsap.to(box, { opacity: 0, duration: dur, overwrite: 'auto',
                         // left in place until it has finished leaving, or the
                         // outline jumps to the next region before it fades
                         onComplete: () => box.setAttribute('d', '') });
        }
      }

      const head = headingRef.current;
      if (head) {
        const text = beat.heading ? t(beat.heading) : '';
        if (dur === 0) {
          head.textContent = text;
          gsap.set(head, { opacity: text ? 1 : 0 });
        } else {
          gsap.timeline()
            .to(head, { opacity: 0, duration: dur * 0.45, ease: 'power1.in' })
            .add(() => { head.textContent = text; })
            .to(head, { opacity: text ? 1 : 0, duration: dur * 0.55,
                        ease: 'power1.out' });
        }
      }
    };

    // Which beat is in force, read from geometry rather than from the app's
    // currentChapterId — that value names the chapter being LEFT so the old
    // map code could run onChapterExit, and it trails a section behind when
    // the reader scrolls up. The jump bar reads positions for the same
    // reason. The last beat whose chapter has reached the middle of the
    // screen is the one on screen.
    const check = () => {
      let active = beats[0];
      beats.forEach((b) => {
        const el = document.getElementById(b.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.55) {
          active = b;
        }
      });
      apply(active);
    };

    const st = ScrollTrigger.create({ start: 0, end: 'max',
                                      onUpdate: check, onRefresh: check });
    check();
    return () => st.kill();
  }, [beats, t]);

  // Fading in, and the hand-over into the countdown. Both are scrubbed, so
  // they are positions rather than animations: the reader can scroll back up
  // through either and find the map exactly where they left it.
  useEffect(() => {
    const root = rootRef.current;
    const leaving = leaveRef.current;
    const zoom = zoomRef.current;
    if (!root || !leaving || !zoom) return undefined;

    const mm = gsap.matchMedia();
    const triggers = [];

    if (mapReveal && document.getElementById(mapReveal.trigger)) {
      triggers.push(gsap.fromTo(root, { opacity: 0 }, {
        opacity: 1, ease: 'none',
        scrollTrigger: {
          trigger: `#${CSS.escape(mapReveal.trigger)}`,
          start: mapReveal.start, end: mapReveal.end, scrub: true,
        },
      }));
    }

    // The hand-over. The map scales toward the middle of the ranked lands and
    // fades as it goes, which is the move the globe made when its camera dove
    // onto the first territory — the reader half-sees it, and the story takes
    // over. The scale is centred on the ranked set in the drawing's own
    // units, so it stays on those lands whatever size the map is drawn at.
    if (mapHandover && document.getElementById(mapHandover.trigger)) {
      const [fx, fy] = WORLD.focus;
      const common = {
        trigger: `#${CSS.escape(mapHandover.trigger)}`,
        start: mapHandover.start, end: mapHandover.end, scrub: true,
      };
      // Reduced motion keeps the fade and drops the push toward the lands:
      // the fade is information (the map is leaving), the zoom is only the
      // manner of its leaving.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tw = gsap.to(zoom, {
          scale: mapHandover.scale ?? 4, ease: 'none',
          svgOrigin: `${fx} ${fy}`, scrollTrigger: common,
        });
        return () => tw.scrollTrigger?.kill();
      });
      // On the inner layer, not on the root. The two windows are both scrubbed
      // and both wanted opacity, and a `gsap.to` reads its start value when it
      // is first rendered — which here was at the top of the page, with the
      // root still at the nought the reveal starts from. It then tweened nought
      // to nought and pinned the map invisible for the whole introduction,
      // while the zoom underneath it ran perfectly. One property per element
      // is the fix; sharing one needs them to know about each other.
      triggers.push(gsap.to(leaving, { opacity: 0, ease: 'none',
                                       scrollTrigger: { ...common } }));
    }

    return () => {
      triggers.forEach((tw) => tw.scrollTrigger?.kill());
      mm.revert();
    };
  }, [mapReveal, mapHandover]);

  return (
    <div className="standing-map" ref={rootRef}>
     <div className="standing-map__leaving" ref={leaveRef}>
      {/* Type, not an SVG label: it has to wrap on a phone, be read by a
          screen reader and be translated with the rest of the piece. */}
      <p className="standing-map__heading" ref={headingRef} />

      <svg
        className="standing-map__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={t('World map of Indigenous and protected lands with '
                      + 'confirmed presence of peoples living in isolation')}
      >
        <g ref={zoomRef}>
          <path className="standing-map__edge" d={WORLD.edge} />
          <path className="standing-map__graticule" d={WORLD.graticule} />
          <path className="standing-map__land" d={WORLD.land} fillRule="evenodd" />
          <path className="standing-map__box" ref={boxRef} d="" opacity="0" />
          <g className="standing-map__dots">
            {WORLD.dots.map(([x, y], i) => (
              <circle
                key={i}
                ref={(el) => { dotRefs.current[i] = el; }}
                cx={x}
                cy={y}
                opacity="0"
              />
            ))}
          </g>
        </g>
      </svg>
     </div>
    </div>
  );
};

export default StandingMap;

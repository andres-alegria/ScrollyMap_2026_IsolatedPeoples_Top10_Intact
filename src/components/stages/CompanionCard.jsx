import React from 'react';
import { useTranslation } from 'react-i18next';
import './CompanionCard.css';

/**
 * The hand-off to the companion story, after the last land and before the
 * credits.
 *
 * It is the card drafted for the loss piece when we were weighing how to put
 * that story into an article — art on one side, a short block of copy on the
 * other, the whole thing one link. The same shape works here for the opposite
 * job: not getting a reader into this piece, but sending them on to the other
 * one once they have reached the end of it.
 *
 * `target="_top"` rather than `_blank`: this piece is meant to sit in a
 * Mongabay post inside an iframe, and a link left at its default would open
 * the companion story inside that frame — a 49-screen scrolly in a window a
 * few hundred pixels tall. `_top` takes it to the whole tab, which is what a
 * link in an article does. Outside an iframe it behaves as `_self`.
 *
 * Config (chapter keys; everything but title/description reaches this as a
 * stage prop):
 *
 *   href      where it goes
 *   eyebrow   the small label above the headline
 *   heading   the companion story's title
 *   deck      one or two lines on what is in it
 *   meta      the line under the deck
 *   cta       the button's words
 *   art       { ground, alt, pieces: [{ src, left/right, top/bottom, width }] }
 *
 * The art is a collage of the companion story's own intro pieces, placed the
 * way that story places them — percentages of the box, so the arrangement
 * holds as the card reshapes. They are flat halftones carrying that piece's
 * red band, which is also this card's accent, so they sit together without
 * any treatment here.
 */
const CompanionCard = ({
  chapter,
  href = '#',
  eyebrow = '',
  heading = '',
  deck = '',
  meta = '',
  cta = '',
  art = {},
}) => {
  const { t } = useTranslation();
  const tr = (s) => (s ? t(s) : '');

  return (
    <div className="companion">
      <a
        className="companion__card"
        href={href}
        target="_top"
        rel="noopener"
        // The card is one link, so the art must not be announced twice and
        // the arrow must not be read at all.
        aria-label={`${tr(heading)} — ${tr(cta)}`}
      >
        {Array.isArray(art.pieces) && art.pieces.length > 0 && (
          <div
            className="companion__art"
            style={art.ground ? { backgroundColor: art.ground } : undefined}
            // One picture made of several files: the group carries the
            // description and each piece is marked decorative, so a screen
            // reader hears it once.
            role="img"
            aria-label={art.alt || ''}
          >
            {art.pieces.map((piece, i) => (
              <img
                key={piece.src}
                className="companion__piece"
                src={piece.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                style={{
                  left: piece.left,
                  right: piece.right,
                  top: piece.top,
                  bottom: piece.bottom,
                  width: piece.width,
                  zIndex: i,
                }}
              />
            ))}
          </div>
        )}

        <div className="companion__copy">
          {eyebrow && <span className="companion__eyebrow">{tr(eyebrow)}</span>}
          {heading && <h2 className="companion__heading">{tr(heading)}</h2>}
          {deck && <p className="companion__deck">{tr(deck)}</p>}
          {meta && <span className="companion__meta">{tr(meta)}</span>}
          {cta && (
            <span className="companion__go">
              {tr(cta)}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h13M12 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
      </a>
      {chapter?.title && chapter.title.trim() ? null : null}
    </div>
  );
};

export default CompanionCard;

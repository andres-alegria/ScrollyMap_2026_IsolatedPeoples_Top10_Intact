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
 *   art       { src, src500, alt }
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
        {art.src && (
          <div className="companion__art">
            <img
              src={art.src}
              srcSet={art.src500 ? `${art.src500} 500w, ${art.src} 900w` : undefined}
              sizes="(max-width: 720px) 92vw, 24rem"
              alt={art.alt || ''}
              loading="lazy"
              decoding="async"
            />
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

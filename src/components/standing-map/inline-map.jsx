import React from 'react';
import { useTranslation } from 'react-i18next';
import MapArt from './map-art';
import './inline-map.scss';

/**
 * A map in the flow of the story, after the paragraph it belongs to.
 *
 * The introduction used to run over one map fixed at the foot of the screen,
 * which changed what it showed as the reader passed each chapter. That asks
 * the reader to notice a change in something they are not looking at. Three of
 * the four states are now simply figures: each sits under its own paragraph,
 * holds still, and scrolls away with the copy that introduced it. Only the
 * last one stands, because only the last one has somewhere to go — it carries
 * the hand-over into the countdown.
 *
 * Nothing here moves, so there is no scroll machinery in this file at all.
 */
const InlineMap = ({ heading, region }) => {
  const { t } = useTranslation();
  const label = heading ? t(heading) : '';

  return (
    <figure className="inline-map">
      {label && <figcaption className="inline-map__heading">{label}</figcaption>}
      <MapArt region={region} label={label} />
    </figure>
  );
};

export default InlineMap;

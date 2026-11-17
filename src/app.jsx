import React, { useState } from 'react';
import './app.scss';
import Story from './components/story/story';
import StandingMap from './components/standing-map/standing-map';
import Intro from './components/intro/intro';
import Logos from './components/logos/logos';
import ReadingProgress from './components/reading-progress/reading-progress';

const App = (props) => {
  const {
    chapters,
    theme,
    title,
    subtitle,
    byline,
    footer,
    intro,
    logos,
    standingMap,
    mapReveal,
    mapHandover,
    credits,
    panelLabels,
  } = props;
  const [currentChapterId, setCurrentChapter] = useState(chapters[0]?.id);
  const [currentAction, setCurrentAction] = useState();


  // The Mapbox style and token checks that used to stand here are gone with
  // the map they guarded. Nothing in the piece talks to Mapbox any more: the
  // introduction's map is drawn from geometry, the ranked sections are
  // images, and the locator on each panel is its own SVG. A missing token
  // used to blank the whole story; now there is no token to miss.

  return (
    <div>
      <ReadingProgress theme={theme} />
      {intro && <Intro {...intro} />}
      <Logos logos={logos} />
      <Story
        hasIntro={!!intro}
        chapters={chapters}
        title={title}
        subtitle={subtitle}
        byline={byline}
        theme={theme}
        currentChapterId={currentChapterId}
        footer={footer}
        credits={credits}
        social={intro && intro.social}
        logos={logos}
        setCurrentChapter={setCurrentChapter}
        setCurrentAction={setCurrentAction}
        panelLabels={panelLabels}
      />
      <StandingMap
        standingMap={standingMap}
        mapReveal={mapReveal}
        mapHandover={mapHandover}
      />
    </div>
  );
};

export default App;

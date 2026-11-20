import React, { useRef, useState } from "react";
import { AudioLines, Award, BookOpen, Link as LinkIcon } from "lucide-react";
import { news } from "../data/site";
import { Bubbles, useHabitatMotion } from "./Habitat";

const icons = [BookOpen, AudioLines, Award];

export default function NewsSection({ paused }) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef([]);
  const section = useHabitatMotion(paused);
  const item = news[selected];

  function onTabKey(event, index) {
    const positions = {
      ArrowRight: (index + 1) % news.length,
      ArrowLeft: (index + news.length - 1) % news.length,
      Home: 0,
      End: news.length - 1,
    };
    if (!(event.key in positions)) return;
    event.preventDefault();
    const next = positions[event.key];
    setSelected(next);
    buttons.current[next]?.focus();
  }

  return (
    <section id="news" ref={section} className="news-section" aria-labelledby="news-heading">
      <Bubbles />
      <div className="wrap news-grid">
        <div className="news-heading">
          <p className="kicker">
            <span />
            Field notes
          </p>
          <h2 id="news-heading">
            Latest <em>news.</em>
          </h2>
        </div>
        <div className="news-picker">
          <p className="bubble-instruction" id="news-help">
            Select a bubble to read an update
          </p>
          <div
            className="bubble-set"
            role="tablist"
            aria-label="News updates"
            aria-describedby="news-help"
          >
            {news.map((story, i) => {
              const Icon = icons[i];
              return (
                <div
                  className={`bubble-position bubble-position-${i}`}
                  key={story.id}
                  role="presentation"
                >
                  <button
                    type="button"
                    className="news-bubble"
                    role="tab"
                    id={`news-tab-${story.id}`}
                    aria-selected={selected === i}
                    aria-controls="news-story"
                    tabIndex={selected === i ? 0 : -1}
                    ref={(el) => {
                      buttons.current[i] = el;
                    }}
                    onKeyDown={(e) => onTabKey(e, i)}
                    onClick={() => setSelected(i)}
                  >
                    <Icon size={17} aria-hidden="true" strokeWidth={1.4} />
                    <span>{story.label}</span>
                    <small>{story.kind}</small>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <article
          className="news-story"
          id="news-story"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`news-tab-${item.id}`}
        >
          <time dateTime={item.iso}>{item.date}</time>
          <h3>{item.headline}</h3>
          <p>{item.body}</p>
          <a className="text-link" href={item.href}>
            <LinkIcon size={14} aria-hidden="true" />
            {item.link}
          </a>
        </article>
      </div>
    </section>
  );
}

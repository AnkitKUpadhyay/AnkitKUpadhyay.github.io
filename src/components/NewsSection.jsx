import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, AudioLines, Award, BookOpen } from "lucide-react";
import { news } from "../data/site";
import { Bubbles, useHabitatMotion } from "./Habitat";
import { OceanAtmosphere } from "./LivingAtmosphere";

const icons = [BookOpen, AudioLines, Award];
const EASE = [0.22, 1, 0.36, 1];

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
      <OceanAtmosphere paused={paused} dense />
      <Bubbles />

      <motion.div
        className="wrap news-grid"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.72, ease: EASE }}
      >
        <div className="news-heading">
          <h2 id="news-heading">
            Latest <em>news.</em>
          </h2>
        </div>

        <div className="news-picker">
          <div className="bubble-set" role="tablist" aria-label="News updates">
            {news.map((story, i) => {
              const Icon = icons[i];
              return (
                <div
                  className={`bubble-position bubble-position-${i}`}
                  key={story.id}
                  role="presentation"
                >
                  <motion.button
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
                    whileHover={paused ? undefined : { scale: 1.045 }}
                    whileTap={paused ? undefined : { scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    onKeyDown={(e) => onTabKey(e, i)}
                    onClick={() => setSelected(i)}
                  >
                    <Icon size={17} aria-hidden="true" strokeWidth={1.4} />
                    <span>{story.label}</span>
                    <small>{story.kind}</small>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="news-story-shell">
          <AnimatePresence mode="wait">
            <motion.article
              key={item.id}
              className="news-story"
              id="news-story"
              role="tabpanel"
              tabIndex={0}
              aria-labelledby={`news-tab-${item.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.34, ease: EASE }}
            >
              <time dateTime={item.iso}>{item.date}</time>
              <h3>{item.headline}</h3>
              <p>{item.body}</p>
              <a className="text-link" href={item.href} target="_blank" rel="noreferrer">
                <span>{item.link}</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </motion.article>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}

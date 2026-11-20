import React from "react";
import { Plus } from "lucide-react";
import { news } from "../data/site";
import SwimmingAnimal from "./SwimmingAnimal";
import "../field-pages.css";

const stories = [...news].sort((a, b) => b.iso.localeCompare(a.iso));

export default function NewsSection({ paused = false }) {
  return (
    <section id="news" className="tidal-news" aria-labelledby="news-title" data-paused={paused}>
      <div className="tidal-news__seascape" aria-hidden="true">
        <div className="tidal-news__sunlight" />
        <div className="tidal-news__turtle">
          <SwimmingAnimal species="turtle" paused={paused} />
        </div>
      </div>
      <div className="wrap tidal-news__sheet">
        <h1 id="news-title">
          Latest <em>news.</em>
        </h1>
        <div className="tidal-news__index">
          {stories.map((story, i) => (
            <details key={story.id} name="latest-news" className="tidal-news__entry" open={i === 0}>
              <summary>
                <span className="tidal-news__entry-title">
                  <time dateTime={story.iso}>{story.date}</time>
                  <span>{story.headline}</span>
                </span>
                <Plus aria-hidden="true" size={20} strokeWidth={1.5} />
              </summary>
              <div className="tidal-news__entry-body">
                <p>{story.body}</p>
                <a href={story.href}>{story.link}</a>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

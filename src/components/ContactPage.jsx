import React, { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { profile } from "../data/site";
import "../field-pages.css";

function ContactEmail() {
  const [status, setStatus] = useState("idle");
  const reset = useRef(null);
  const email = useRef(null);

  useEffect(() => () => clearTimeout(reset.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus("copied");
    } catch {
      const selection = window.getSelection();
      if (selection && email.current) {
        const range = document.createRange();
        range.selectNodeContents(email.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setStatus("manual");
    }
    clearTimeout(reset.current);
    reset.current = setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <div className="contact-email">
      <a href={`mailto:${profile.email}`}>
        <Mail size={18} aria-hidden="true" />
        <span ref={email}>{profile.email}</span>
      </a>
      <button type="button" onClick={copyEmail} aria-label="Copy email address">
        {status === "copied" ? (
          <Check size={15} aria-hidden="true" />
        ) : (
          <Copy size={15} aria-hidden="true" />
        )}
        {status === "copied" ? "Copied" : "Copy"}
      </button>
      <span className="contact-email__status" role="status">
        {status === "copied" ? (
          <span className="sr-only">Email address copied.</span>
        ) : status === "manual" ? (
          "Copy the selected email address."
        ) : (
          ""
        )}
      </span>
    </div>
  );
}

export default function ContactPage() {
  return (
    <section id="contact" className="contact-page" aria-labelledby="contact-heading">
      <div className="wrap contact-page__spread">
        <div className="contact-page__portrait">
          <img src="/assets/headshot.jpeg" width="1894" height="2048" alt="Ankit Upadhyay" />
        </div>
        <div className="contact-page__copy">
          <h1 id="contact-heading">
            Get in <em>touch.</em>
          </h1>
          <p className="contact-page__lead">
            Always glad to connect on wildlife computer vision, foundation models, research
            collaborations, and internships.
          </p>
          <ContactEmail />
          <nav className="contact-page__profiles" aria-label="Research and professional profiles">
            {profile.socials.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </nav>
          <p className="contact-page__support">{profile.support}</p>
        </div>
      </div>
    </section>
  );
}

import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer
      className="border-t py-8"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Ankit Upadhyay. Built with Next.js.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/AnkitKUpadhyay"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-opacity hover:opacity-60"
            style={{ color: "var(--text-muted)" }}
          >
            <GithubIcon size={16} />
          </a>
          <a
            href="https://linkedin.com/in/ankitkupadhyay"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-opacity hover:opacity-60"
            style={{ color: "var(--text-muted)" }}
          >
            <LinkedinIcon size={16} />
          </a>
          <a
            href="mailto:upadha2@rpi.edu"
            aria-label="Email"
            className="transition-opacity hover:opacity-60"
            style={{ color: "var(--text-muted)" }}
          >
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}

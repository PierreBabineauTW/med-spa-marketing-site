import { press } from "@/lib/upkeepmedspa-data";
import { cn } from "@/lib/utils";

/**
 * "As Seen In" press bar — six publication wordmarks.
 *
 * Layout, type and colour all come from the ported sheet (imported unlayered
 * from src/app/globals.css): `.section--tight`, `.container`, `.eyebrow`,
 * `.press-bar`, `.press-bar__item` and the `.fade-in` scroll-driven reveal.
 * The only inline styles are the two overrides present on the live page.
 *
 * The wordmarks are text, not links or logo images. Italic alternates — the
 * live page italicises odd-indexed names (Vogue, Byrdie, Cosmopolitan) only.
 */
export function PressBar() {
  return (
    <section
      className="section--tight"
      aria-label="Press mentions"
      style={{ paddingBlock: "var(--space-10)" }}
    >
      <div className="container">
        <p
          className="eyebrow text-center mb-6"
          style={{ color: "var(--color-text-faint)" }}
        >
          {press.eyebrow}
        </p>
        <div className="press-bar fade-in">
          {press.items.map((item, index) => (
            <span
              key={item}
              className={cn("press-bar__item", index % 2 === 1 && "italic")}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

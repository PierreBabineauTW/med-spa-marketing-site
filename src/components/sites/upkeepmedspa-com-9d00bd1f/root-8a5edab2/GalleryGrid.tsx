"use client";

import { useCallback, useEffect, useState } from "react";

import { content } from "@/config/content";

/**
 * GalleryGrid — the reference site's own `.gallery-filters` / `.gallery-grid` /
 * `.gallery-card` / `.lightbox` styles (ported in upkeep.css).
 *
 * INTERACTION MODEL: click-driven category filter, plus a keyboard-operable
 * lightbox. No scroll driving, no timers.
 *
 * Accessibility notes: the filter is a real button group with
 * `aria-pressed`; the lightbox is a labelled dialog that closes on Escape and
 * on backdrop click, traps nothing but restores focus to the card that opened
 * it, and each card is reachable by keyboard.
 */
export function GalleryGrid() {
  const [category, setCategory] = useState<string>(content.galleryCategories[0]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [lastFocus, setLastFocus] = useState<HTMLElement | null>(null);

  const items = category === content.galleryCategories[0]
    ? content.gallery
    : content.gallery.filter((g) => g.category === category);

  const close = useCallback(() => {
    setOpenIndex(null);
    // return focus to the card that opened the lightbox
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }, [lastFocus]);

  const step = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <div className="gallery-filters" role="group" aria-label="Filter gallery by category">
        {content.galleryCategories.map((c) => {
          const isActive = c === category;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={isActive}
              className={`gallery-filter${isActive ? " gallery-filter--active" : ""}`}
              onClick={() => {
                setCategory(c);
                setOpenIndex(null);
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="gallery-grid">
        {items.map((item, i) => (
          <button
            key={`${item.src}-${i}`}
            type="button"
            className="gallery-card"
            onClick={(e) => {
              setLastFocus(e.currentTarget);
              setOpenIndex(i);
            }}
          >
            <span className="gallery-card__image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" />
            </span>
            <span className="gallery-card__info">
              <span className="gallery-card__tag">{item.category}</span>
              <span className="gallery-card__title">{item.title}</span>
              <span className="gallery-card__desc">{item.caption}</span>
            </span>
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="lightbox lightbox--open"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <button type="button" className="lightbox__close" aria-label="Close gallery" onClick={close}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Previous image" onClick={() => step(-1)}>
            <svg viewBox="0 0 10 6" width="18" height="11" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 1L5 5l-4-4" />
            </svg>
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Next image" onClick={() => step(1)}>
            <svg viewBox="0 0 10 6" width="18" height="11" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l4 4 4-4" />
            </svg>
          </button>

          <div className="lightbox__content">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="lightbox__img" src={active.src} alt={active.alt} />
            <p className="lightbox__caption">
              {active.title} — {active.caption}
            </p>
            <p className="lightbox__counter">
              {openIndex! + 1} / {items.length}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

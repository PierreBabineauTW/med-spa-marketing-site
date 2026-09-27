"use client";

/**
 * Full-screen mobile navigation overlay for the UPKEEP Med Spa home page clone.
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * Ported verbatim from the live site's markup. All visual styling comes from the
 * ported stylesheet (`upkeep.css`) via the class names below — this file adds no
 * CSS. The only behaviour is the `mobile-menu--open` class toggle plus closing on
 * Escape / link activation, which is what the source does.
 */

import { useEffect } from "react";

import { CloseIcon } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons";
import { BOOKING_URL, mobileMenu } from "@/lib/upkeepmedspa-data";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className={cn("mobile-menu", open && "mobile-menu--open")}
      aria-label="Mobile navigation"
      aria-hidden={!open}
    >
      <button
        type="button"
        className="mobile-menu__close"
        aria-label="Close menu"
        onClick={onClose}
      >
        <CloseIcon width={24} height={24} />
      </button>

      {mobileMenu.links.map((link) => (
        <a
          key={link.label}
          className="mobile-menu__link"
          href={link.href}
          onClick={onClose}
        >
          {link.label}
        </a>
      ))}

      <a
        className="btn btn--accent"
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
      >
        {mobileMenu.book.label}
      </a>
    </div>
  );
}

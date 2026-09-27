/**
 * SVGs extracted verbatim from https://upkeepmedspa.com/ (home page).
 * site-key: upkeepmedspa-com-9d00bd1f
 *
 * Source of truth: docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2/extracted/svgs.json
 * The target draws its icons with `fill="none" stroke="currentColor"`, so every
 * icon inherits colour from CSS — the props are kept to match.
 */

type IconProps = React.SVGProps<SVGSVGElement>;

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M1 1l4 4 4-4" />
    </svg>
  );
}

export function HamburgerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function ScrollArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <path d="M8 4v16M4 16l4 4 4-4" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43V13.3a8.16 8.16 0 004.58 1.4v-3.44a4.85 4.85 0 01-1-.1V6.69h2z" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

export function AccessibilityIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="5.4" r="1.6" fill="currentColor" />
      <path d="M5.5 8.5 L18.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M9.5 8.5 L8 18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M14.5 8.5 L16 18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M9.2 12 L14.8 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

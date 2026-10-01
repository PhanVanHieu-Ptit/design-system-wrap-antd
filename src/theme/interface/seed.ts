/**
 * Layer 1 — Seed Tokens.
 *
 * The smallest set of decisions a designer makes ("brand color is blue, base font is 14px").
 * Everything else in the system is *derived* from these by an algorithm, so changing one seed
 * re-themes the whole library coherently.
 */
export interface SeedToken {
  // ---- Brand & functional colors (each expands to a 10-step palette)
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;

  // ---- Typography
  fontFamily: string;
  /** Base font size in px. Heading/small sizes scale from it. */
  fontSize: number;

  // ---- Shape
  /** Base border radius in px (6 -> XS 2 / SM 4 / base 6 / LG 8). */
  borderRadius: number;
  lineWidth: number;
  lineType: string;

  // ---- Spacing: size(n) = sizeUnit * n, with sizeStep used for the larger steps
  sizeUnit: number;
  sizeStep: number;

  // ---- Controls
  /** Height of a default (middle) control in px. */
  controlHeight: number;

  // ---- Motion
  motionUnit: number;
  motionBase: number;
  /** Disable all transitions when false. */
  motion: boolean;
}

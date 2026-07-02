/**
 * Scale layout px tuned at 480px invitation width across viewports.
 * Requires --inv-ratio on :root (see style.css).
 */
export function rpx(value) {
  if (value == null || value === '') return value
  return String(value).replace(
    /(-?\d+(?:\.\d+)?)px/g,
    'calc($1px * var(--inv-ratio))',
  )
}

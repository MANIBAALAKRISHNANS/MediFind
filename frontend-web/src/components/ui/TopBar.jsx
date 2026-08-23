/**
 * iOS-style navigation bar.
 *
 * @param {string}    title       – centered title text
 * @param {ReactNode} leftAction  – node placed on the left (back button, menu, …)
 * @param {ReactNode} rightAction – node placed on the right (action icon, button, …)
 * @param {boolean}   transparent – remove glass background (for hero sections)
 */
export default function TopBar({
  title,
  leftAction,
  rightAction,
  transparent = false,
}) {
  return (
    <header
      className={[
        'sticky top-0 z-40 safe-top',
        transparent ? 'bg-transparent' : 'glass-bar',
      ].join(' ')}
    >
      <div className="relative flex items-center justify-between h-14 px-4">
        {/* Left slot */}
        <div className="flex items-center min-w-[56px]">
          {leftAction}
        </div>

        {/* Centered title — absolutely positioned to stay truly centred */}
        {title && (
          <span className="absolute inset-x-0 text-center font-semibold text-[17px] text-ios-label pointer-events-none truncate px-20">
            {title}
          </span>
        )}

        {/* Right slot */}
        <div className="flex items-center justify-end min-w-[56px]">
          {rightAction}
        </div>
      </div>
    </header>
  )
}

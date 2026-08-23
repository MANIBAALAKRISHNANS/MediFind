import { forwardRef } from 'react'

/**
 * iOS-style labelled text input.
 *
 * @param {string}    label        – label shown above the field
 * @param {string}    error        – error message shown below (red)
 * @param {ReactNode} icon         – icon placed on the left inside the input
 * @param {ReactNode} rightElement – element placed on the right (e.g. password toggle)
 */
const Input = forwardRef(function Input(
  { label, error, icon, rightElement, className = '', ...rest },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-ios-gray px-1">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-ios-gray pointer-events-none flex items-center">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          className={[
            'ios-input',
            icon          ? 'pl-10'  : '',
            rightElement  ? 'pr-11'  : '',
            error         ? 'ring-2 ring-ios-red/40' : '',
            className,
          ].join(' ')}
          {...rest}
        />

        {rightElement && (
          <span className="absolute right-3 flex items-center">
            {rightElement}
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-ios-red px-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input

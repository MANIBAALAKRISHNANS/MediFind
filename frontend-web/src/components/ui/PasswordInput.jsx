import { useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Input from './Input.jsx'

/**
 * Password input with show / hide toggle.
 * Accepts the same props as Input (except `type` and `rightElement`).
 */
const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false)

  const toggle = (
    <button
      type="button"
      onClick={() => setVisible((v) => !v)}
      className="text-ios-gray hover:text-ios-secondLabel transition-colors p-0.5"
      tabIndex={-1}
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      {visible
        ? <EyeOff size={18} strokeWidth={1.75} />
        : <Eye    size={18} strokeWidth={1.75} />
      }
    </button>
  )

  return (
    <Input
      ref={ref}
      type={visible ? 'text' : 'password'}
      rightElement={toggle}
      {...props}
    />
  )
})

export default PasswordInput

import BottomSheet from './BottomSheet.jsx'
import Button from './Button.jsx'

/**
 * Confirmation dialog built on top of BottomSheet.
 *
 * @param {boolean}  open
 * @param {function} onConfirm  – called when the user confirms
 * @param {function} onCancel   – called on cancel / close
 * @param {string}   title
 * @param {string}   message
 * @param {boolean}  danger     – uses red confirm button when true
 * @param {string}   confirmLabel  – defaults to "Confirm"
 * @param {string}   cancelLabel   – defaults to "Cancel"
 */
export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title        = 'Are you sure?',
  message,
  danger       = false,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
}) {
  return (
    <BottomSheet open={open} onClose={onCancel} title={title}>
      {message && (
        <p className="text-ios-gray text-[15px] leading-relaxed mb-6">
          {message}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <Button
          variant={danger ? 'danger' : 'primary'}
          className="w-full"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>

        <Button
          variant="secondary"
          className="w-full"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
      </div>
    </BottomSheet>
  )
}

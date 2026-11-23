import { useMemo } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { getFingerForChar } from '../../utils/keyboardLayouts'
import VirtualKeyboard from '../keyboard/VirtualKeyboard'
import FingerGuide from '../keyboard/FingerGuide'
import HandGuide from '../keyboard/HandGuide'

/**
 * Grouping of the visual keyboard helpers. Used below the typing surface and
 * in the hero demo.
 */
function KeyboardPanel({
  nextChar = null,
  errorKey = null,
  pressed = new Set(),
  compact = false,
  className = '',
}) {
  const { settings } = useSettings()
  const finger = useMemo(
    () => (nextChar ? getFingerForChar(nextChar, settings.layout) : null),
    [nextChar, settings.layout]
  )

  return (
    <div className={`keyboard-panel ${className}`}>
      <VirtualKeyboard
        layout={settings.layout}
        nextChar={nextChar}
        errorKey={errorKey}
        pressed={pressed}
        showFingers={settings.showHands}
        showHint={!compact}
      />

      {!compact && settings.showHands && (
        <>
          <FingerGuide activeFinger={finger} nextChar={nextChar} layout={settings.layout} />
          <HandGuide activeFinger={finger} />
        </>
      )}
    </div>
  )
}

export default KeyboardPanel

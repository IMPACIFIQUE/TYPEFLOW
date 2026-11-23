import {
  Award,
  BadgeCheck,
  BookOpen,
  CalendarCheck,
  ClipboardCheck,
  Clock,
  Code2,
  Crown,
  Flame,
  Gamepad2,
  Gauge,
  GraduationCap,
  Heart,
  Hourglass,
  Keyboard,
  Medal,
  MousePointerClick,
  Repeat,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Type,
  Wind,
  Zap,
  Crosshair,
} from 'lucide-react'

const ICON_MAP = {
  keyboard: Keyboard,
  flame: Flame,
  repeat: Repeat,
  medal: Medal,
  gauge: Gauge,
  zap: Zap,
  rocket: Rocket,
  wind: Wind,
  crown: Crown,
  target: Target,
  crosshair: Crosshair,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  'calendar-check': CalendarCheck,
  'calendar-heart': Heart,
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  award: Award,
  type: Type,
  trophy: Trophy,
  clock: Clock,
  hourglass: Hourglass,
  'clipboard-check': ClipboardCheck,
  'gamepad-2': Gamepad2,
  'badge-check': BadgeCheck,
  timer: Timer,
  code: Code2,
  click: MousePointerClick,
  heart: Heart,
}

/**
 * Renders a named Lucide icon. Used for achievement and feature metadata that
 * is stored as strings in data files.
 */
function Icon({ name, size = 18, strokeWidth = 2, ...props }) {
  const Component = ICON_MAP[name] || Sparkles
  return <Component size={size} strokeWidth={strokeWidth} {...props} />
}

export default Icon

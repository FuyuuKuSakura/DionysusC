import type { Theme } from '@/types/protocol'

export const DEFAULT_THEME: Theme = {
  id: 'paseo_dark',
  name: 'Paseo 暗色',
  mode: 'dark',
  fonts: {
    body: '"Inter", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
    code: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
  },
  colors: {
    primary: '#6366f1',
    primaryHover: '#818cf8',
    accent: '#8b5cf6',
    background: '#0a0a0b',
    chatBackground: '#0f0f11',
    userBubble: '#6366f1',
    agentBubbleLight: '#f5f5f7',
    agentBubbleDark: '#141416',
    textPrimaryLight: '#1d1d1f',
    textPrimaryDark: '#f5f5f7',
    textSecondary: '#9ca3af',
    system: '#6b7280',
    danger: '#ef4444',
    success: '#22c55e',
    codeBackgroundLight: '#f4f4f5',
    codeBackgroundDark: '#0c0c0e',
    borderLight: '#e5e5e7',
    borderDark: 'rgba(255, 255, 255, 0.06)',
  },
  assets: {
    manifestThemeColor: '#0a0a0b',
    manifestBackgroundColor: '#0a0a0b',
  },
}

export function isDarkMode(theme: Partial<Theme>): boolean {
  if (theme.mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return theme.mode === 'dark'
}

export function applyTheme(theme: Partial<Theme> | Theme): void {
  const fullTheme = mergeTheme(DEFAULT_THEME, theme)
  const root = document.documentElement
  const dark = isDarkMode(fullTheme)

  const cssVars: Record<string, string> = {
    '--elaw-primary': fullTheme.colors.primary,
    '--elaw-primary-hover': fullTheme.colors.primaryHover,
    '--elaw-accent': fullTheme.colors.accent,
    '--elaw-background': fullTheme.colors.background,
    '--elaw-chat-bg': fullTheme.colors.chatBackground,
    '--elaw-user-bubble': fullTheme.colors.userBubble,
    '--elaw-agent-bubble': dark
      ? fullTheme.colors.agentBubbleDark
      : fullTheme.colors.agentBubbleLight,
    '--elaw-text-primary': dark
      ? fullTheme.colors.textPrimaryDark
      : fullTheme.colors.textPrimaryLight,
    '--elaw-text-secondary': fullTheme.colors.textSecondary,
    '--elaw-system': fullTheme.colors.system,
    '--elaw-danger': fullTheme.colors.danger,
    '--elaw-success': fullTheme.colors.success,
    '--elaw-code-bg': dark
      ? fullTheme.colors.codeBackgroundDark
      : fullTheme.colors.codeBackgroundLight,
    '--elaw-border': dark
      ? fullTheme.colors.borderDark
      : fullTheme.colors.borderLight,
    '--elaw-panel-bg': dark ? 'rgba(20, 20, 22, 0.75)' : 'rgba(255,255,255,0.8)',
    '--elaw-subtle-border': dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    '--elaw-status-online': fullTheme.colors.success,
    '--elaw-status-busy': '#f59e0b',
    '--elaw-status-offline': fullTheme.colors.danger,
    '--elaw-font-body': fullTheme.fonts.body,
    '--elaw-font-code': fullTheme.fonts.code,
  }

  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  root.setAttribute('data-theme-mode', dark ? 'dark' : 'light')
  root.setAttribute('data-theme-id', fullTheme.id)

  // Update manifest theme color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', fullTheme.assets.manifestThemeColor)
  }
}

export function mergeTheme(base: Theme, override: Partial<Theme>): Theme {
  return {
    ...base,
    ...override,
    colors: {
      ...base.colors,
      ...override.colors,
    },
    fonts: {
      ...base.fonts,
      ...override.fonts,
    },
    assets: {
      ...base.assets,
      ...override.assets,
    },
  }
}

export async function loadTheme(themeId: string): Promise<Theme> {
  try {
    const res = await fetch(`/api/themes/${themeId}.json`)
    if (!res.ok) throw new Error(`Failed to load theme ${themeId}`)
    return (await res.json()) as Theme
  } catch {
    return DEFAULT_THEME
  }
}

export async function loadAllThemes(): Promise<Theme[]> {
  try {
    const res = await fetch('/api/themes')
    if (!res.ok) throw new Error('Failed to load themes')
    return (await res.json()) as Theme[]
  } catch {
    return [DEFAULT_THEME]
  }
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FontSize = 'small' | 'default' | 'large'

interface SettingsState {
  fontSize: FontSize
  live2dEnabled: boolean
  ttsEnabled: boolean
  compactMode: boolean
  wallpaperUrl: string
  wallpaperOpacity: number
  wallpaperBlur: number
  wallpaperBrightness: number

  setFontSize: (value: FontSize) => void
  setLive2dEnabled: (value: boolean) => void
  setTtsEnabled: (value: boolean) => void
  setCompactMode: (value: boolean) => void
  setWallpaperUrl: (value: string) => void
  setWallpaperOpacity: (value: number) => void
  setWallpaperBlur: (value: number) => void
  setWallpaperBrightness: (value: number) => void
  resetWallpaper: () => void
}

const DEFAULT_WALLPAPER_OPACITY = 0.15
const DEFAULT_WALLPAPER_BLUR = 8
const DEFAULT_WALLPAPER_BRIGHTNESS = 0.7

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontSize: 'default',
      live2dEnabled: true,
      ttsEnabled: false,
      compactMode: false,
      wallpaperUrl: '',
      wallpaperOpacity: DEFAULT_WALLPAPER_OPACITY,
      wallpaperBlur: DEFAULT_WALLPAPER_BLUR,
      wallpaperBrightness: DEFAULT_WALLPAPER_BRIGHTNESS,
      setFontSize: (value) => set({ fontSize: value }),
      setLive2dEnabled: (value) => set({ live2dEnabled: value }),
      setTtsEnabled: (value) => set({ ttsEnabled: value }),
      setCompactMode: (value) => set({ compactMode: value }),
      setWallpaperUrl: (value) => set({ wallpaperUrl: value }),
      setWallpaperOpacity: (value) => set({ wallpaperOpacity: value }),
      setWallpaperBlur: (value) => set({ wallpaperBlur: value }),
      setWallpaperBrightness: (value) => set({ wallpaperBrightness: value }),
      resetWallpaper: () =>
        set({
          wallpaperUrl: '',
          wallpaperOpacity: DEFAULT_WALLPAPER_OPACITY,
          wallpaperBlur: DEFAULT_WALLPAPER_BLUR,
          wallpaperBrightness: DEFAULT_WALLPAPER_BRIGHTNESS,
        }),
    }),
    {
      name: 'dionysus-settings',
    },
  ),
)

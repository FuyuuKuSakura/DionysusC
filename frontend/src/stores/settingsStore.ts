import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type StylePreset = 'cel' | 'flat' | 'contrast'
export type FontSize = 'small' | 'default' | 'large'

interface SettingsState {
  live2dEnabled: boolean
  ttsEnabled: boolean
  stylePreset: StylePreset
  fontSize: FontSize
  compactMode: boolean
  setLive2dEnabled: (value: boolean) => void
  setTtsEnabled: (value: boolean) => void
  setStylePreset: (value: StylePreset) => void
  setFontSize: (value: FontSize) => void
  setCompactMode: (value: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      live2dEnabled: true,
      ttsEnabled: false,
      stylePreset: 'cel',
      fontSize: 'default',
      compactMode: false,
      setLive2dEnabled: (value) => set({ live2dEnabled: value }),
      setTtsEnabled: (value) => set({ ttsEnabled: value }),
      setStylePreset: (value) => set({ stylePreset: value }),
      setFontSize: (value) => set({ fontSize: value }),
      setCompactMode: (value) => set({ compactMode: value }),
    }),
    {
      name: 'elaw-settings',
    },
  ),
)

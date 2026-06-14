import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type StylePreset = 'cel' | 'flat' | 'contrast'
export type FontSize = 'small' | 'default' | 'large'

interface SettingsState {
  live2dEnabled: boolean
  ttsEnabled: boolean
  stylePreset: StylePreset
  fontSize: FontSize
  setLive2dEnabled: (value: boolean) => void
  setTtsEnabled: (value: boolean) => void
  setStylePreset: (value: StylePreset) => void
  setFontSize: (value: FontSize) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      live2dEnabled: true,
      ttsEnabled: false,
      stylePreset: 'cel',
      fontSize: 'default',
      setLive2dEnabled: (value) => set({ live2dEnabled: value }),
      setTtsEnabled: (value) => set({ ttsEnabled: value }),
      setStylePreset: (value) => set({ stylePreset: value }),
      setFontSize: (value) => set({ fontSize: value }),
    }),
    {
      name: 'elaw-settings',
    },
  ),
)

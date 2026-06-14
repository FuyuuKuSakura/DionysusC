/**
 * Shared layout tokens to keep the sidebar, settings panel and right companion
 * panel visually aligned.
 */
export const PANEL_WIDTH = {
  base: 'w-80', // 20rem
  xl: 'xl:w-96', // 24rem
}

export function panelWidthClasses(): string {
  return `${PANEL_WIDTH.base} ${PANEL_WIDTH.xl}`
}

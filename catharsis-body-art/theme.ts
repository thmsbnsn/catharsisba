import {buildLegacyTheme} from 'sanity'

const props = {
  '--font-family-base':
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  '--font-family-monospace':
    '"IBM Plex Mono", "SFMono-Regular", Menlo, Monaco, "Courier New", monospace',
  '--black': '#070607',
  '--white': '#F5F0E6',
  '--gray-base': '#1C1A1C',
  '--gray': '#1C1A1C',
  '--component-bg': '#121112',
  '--component-text-color': '#F5F0E6',
  '--brand-primary': '#CBA774',
  '--focus-color': '#F4D296',
  '--default-button-color': '#1C1A1C',
  '--default-button-primary-color': '#F4D296',
  '--default-button-success-color': '#4CAF7A',
  '--default-button-warning-color': '#F5A623',
  '--default-button-danger-color': '#E45151',
  '--main-navigation-color': '#121112',
  '--main-navigation-color--inverted': '#F5F0E6',
  '--state-info-color': '#CBA774',
  '--state-success-color': '#4CAF7A',
  '--state-warning-color': '#F5A623',
  '--state-danger-color': '#E45151',
} satisfies Partial<Record<string, string>>

export const catharsisTheme = buildLegacyTheme(props)


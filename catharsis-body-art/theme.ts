// theme.ts
import {buildLegacyTheme} from 'sanity'

const props = {
  // Typography
  '--font-family-base': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  '--font-family-monospace': '"IBM Plex Mono", "SFMono-Regular", Menlo, Monaco, "Courier New", monospace',

  // Core Colors
  '--black': '#070607',
  '--white': '#F5F0E6',
  '--gray-base': '#1C1A1C',
  '--gray': '#1C1A1C',

  // Component Backgrounds
  '--component-bg': '#0F0E0F',
  '--component-text-color': '#F5F0E6',

  // Brand Colors (Gold & Wood Palette)
  '--brand-primary': '#CBA774', // Primary gold
  '--brand-secondary': '#704626', // Wood medium
  '--focus-color': '#F4D296', // Gold bright - used for focus states

  // Button Colors
  '--default-button-color': '#1C1A1C',
  '--default-button-primary-color': '#CBA774',
  '--default-button-success-color': '#4CAF7A',
  '--default-button-warning-color': '#F5A623',
  '--default-button-danger-color': '#C1440E', // CTA red

  // Navigation
  '--main-navigation-color': '#0B0A0B',
  '--main-navigation-color--inverted': '#F5F0E6',

  // State Colors
  '--state-info-color': '#CBA774',
  '--state-success-color': '#4CAF7A',
  '--state-warning-color': '#F5A623',
  '--state-danger-color': '#C1440E',

  // Input Fields
  '--input-bg': '#121112',
  '--input-fg': '#F5F0E6',
  '--input-border-color': '#2A2A2C',
  '--input-border-color-hover': '#CBA774',
  '--input-border-color-focus': '#F4D296',

  // Cards & Surfaces
  '--card-bg-color': '#121112',
  '--card-fg-color': '#F5F0E6',
  '--card-border-color': '#2A2A2C',
  '--card-shadow-umbra': 'rgba(7, 6, 7, 0.2)',
  '--card-shadow-penumbra': 'rgba(7, 6, 7, 0.14)',
  '--card-shadow-ambient': 'rgba(7, 6, 7, 0.12)',

  // Accent & Highlights
  '--accent-fg': '#CBA774',
  '--accent-muted-fg': '#9E968C',

  // Toolbar
  '--toolbar-bg': '#0B0A0B',
  '--toolbar-fg': '#F5F0E6',

  // Sidebar
  '--sidebar-bg': '#0F0E0F',
  '--sidebar-fg': '#F5F0E6',

  // Document Panel
  '--document-panel-bg': '#121112',

  // Selection
  '--selectable-item-bg-selected': 'rgba(203, 167, 116, 0.15)',
  '--selectable-item-fg-selected': '#F4D296',

  // Code Editor
  '--code-bg': '#0B0A0B',
  '--code-fg': '#F5F0E6',

  // Syntax Highlighting
  '--code-keyword': '#C1440E',
  '--code-string': '#4CAF7A',
  '--code-attribute': '#CBA774',
  '--code-comment': '#9E968C',
  '--code-operator': '#F4D296',

  // Borders & Dividers
  '--border-color': '#2A2A2C',
  '--hairline-color': 'rgba(255, 255, 255, 0.08)',

  // Shadows (Enhanced depth)
  '--shadow-200': '0 2px 8px rgba(7, 6, 7, 0.25)',
  '--shadow-300': '0 4px 16px rgba(7, 6, 7, 0.3)',
  '--shadow-400': '0 8px 24px rgba(7, 6, 7, 0.35)',
  '--shadow-500': '0 12px 32px rgba(7, 6, 7, 0.4)',

  // Avatar Colors (for document type icons)
  '--avatar-gray-bg': '#1C1A1C',
  '--avatar-blue-bg': '#2F6F74',
  '--avatar-purple-bg': '#704682',
  '--avatar-magenta-bg': '#A84682',
  '--avatar-red-bg': '#C1440E',
  '--avatar-orange-bg': '#F5A623',
  '--avatar-yellow-bg': '#CBA774',
  '--avatar-green-bg': '#4CAF7A',
  '--avatar-cyan-bg': '#4AB3A6',

  // Additional Accent Colors for Category Pills
  '--label-primary-bg': 'rgba(203, 167, 116, 0.15)',
  '--label-primary-fg': '#CBA774',
  '--label-success-bg': 'rgba(76, 175, 122, 0.15)',
  '--label-success-fg': '#4CAF7A',
  '--label-warning-bg': 'rgba(245, 166, 35, 0.15)',
  '--label-warning-fg': '#F5A623',
  '--label-danger-bg': 'rgba(193, 68, 14, 0.15)',
  '--label-danger-fg': '#C1440E',

} satisfies Partial<Record<string, string>>

export const catharsisTheme = buildLegacyTheme(props)


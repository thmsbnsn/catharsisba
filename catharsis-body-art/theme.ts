import {createTheme, studioTheme} from 'sanity'

export const catharsisTheme = createTheme({
  name: 'catharsis-theme',
  title: 'Catharsis Theme',
  base: studioTheme,
  color: {
    primary: {
      base: '#CBA774',
      mid: '#CBA774',
      lightest: '#F4D296',
      darkest: '#8F693C',
      contrast: '#0B0A0B',
    },
    default: {
      base: '#121112',
      mid: '#1C1A1C',
      lightest: '#F5F0E6',
      darkest: '#070607',
      contrast: '#F5F0E6',
    },
    transparent: {
      base: '#121112E6',
      mid: '#141214CC',
      lightest: '#F4D29622',
      darkest: '#080708F2',
    },
    positive: {
      base: '#4CAF7A',
      mid: '#4CAF7A',
      lightest: '#7AD6A7',
      darkest: '#2C6B4C',
      contrast: '#061108',
    },
    caution: {
      base: '#F5A623',
      mid: '#F5A623',
      lightest: '#FFD27A',
      darkest: '#A56308',
      contrast: '#0B0701',
    },
    critical: {
      base: '#E45151',
      mid: '#E45151',
      lightest: '#FF8787',
      darkest: '#8B2E2E',
      contrast: '#130404',
    },
  },
  fonts: {
    heading: {
      family: '"Playfair Display", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      weights: [400, 500, 600, 700],
    },
    body: {
      family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      weights: [400, 500, 600],
    },
    monospace: {
      family: '"IBM Plex Mono", "SFMono-Regular", Menlo, Monaco, "Courier New", monospace',
    },
  },
})


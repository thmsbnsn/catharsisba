// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './schemaTypes'
import {catharsisTheme} from './theme'
import {StudioLogo} from './components/StudioLogo'
import {structure} from './structure'

// Preview URL configuration
const PREVIEW_BASE_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  'http://localhost:4321'

export default defineConfig({
  name: 'default',
  title: 'Catharsis Body Art',

  projectId: 'sld92wg1',
  dataset: 'production',

  plugins: [
    // Custom structure with organized sidebar
    structureTool({
      structure,
      title: 'Content',
      icon: () => '📝'
    }),

    // Live Preview Integration
    // Temporarily simplified to fix duplicate context error
    presentationTool({
      previewUrl: {
        origin: PREVIEW_BASE_URL,
        preview: '/api/preview',
        draftMode: {
          enable: '/api/draft'
        }
      }
    }),

    // Media library plugin for better asset management
    media(),

    // Vision tool for GROQ queries
    visionTool({
      defaultApiVersion: '2024-01-01'
    })
  ],

  theme: catharsisTheme,

  schema: {
    types: schemaTypes,
  },

  // Custom Studio UI Components
  studio: {
    components: {
      logo: StudioLogo,
    }
  },

  // Document Actions - Add preview buttons
  document: {
    actions: (prev, context) => {
      const {schemaType, id} = context

      // Add "Open Live Preview" action for supported types
      const supportedTypes = ['artist', 'blogPost', 'event', 'pageSettings']

      if (supportedTypes.includes(schemaType)) {
        return [
          ...prev,
          {
            name: 'openPreview',
            title: 'Open Live Preview',
            icon: () => '👁️',
            tone: 'primary',
            onHandle: () => {
              const doc = context.draft || context.published
              let path = '/'

              if (schemaType === 'artist' && doc?.slug?.current) {
                path = `/artists/${doc.slug.current}`
              } else if (schemaType === 'blogPost' && doc?.slug?.current) {
                path = `/blog/${doc.slug.current}`
              } else if (schemaType === 'event' && doc?.slug?.current) {
                path = `/events/${doc.slug.current}`
              } else if (schemaType === 'pageSettings' && doc?.route) {
                const routeMap: Record<string, string> = {
                  'index': '/',
                  'artists': '/artists',
                  'events': '/events',
                  'gallery': '/gallery',
                  'our-studio': '/our-studio',
                  'contact': '/contact'
                }
                path = routeMap[doc.route] || `/${doc.route}`
              }

              window.open(`${PREVIEW_BASE_URL}${path}`, '_blank')
            }
          }
        ]
      }

      return prev
    }
  },

  // Form builder customization
  form: {
    // Custom file input to show image previews
    file: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) => assetSource.name !== 'url'
        )
      }
    }
  }
})

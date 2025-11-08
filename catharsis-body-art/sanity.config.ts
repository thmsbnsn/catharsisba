import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {catharsisTheme} from './theme'

export default defineConfig({
  name: 'default',
  title: 'Catharsis Body Art',

  projectId: 's1d92wg1',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  theme: catharsisTheme,

  schema: {
    types: schemaTypes,
  },
})

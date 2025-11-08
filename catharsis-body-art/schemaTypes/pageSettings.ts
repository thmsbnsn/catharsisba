import {defineField, defineType} from 'sanity'

const routeOptions = [
  {title: 'Home', value: 'index'},
  {title: 'Artists', value: 'artists'},
  {title: 'Artist Detail', value: 'artistDetail'},
  {title: 'Events', value: 'events'},
  {title: 'Gallery', value: 'gallery'},
  {title: 'Our Studio', value: 'our-studio'},
  {title: 'Contact', value: 'contact'},
]

export default defineType({
  name: 'pageSettings',
  title: 'Page Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'route',
      title: 'Route',
      type: 'string',
      options: {
        list: routeOptions,
      },
      validation: (Rule) => Rule.required(),
      description:
        'Select the page or layout that these assets apply to. Only one settings document should exist per route.',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'heroMedia',
      title: 'Hero Image / Video',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Primary hero background asset for this page.',
    }),
    defineField({
      name: 'backgroundOverlay',
      title: 'Background Overlay Color',
      type: 'string',
      description: 'Optional hex value for overlaying the hero media (e.g. #00000080).',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(value) ? true : 'Enter a valid hex color.'
        }),
    }),
    defineField({
      name: 'cta',
      title: 'Hero Call to Action',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Destination URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Overrides',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
        }),
        defineField({
          name: 'image',
          title: 'Open Graph Image',
          type: 'image',
          options: {hotspot: true},
        }),
      ],
    }),
  ],
  preview: {
    select: {
      route: 'route',
      title: 'heroTitle',
      media: 'heroMedia',
    },
    prepare({route, title, media}) {
      const match = routeOptions.find((item) => item.value === route)
      return {
        title: match ? match.title : route,
        subtitle: title,
        media,
      }
    },
  },
})


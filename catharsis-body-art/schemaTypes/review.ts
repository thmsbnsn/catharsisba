import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Name of the publication or platform.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Name and title of the reviewer, if available.',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Optional numeric rating (1-5).',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'date',
    }),
    defineField({
      name: 'url',
      title: 'Source URL',
      type: 'url',
      description: 'Link to the full review, if available.',
    }),
  ],
  preview: {
    select: {
      title: 'source',
      subtitle: 'attribution',
    },
  },
})


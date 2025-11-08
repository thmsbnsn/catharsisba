import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
      description: 'Optional end time if the event spans multiple hours or days.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Overrides the default studio address when needed.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'partners',
      title: 'Partners / Sponsors',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      initialValue: false,
      description: 'Featured events appear first on the website.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional hero/cover image for the event page.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
      description: 'Button text such as "RSVP" or "Buy Tickets".',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA URL',
      type: 'url',
      description: 'External link for RSVPs, ticketing, etc.',
      hidden: ({parent}) => !parent?.ctaLabel,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'startDate',
      media: 'heroImage',
      featured: 'featured',
    },
    prepare({title, date, media, featured}) {
      const dateText = date ? new Date(date).toLocaleDateString() : 'Date TBD'
      return {
        title,
        subtitle: featured ? `⭐ ${dateText}` : dateText,
        media,
      }
    },
  },
})


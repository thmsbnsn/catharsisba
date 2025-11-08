import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'studioName',
          title: 'Studio Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (Rule) => Rule.required().email(),
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'mapLink',
          title: 'Google Maps URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Business Hours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
              options: {
                list: [
                  {title: 'Monday', value: 'mon'},
                  {title: 'Tuesday', value: 'tue'},
                  {title: 'Wednesday', value: 'wed'},
                  {title: 'Thursday', value: 'thu'},
                  {title: 'Friday', value: 'fri'},
                  {title: 'Saturday', value: 'sat'},
                  {title: 'Sunday', value: 'sun'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'open',
              title: 'Opens',
              type: 'string',
              placeholder: '11:00 AM',
            }),
            defineField({
              name: 'close',
              title: 'Closes',
              type: 'string',
              placeholder: '8:00 PM',
            }),
            defineField({
              name: 'notes',
              title: 'Notes',
              type: 'string',
              description: 'Optional text such as “By appointment only.”',
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Threads', value: 'threads'},
                  {title: 'X (Twitter)', value: 'twitter'},
                  {title: 'Other', value: 'other'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Overrides the default platform label.',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'isPrimary',
              title: 'Primary Link',
              type: 'boolean',
              initialValue: false,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'announcement',
      title: 'Global Announcement Banner',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable Banner',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'string',
          hidden: ({parent}) => !parent?.enabled,
        }),
        defineField({
          name: 'linkLabel',
          title: 'Link Label',
          type: 'string',
          hidden: ({parent}) => !parent?.enabled,
        }),
        defineField({
          name: 'linkUrl',
          title: 'Link URL',
          type: 'url',
          hidden: ({parent}) => !parent?.enabled,
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Settings',
        subtitle: 'Contact info, hours, and shared assets',
      }
    },
  },
})


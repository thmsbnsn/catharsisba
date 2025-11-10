import {defineField, defineType} from 'sanity'
import CategoryColorInput from '../components/CategoryColorInput'

export default defineType({
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Accent Color',
      type: 'string',
      description: 'Choose a highlight color for this category.',
      components: {
        input: CategoryColorInput,
      },
      validation: (rule) =>
        rule
          .required()
          .regex(/^#(?:[0-9A-Fa-f]{6})$/, {
            name: 'hex color',
            message: 'Enter a hex value such as #CBA774.',
          }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'color',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle ? `Accent: ${subtitle}` : undefined,
      }
    },
  },
})



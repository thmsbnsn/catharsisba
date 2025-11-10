import {Card, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {set, unset} from 'sanity'
import {ChangeEvent, useMemo} from 'react'

type Props = {
  value?: string
  onChange: (event: any) => void
  schemaType: {validation?: unknown}
  readOnly?: boolean
}

function normalizeHex(value: string) {
  if (!value) return ''
  if (value.startsWith('#')) return value.slice(0, 7)
  return `#${value.slice(0, 6)}`
}

export default function CategoryColorInput(props: Props) {
  const {value = '#CBA774', onChange, readOnly} = props
  const hexValue = useMemo(() => normalizeHex(value), [value])

  const handleColorInput = (event: ChangeEvent<HTMLInputElement>) => {
    const next = normalizeHex(event.currentTarget.value || '')
    onChange(next ? set(next.toUpperCase()) : unset())
  }

  const handleTextInput = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.currentTarget.value.trim()
    const formatted = normalizeHex(next.toUpperCase())
    if (!formatted) {
      onChange(unset())
      return
    }
    onChange(set(formatted.includes('#') ? formatted.toUpperCase() : `#${formatted.toUpperCase()}`))
  }

  return (
    <Stack space={4}>
      <Flex gap={3} align="center">
        <input
          type="color"
          value={hexValue || '#CBA774'}
          onChange={handleColorInput}
          disabled={readOnly}
          style={{
            width: '3rem',
            height: '3rem',
            border: 'none',
            background: 'transparent',
            cursor: readOnly ? 'not-allowed' : 'pointer',
          }}
          aria-label="Accent color"
        />
        <TextInput
          value={hexValue.toUpperCase()}
          onChange={handleTextInput}
          readOnly={readOnly}
          placeholder="#CBA774"
        />
      </Flex>
      <Card
        padding={3}
        radius={3}
        style={{
          background: hexValue || '#CBA774',
          color: '#0B0A0B',
          maxWidth: '18rem',
          boxShadow: `0 12px 30px ${hexValue || '#CBA774'}33`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <Text size={2} weight="semibold">
          {hexValue || '#CBA774'}
        </Text>
        <Text size={1}>Blog filter preview</Text>
      </Card>
    </Stack>
  )
}


// components/StudioLogo.tsx
import {Box, Flex, Text} from '@sanity/ui'
import {useColorScheme} from 'sanity'

export function StudioLogo() {
  const {scheme} = useColorScheme()
  
  // Color adapts to theme
  const logoColor = scheme === 'dark' ? '#CBA774' : '#C1440E'
  const textColor = scheme === 'dark' ? '#CBA774' : '#704626'
  const subtextColor = scheme === 'dark' ? '#9E968C' : '#5A4F47'
  
  return (
    <Flex align="center" gap={3} padding={3}>
      {/* Animated Logo */}
      <Box
        style={{
          filter: `drop-shadow(0 4px 16px ${logoColor}40)`,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            display: 'block',
            transition: 'filter 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = `drop-shadow(0 8px 24px ${logoColor}80)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none'
          }}
        >
          {/* Your CC hexagon logo - adapted to be a single path */}
          <path
            d="M400 50 L700 225 L700 575 L400 750 L100 575 L100 225 Z M400 150 L600 262.5 L600 537.5 L400 650 L200 537.5 L200 262.5 Z M300 300 L300 500 L350 530 L350 470 L400 500 L450 470 L450 530 L500 500 L500 300 L450 270 L450 330 L400 300 L350 330 L350 270 Z"
            fill={logoColor}
            style={{
              transition: 'fill 0.3s ease, transform 0.3s ease',
              transformOrigin: 'center'
            }}
          />
        </svg>
      </Box>
      
      {/* Studio Name */}
      <Flex direction="column" gap={1}>
        <Text
          size={2}
          weight="bold"
          style={{
            fontFamily: 'var(--font-family-base)',
            letterSpacing: '0.28em',
            color: textColor,
            transition: 'color 0.3s ease',
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '2px'
          }}
        >
          CATHARSIS
        </Text>
        <Text
          size={1}
          style={{
            fontFamily: 'var(--font-family-base)',
            letterSpacing: '0.38em',
            color: subtextColor,
            transition: 'color 0.3s ease',
            textTransform: 'uppercase',
            lineHeight: 1,
            opacity: 0.85
          }}
        >
          BODY ART
        </Text>
      </Flex>
    </Flex>
  )
}
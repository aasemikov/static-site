/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./custom_theme/**/*.html",
    "./docs/**/*.md",
    "./custom_theme/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            lineHeight: '1.75',
            h1: {
              fontWeight: '700',
              fontSize: '2.25rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '0.5rem'
            },
            h2: {
              fontWeight: '600',
              fontSize: '1.875rem',
              marginTop: '2rem',
              marginBottom: '1rem'
            },
            h3: {
              fontWeight: '600', 
              fontSize: '1.5rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem'
            },
            a: {
              color: '#2563eb',
              textDecoration: 'none',
              '&:hover': {
                color: '#1e40af',
                textDecoration: 'underline'
              }
            },
            code: {
              color: '#1f2937',
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '400'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            blockquote: {
              borderLeftColor: '#3b82f6',
              backgroundColor: '#dbeafe',
              fontStyle: 'italic',
              padding: '0.5rem 1rem'
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
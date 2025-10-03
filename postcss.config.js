module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        'media-query-ranges': true,
        'custom-properties': true,
        'color-function': true
      }
    }),
    require('autoprefixer')({
      grid: true,
      flexbox: true
    }),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true
        }
      }]
    })
  ]
}
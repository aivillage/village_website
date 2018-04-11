module.exports = {
  siteMetadata: {
    title: 'AI Village',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'source serif pro\:400,700',
          'source sans pro\:400,700',
          'material icons',
        ]
      }
    }
  ]
};

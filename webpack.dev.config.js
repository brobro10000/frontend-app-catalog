const path = require('path');
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('webpack-dev', {
  devServer: {
    proxy: [{
      context: ['/atlas'],
      target: 'http://host.docker.internal:8765',
      pathRewrite: { '^/atlas': '' },
      headers: { Host: 'localhost:8765' },
    }, {
      context: ['/courses', '/course', '/personalized', '/saved', '/build', '/learning', '/learn',
        '/api', '/media', '/app.js', '/workspace-ui.js', '/style.css', '/brand-logo.svg',
        '/brand-icon.svg', '/licenses.html', '/legal', '/help'],
      target: 'http://host.docker.internal:8765',
      headers: { Host: 'localhost:8765' },
    }],
  },
  resolve: {
    alias: {
      // Within this app, we can use '@src/foo instead of relative URLs like '../../../foo'
      '@src': path.resolve(__dirname, 'src/'),
    },
    fallback: {
      fs: false,
      constants: false,
    },
  },
});

// Local-only browser resources: OpenAI requests are made by the server.
config.devServer = {
  ...config.devServer,
  headers: {
    ...config.devServer?.headers,
    'Content-Security-Policy': "default-src 'self' http://localhost:* http://127.0.0.1:*; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:*; style-src 'self' 'unsafe-inline' http://localhost:*; img-src 'self' http://localhost:* http://127.0.0.1:* data: blob:; font-src 'self' http://localhost:* data:; connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:*; frame-src 'self' http://localhost:*; object-src 'none'; form-action 'self' http://localhost:*; base-uri 'self'",
  },
};

module.exports = config;

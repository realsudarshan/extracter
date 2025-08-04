// next.config.js
const nextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = 'source-map'; // Better than 'eval' for debugging
    }
    return config;
  },
};

module.exports = nextConfig;

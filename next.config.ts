// next.config.js
const nextConfig = (phase: string, { defaultConfig }: { defaultConfig: any }) => {
  return {
    webpack(config: any, { dev }: { dev: boolean }) {
      if (dev) {
        config.devtool = 'source-map'; // Better than 'eval' for debugging
      }
      return config;
    },
  };
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.plugins.push(
        new webpack.ProvidePlugin({
          global: "global",
        })
      );

      config.resolve.fallback = {
        fs: false,
        stream: false,
        crypto: false,
        os: false,
        readline: false,
        ejs: false,
        assert: require.resolve("assert"),
        path: false,
      };

      return config;
    }

    return config;
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
};

module.exports = withBundleAnalyzer(nextConfig);

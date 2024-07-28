/** @type {import('next').NextConfig} */
import './polyfills.mjs';
import path from 'path';

const nextConfig = {
  images: {
    remotePatterns: [
      {hostname: 'firebasestorage.googleapis.com'}
    ],
  },
  webpack: (config) => {
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: 'empty'
        }
      }

      config.module.rules.push({
        test: /pdf\.worker\.(min\.)?js$/,
        use: 'file-loader',
      });


    }
 config.resolve.alias.canvas = false;
   return config;

}
}

export default nextConfig;

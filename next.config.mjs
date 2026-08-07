import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/prestigeYachtsDetailing' : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isProd ? 'export' : undefined,
  basePath,
  assetPrefix: isProd ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default withNextIntl(nextConfig);

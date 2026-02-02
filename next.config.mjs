import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/prestigeYachtsDetailingTest', // Nombre de tu repositorio
  assetPrefix: '/prestigeYachtsDetailingTest/',
};

export default withNextIntl(nextConfig);

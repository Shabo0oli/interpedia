/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enable static export
    basePath: '/interpedia', // Replace with your GitHub repo name
    assetPrefix: '/interpedia/',
    trailingSlash: true,
};

module.exports = nextConfig

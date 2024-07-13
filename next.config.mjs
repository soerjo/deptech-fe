/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/",
        destination: "/user",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

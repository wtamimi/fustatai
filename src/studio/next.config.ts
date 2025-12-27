import type { NextConfig } from "next";

//const nextConfig: NextConfig = {
  /* config options here */
//};

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/v1/:path*', // Your backend URL
      },
    ];
  },
};

export default nextConfig;

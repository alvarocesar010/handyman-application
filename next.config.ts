/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "storage.googleapis.com" }],
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://dublinerhandyman.local:3000",
    "http://lislock.local:3000",
  ],
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  // أضف هنا أي إعدادات خاصة بك مثل:
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      // أضف هنا أي نطاقات صور أخرى تحتاجها
    ],
  },
 
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
  // ... أي إعدادات أخرى كانت لديك
};

module.exports = nextConfig;

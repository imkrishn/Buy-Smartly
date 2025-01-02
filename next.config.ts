// next.config.js

module.exports = {
  images: {
    domains: ['res.cloudinary.com', 'avatars.githubusercontent.com'],  // Add Cloudinary's domain here
  },
  async headers() {
    return [
      {
        source: '/api/:path*', // Correct pattern to apply headers to all API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://your-frontend-domain.com', // Replace with your frontend URL
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

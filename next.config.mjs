
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'envconfig', '.env.local') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'http',
        hostname: 'youtube_views.png',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'http',
        hostname: 'youtube_subscribers.png',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
        port: '',
      }
    ],
  },
  // You can add more Next.js config options here
};

export default nextConfig;






















// /** @type {import('next').NextConfig} */
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, 'envconfig', '.env.local') });

// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'www.facebook.com',
//         pathname: '**',
//         port: '',
//       },
//       {
//         protocol: 'http',
//         hostname: 'youtube_views.png',
//         pathname: '**',
//         port: '',
//       },
//       {
//         protocol: 'http',
//         hostname: 'youtube_subscribers.png',
//         pathname: '**',
//         port: '',
//       },
//       {
//         protocol: 'https',
//         hostname: 'lh3.googleusercontent.com',
//         pathname: '**',
//         port: '',
//       }
//     ],
//   },
//   // You can add more Next.js config options here
// };

// export default nextConfig;
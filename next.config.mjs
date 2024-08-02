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
    
    ]
    
  ,
  }
};


export default nextConfig;

import React from 'react';
import { addProduct } from '../(actions)/addProducts';

import { isAdmin } from "../utils/auth";
import withAdminAuth from '@/components/withAdminAuth';
import { GetServerSideProps } from 'next';




function AddService() {
  const serviceTypes = [
    'YOUTUBE_VIEWS', 'YOUTUBE_LIKES', 'YOUTUBE_SUBSCRIBERS',
    'FACEBOOK_LIKES', 'FACEBOOK_PAGE_LIKES', 'FACEBOOK_PAGE_FOLLOWERS',
    'INSTAGRAM_FOLLOWERS', 'INSTAGRAM_POST_LIKES', "INSTAGRAM_VIDEO_VIEWS",
    'TWITTER_FOLLOWERS', 'TWITTER_LIKES', 'TWITTER_RETWEETS',
    'TIKTOK_FOLLOWERS', 'TIKTOK_LIKES', 'TIKTOK_VIEWS',
    'LINKEDIN_CONNECTIONS', 'LINKEDIN_POST_ENGAGEMENTS',
    'PINTEREST_FOLLOWERS', 'PINTEREST_PINS', 'PINTEREST_REPINS',
    'TWITCH_FOLLOWERS', 'TWITCH_VIEWS',
    'SPOTIFY_PLAYLIST_FOLLOWERS', 'SPOTIFY_STREAMS',
    'OTHER'
  ];
  
  return (
    
    <div className="container mx-auto px-4 py-12">
    <h1 className="text-4xl font-extrabold text-center mb-12 relative item">
    Add Service
    </h1>
    <div className='max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8'>
    <form className="space-y-6" action={addProduct}>
    <div>
    <label htmlFor="serviceType" className="block mb-2 font-semibold">Service Type</label>
    <select required name="serviceType" id="serviceType" className="select select-bordered w-full">
    <option value="">Select a service type</option>
    {serviceTypes.map((type) => (
      <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
    ))}
    </select>
    </div>
    
    <div>
    <label htmlFor="name" className="block mb-2 font-semibold">Service Name</label>
    <input required id="name" name="name" placeholder="Service Name" type="text" className="input input-bordered w-full" />
    </div>
    
    <div>
    <label htmlFor="socialAccount" className="block mb-2 font-semibold">Social Account</label>
    <input required id="socialAccount" name="socialAccount" placeholder="Social Account" type="text" className="input input-bordered w-full" />
    </div>
    
    <div>
    <label htmlFor="description" className="block mb-2 font-semibold">Service Description</label>
    <textarea id="description" name="description" placeholder="Service Description" className="textarea textarea-bordered w-full h-24"></textarea>
    </div>
    
    <div className="grid grid-cols-3 gap-4">
    <div>
    <label htmlFor="lowPrice" className="block mb-2 font-semibold">Low Price</label>
    <input required id="lowPrice" name="lowPrice" placeholder="Low Price" type="number" step="0.01" min="0" className="input input-bordered w-full" />
    </div>
    <div>
    <label htmlFor="mediumPrice" className="block mb-2 font-semibold">Medium Price</label>
    <input required id="mediumPrice" name="mediumPrice" placeholder="Medium Price" type="number" step="0.01" min="0" className="input input-bordered w-full" />
    </div>
    <div>
    <label htmlFor="highPrice" className="block mb-2 font-semibold">High Price</label>
    <input required id="highPrice" name="highPrice" placeholder="High Price" type="number" step="0.01" min="0" className="input input-bordered w-full" />
    </div>
    </div>
    
    <div>
    <label htmlFor="image" className="block mb-2 font-semibold">Social Media Image</label>
    <input required id="image" name="image" type="file" accept="image/*" className="file-input file-input-bordered w-full" />
    </div>
    
    
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
    <label htmlFor="minQuantity" className="block mb-2 font-semibold">Minimum Quantity</label>
    <input required id="minQuantity" name="minQuantity" placeholder="Minimum Quantity" type="number" min="1" className="input input-bordered w-full" />
    </div>
    <div>
    <label htmlFor="maxQuantity" className="block mb-2 font-semibold">Maximum Quantity</label>
    <input required id="maxQuantity" name="maxQuantity" placeholder="Maximum Quantity" type="number" min="1" className="input input-bordered w-full" />
    </div>
    </div>
    
    <div>
    <label htmlFor="deliveryTime" className="block mb-2 font-semibold">Estimated Delivery Time (hours)</label>
    <input required id="deliveryTime" name="deliveryTime" placeholder="Estimated Delivery Time" type="number" min="1" className="input input-bordered w-full" />
    </div>
    
    <button type="submit" className="btn btn-primary w-full">ADD SERVICE</button>
    </form>
    </div>
    </div>
  )
}

export default AddService;
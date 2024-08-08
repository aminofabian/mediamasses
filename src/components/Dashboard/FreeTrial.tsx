'use client'

import React, { useState, useCallback } from 'react';
import { createFreeTrial } from '@/app/(actions)/createFreeTrial';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ServiceType = {
  YOUTUBE_VIEWS: 'YouTube Views',
  YOUTUBE_LIKES: 'YouTube Likes',
  YOUTUBE_SUBSCRIBERS: 'YouTube Subscribers',
  FACEBOOK_LIKES: 'Facebook Likes',
  FACEBOOK_PAGE_LIKES: 'Facebook Page Likes',
  FACEBOOK_FOLLOWERS: 'Facebook Followers',
  FACEBOOK_PAGE_FOLLOWERS: 'Facebook Page Followers',
  INSTAGRAM_FOLLOWERS: 'Instagram Followers',
  INSTAGRAM_VIDEO_VIEWS: 'Instagram Video Views',
  TWITTER_FOLLOWERS: 'Twitter Followers',
  TWITTER_LIKES: 'Twitter Likes',
  TWITTER_RETWEETS: 'Twitter Retweets',
  TIKTOK_FOLLOWERS: 'TikTok Followers',
  TIKTOK_LIKES: 'TikTok Likes',
  TIKTOK_VIEWS: 'TikTok Views',
  LINKEDIN_CONNECTIONS: 'LinkedIn Connections',
  LINKEDIN_POST_ENGAGEMENTS: 'LinkedIn Post Engagements',
  PINTEREST_FOLLOWERS: 'Pinterest Followers',
  PINTEREST_PINS: 'Pinterest Pins',
  PINTEREST_REPINS: 'Pinterest Repins',
  TWITCH_FOLLOWERS: 'Twitch Followers',
  TWITCH_VIEWS: 'Twitch Views',
  SPOTIFY_PLAYLIST_FOLLOWERS: 'Spotify Playlist Followers',
  SPOTIFY_STREAMS: 'Spotify Streams',
  OTHER: 'Other'
};


type ServiceTypeKeys = keyof typeof ServiceType;

interface FormData {
  link: string;
  serviceType: ServiceTypeKeys | '';
  currentCount: string;
}

interface CreateFreeTrialResult {
  success: boolean;
  error?: string;
  freeTrialId?: number;
  redirect?: boolean;
}


const FreeTrial: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    link: '',
    serviceType: '',
    currentCount: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);
  
  const handleServiceTypeChange = useCallback((value: ServiceTypeKeys) => {
    setFormData(prevState => ({
      ...prevState,
      serviceType: value
    }));
  }, []);
  
  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    
    const formDataToSend = new FormData();
    formDataToSend.append('link', formData.link);
    formDataToSend.append('serviceType', formData.serviceType);
    formDataToSend.append('currentCount', formData.currentCount);
    
    try {
      const result: CreateFreeTrialResult = await createFreeTrial(formDataToSend);
      if (result.success) {
        setSuccess(true);
        setFormData({ link: '', serviceType: '', currentCount: '' });
      } else {
        setError(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  }, [formData]);
  
  return (
    <div className="flex">
    <Dialog>
    <DialogTrigger asChild>
    <button type="button" className="px-8 py-3 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 uppercase">
    Request a Free Trial
    </button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] w-full bg-white rounded-xl shadow-2xl">
    <DialogHeader>
    <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">Request a Free Trial</DialogTitle>
    <DialogDescription className="text-gray-600 mt-2">
    Please provide the following information to request a free trial of our services.
    <p className="mt-2 text-sm font-medium text-blue-600">
    Note: We&apos;ll deliver 100 of any service you request, except for subscribers, where we&apos;ll deliver 20.
    </p>
    </DialogDescription>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="mt-4">
    <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
    <div className="space-y-2">
    <Label htmlFor="link" className="text-sm font-medium text-gray-700">
    Link
    </Label>
    <Input
    id="link"
    name="link"
    value={formData.link}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    placeholder="Enter your social media link"
    />
    </div>
    <div className="space-y-2">
    <Label htmlFor="serviceType" className="text-sm font-medium text-gray-700">
    Service
    </Label>
    <Select 
    value={formData.serviceType}
    onValueChange={handleServiceTypeChange}
    >
    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
    <SelectValue placeholder="Select a service" />
    </SelectTrigger>
    <SelectContent>
    {Object.entries(ServiceType).map(([key, value]) => (
      <SelectItem key={key} value={key}>{value}</SelectItem>
    ))}
    </SelectContent>
    </Select>
    </div>
    <div className="space-y-2">
    <Label htmlFor="currentCount" className="text-sm font-medium text-gray-700">
    Current Count
    </Label>
    <Input
    id="currentCount"
    name="currentCount"
    type="number"
    value={formData.currentCount}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    placeholder="Enter current count"
    />
    </div>
    </div>
    {error && <p className="text-red-500 mt-2">{error}</p>}
    {success && <p className="text-green-500 mt-2">Free trial request submitted successfully!</p>}
    <DialogFooter className="mt-6">
    <Button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
    Submit Request
    </Button>
    </DialogFooter>
    </form>
    </DialogContent>
    </Dialog>
    </div>
  )
}

export default React.memo(FreeTrial);
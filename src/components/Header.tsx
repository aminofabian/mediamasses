'use client'

import React from 'react';
import UserMenu from './useMenu';
import { useSession } from "next-auth/react";
import { Users } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/CardContext';

export function Header() {
  const { data: session } = useSession();
  const { cartItems, cartTotal } = useCart();
  const USD_TO_KES_RATE = 130; // Make sure this matches the rate used in other parts of your app
  
  
  
  return (
    <div className="navbar bg-base-100 rounded-lg">
    <div className="flex-1 rounded-lg">
    <Link href='/' className="btn btn-ghost text-xl flex items-center gap-2 mr-5">
    <Users className="w-12 h-12 text-orange-500 font-extrabold" />
    <span className="font-bold">
    <span className="text-red-500">M</span>
    <span className="text-blue-500">E</span>
    <span className="text-green-500">D</span>
    <span className="text-yellow-500">I</span>
    <span className="text-purple-500">A</span>
    <span className="text-pink-500">M</span>
    <span className="text-indigo-500">A</span>
    <span className="text-orange-500">S</span>
    <span className="text-teal-500">S</span>
    <span className="text-cyan-500">E</span>
    <span className="text-lime-500">S</span>
    </span>
    </Link>
    <span className='hidden sm:block text-xs font-light'>Welcome aboard, {session?.user?.name || "Guest"}</span>
    </div>
    <div className="flex-none ml-5">
    <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
    <div className="indicator">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    >
    <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
    </svg>
    <span className="badge badge-sm indicator-item">{cartItems.length}</span>
    </div>
    </div>
    <div
    tabIndex={0}
    className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
    >
    <div className="card-body">
    <span className="text-lg font-bold">{cartItems.length} Items</span>
    <span className="text-info">Subtotal: KES{(cartTotal/1000).toFixed(2)}</span>
    <span className="text-info">Subtotal: US${(cartTotal/130000).toFixed(2)}</span>
    <div className="card-actions">
    <Link href="/cart" className="btn btn-primary btn-block">View cart</Link>
    </div>
    </div>
    </div>
    </div>
    <UserMenu />
    </div>
    </div>
  )
}
'use client'

import React from 'react';
import UserMenu from './useMenu';
import { useSession } from "next-auth/react";
import { Cable, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/CardContext';

export function Header() {
  const { data: session } = useSession();
  const { cartItems, cartTotal } = useCart();
  const USD_TO_KES_RATE = 130;
  
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const serviceType = cartItems.length > 0 ? cartItems[0].name.replace(/Buy/g, ' ') : 'Items';
  
  
  
  return (
    <div className="navbar bg-base-100 rounded-lg">
    <div className="flex-1 rounded-lg p-5">
    <Link href='/' className="btn btn-ghost text-xl flex items-center mr-5">
    <Cable className="w-12 h-12 text-orange-500 font-bold" />
    <span className="font-bold uppercase">
    <span className="text-red-500 font-bold">U</span>
    <span className="text-blue-500">N</span>
    <span className="text-green-500">S</span>
    <span className="text-yellow-500">P</span>
    <span className="text-purple-500">A</span>
    <span className="text-pink-500 font-extrabold">M</span>
    <span className="text-indigo-500 font-extrabold">M</span>
    <span className="text-orange-500 font-extrabold">Y</span>
    </span>
    </Link>
    <span className='hidden sm:block text-xs capitalize font-light'>
    Welcome aboard, {
      (session?.user?.name || "Guest").split('').map((char, index) => (
        <span
        key={index}
        className={`animate-accordion-up`}
        style={{
          color: `hsl(${index * 360 / (session?.user?.name || "Guest").length}, 70%, 60%)`,
          animationDelay: `${index * 0.1}s`
        }}
        >
        {char}
        </span>
      ))
    }
    </span>
    </div>
    <div className="flex-none ml-5">
    <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
    <div className="indicator">
    <ShoppingCart className="h-5 w-5" />
    <span className="badge badge-sm indicator-item">{totalQuantity}</span>
    </div>
    </div>
    <div
    tabIndex={0}
    className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
    >
    <div className="card-body">
    <span className="text-lg font-bold">{totalQuantity} {serviceType}</span>
    <span className="text-info">Subtotal: KES {(cartTotal / 1000).toFixed(2)}</span>
    <span className="text-info">Subtotal: US$ {(cartTotal / 130000).toFixed(2)}</span>
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


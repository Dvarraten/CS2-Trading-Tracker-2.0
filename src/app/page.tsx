"use client"; // Berättar för Next.js att detta är en interaktiv komponent

import { useEffect, useState } from 'react';

// Vi skapar en mall (interface) för hur ett item ser ut i koden
interface SteamItem {
  assetid: string;
  name: string;
  hash_name: string;
  image: string;
  color: string;
  type: string;
  rarity: string;
}

export default function Home() {
  const [items, setItems] = useState<SteamItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hämtar data från vår egen API-route
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load inventory:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <p className="text-xl animate-pulse">Loading your skins...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
          CS2 PORTFOLIO 2.0
        </h1>
        <p className="text-slate-400 font-mono text-sm">
          Connected to Steam ID: 76561198133541811
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((item) => (
          <div 
            key={item.assetid} 
            className="group bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-all duration-300 hover:scale-[1.02] shadow-xl"
          >
            {/* Skin Image */}
            <div className="relative aspect-square mb-4 bg-slate-800/50 rounded-lg overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="object-contain w-full h-full p-2 drop-shadow-2xl"
              />
            </div>

            {/* Skin Details */}
            <div className="space-y-1">
              <p 
                className="text-[10px] uppercase tracking-widest font-bold opacity-80"
                style={{ color: item.color }}
              >
                {item.rarity}
              </p>
              <h3 className="font-bold text-sm leading-tight group-hover:text-blue-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-[10px] text-slate-500 truncate italic">
                {item.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
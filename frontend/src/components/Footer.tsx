import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, RefreshCw, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-amber-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Farm-Fresh Fast Delivery</h4>
              <p className="text-xs text-stone-400">Harvested & dispatched within 24h</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Naturally Ripened</h4>
              <p className="text-xs text-stone-400">Zero carbide & zero harmful chemicals</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/10 text-green-400 rounded-2xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Freshness Guarantee</h4>
              <p className="text-xs text-stone-400">100% satisfaction or instant replacement</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-2xl">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Direct Orchard Sourcing</h4>
              <p className="text-xs text-stone-400">Supporting ethical farmer groves</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🥭</span>
              <span className="text-2xl font-black text-white tracking-tight">PSN Farm</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Exclusively dedicated to the world's two finest tropical treasures: Certified GI-tagged Mangoes & rich Red Lady Papayas.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Our Fruits</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/mango" className="hover:text-amber-400 transition-colors">
                  Ratnagiri Alphonso Mangoes
                </Link>
              </li>
              <li>
                <Link to="/mango" className="hover:text-amber-400 transition-colors">
                  Gir Kesar Royal Saffron
                </Link>
              </li>
              <li>
                <Link to="/papaya" className="hover:text-orange-400 transition-colors">
                  Red Lady Sweet Papaya
                </Link>
              </li>
              <li>
                <Link to="/papaya" className="hover:text-orange-400 transition-colors">
                  Solo Sunrise Hawaiian Papaya
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-amber-400 transition-colors">
                  All Seasonal Harvests
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  Our Orchard Story
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-amber-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Help & Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors">
                  Customer Account
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Orchard Contacts</h5>
            <div className="flex items-start space-x-3 text-sm text-stone-400">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>Orchard Valley, Agro Farms, Ratnagiri & Karnataka, India</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-stone-400">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-stone-400">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span>support@mangopapaya.store</span>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} PSN Farm Pure Mango & Papaya Store. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center space-x-1">
            <span>Handpicked with</span>
            <span className="text-red-500">♥</span>
            <span>for natural fruit lovers.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

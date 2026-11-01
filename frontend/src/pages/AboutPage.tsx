import React from 'react';
import { Sparkles, Sun, ShieldCheck, Heart, Leaf } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Farm to Fork Philosophy</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
          The Story of PSN Farm
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Founded on a singular belief: The best fruit experience comes from absolute mastery of nature&apos;s two most iconic tropical gifts &mdash; the Mango and the Papaya.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-stone-900">Why Only Two Fruits?</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Most fruit distributors stock dozens of varieties, resulting in extended cold-storage delays, artificial chemical ripening (calcium carbide), and diminished natural sweetness.
          </p>
          <p className="text-xs text-stone-600 leading-relaxed">
            By dedicating 100% of our supply chain, agronomy research, and sorting lines exclusively to Mangoes and Papayas, we achieve unrivaled brix sweetness, zero-carbide tree-ripening, and 24-hour orchard-to-table delivery.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden aspect-video bg-amber-50">
          <img
            src="https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=800&q=80"
            alt="Lush Mango Orchard"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base text-stone-900">Physiological Maturity</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            We never pluck early for shelf life. Fruits stay bathed in sunlight on the branch until optimal sugar content is achieved.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base text-stone-900">Chemical-Free Hay Ripening</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Ripened naturally in traditional sterile rice-straw grass chambers. Zero chemical sprays, gas chambers, or artificial color enhancers.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base text-stone-900">Direct Farmer Grove Support</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Every order directly supports family-owned orchards across Ratnagiri, Girnar, Malihabad, and Karnataka.
          </p>
        </div>
      </div>
    </div>
  );
};

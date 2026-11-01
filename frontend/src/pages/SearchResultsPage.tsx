import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Sparkles, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [searchMode, setSearchMode] = useState<'keyword' | 'semantic'>('keyword');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const res = await api.get('/search', {
          params: { q: query },
        });
        setResults(res.data?.data?.results || []);
        setSearchMode(res.data?.data?.mode || 'keyword');
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Semantic Vector Search Engine</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900">
          Search Results for &ldquo;<span className="text-amber-600">{query}</span>&rdquo;
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-stone-500">
            Found {results.length} fruits matching your search intent.
          </span>
          {searchMode === 'semantic' && (
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Vector AI Matched</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-5 border border-amber-100 animate-pulse space-y-4">
              <div className="aspect-square bg-amber-100/60 rounded-2xl" />
              <div className="h-4 bg-amber-100 rounded w-3/4" />
              <div className="h-3 bg-amber-50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-amber-100 p-8 space-y-4">
          <span className="text-6xl">🔍</span>
          <h3 className="text-xl font-bold text-stone-900">No matching fruits found</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Try searching for terms like &ldquo;sweet breakfast mango&rdquo;, &ldquo;aamras&rdquo;, or &ldquo;vitamin C papaya&rdquo;.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-full shadow-md"
          >
            Explore All Fruits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

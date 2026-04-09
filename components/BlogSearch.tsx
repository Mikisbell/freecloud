'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function BlogSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('q', query.trim());
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const clear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Compact search input for blog page */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative w-64 sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar artículos..."
            className="w-full pl-10 pr-10 py-2 text-sm bg-surface-50 border border-surface-200 rounded-full focus:outline-none focus:ring-2 focus:ring-fc-cyan/30 focus:border-fc-cyan transition-all placeholder:text-surface-400"
          />
          {query && (
            <button
              type="button"
              onClick={clear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <kbd className="hidden sm:inline-flex ml-2 px-2 py-1 text-[10px] font-mono text-surface-400 bg-surface-100 rounded border border-surface-200">
          ⌘K
        </kbd>
      </form>
    </>
  );
}

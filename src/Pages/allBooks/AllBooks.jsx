import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Search, X, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AllBooks = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState('');

  const { data: books = [], isLoading, isError } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await axiosSecure.get('/books');
      return res.data;
    }
  });

  const publishedBooks = books.filter(b => b.status === 'published');
  const displayedBooks = publishedBooks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Spinner className="size-8" /></div>;
  if (isError) return <div className="text-center py-20 text-destructive">Failed to load books.</div>;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Library Collection</h1>
          <p className="text-muted-foreground text-lg">Browse our curated list of books.</p>
        </div>
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search title or author..."
            className="pl-9 pr-9 bg-background h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {displayedBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed rounded-2xl bg-muted/10">
          <Filter className="h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No books found</h3>
          <Button variant="link" onClick={() => setSearch('')} className="mt-2 text-primary">Clear Search</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {displayedBooks.map((book) => (
            <Link to={`/book/${book._id}`} key={book._id} className="block h-full">
              <div className="group flex flex-col gap-3 cursor-pointer h-full">
                <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-muted shadow-sm transition-all group-hover:shadow-md">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                    <Button size="sm" className="w-full shadow-lg">
                      View Details
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold leading-none tracking-tight text-foreground line-clamp-1" title={book.title}>
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {book.author}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-lg text-primary">
                      ${book.price}
                    </span>
                    <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-full">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold">{book.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
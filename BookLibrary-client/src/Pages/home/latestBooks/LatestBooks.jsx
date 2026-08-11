import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const LatestBooks = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedBook, setSelectedBook] = useState(null);

  const { data: books = [], isLoading, isError } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await axiosSecure.get('/books');
      return res.data;
    }
  });

  const publishedBooks = books
    .filter(b => b.status === 'published')
    .slice(0, 8);

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <div className="text-destructive text-center py-20">Failed to load books.</div>;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Just Arrived
            </h2>
            <p className="text-muted-foreground mt-2">
              Discover the latest additions to our collection.
            </p>
          </div>
          <Button asChild variant="ghost" className="group hidden md:flex">
            <Link to="/all-books">
              View all books
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {publishedBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onView={() => setSelectedBook(book)} />
          ))}
        </div>
        <div className="mt-12 text-center md:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link to="/all-books">View All Books</Link>
          </Button>
        </div>
        <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0 border-none sm:rounded-2xl">
            {selectedBook && (
              <div className="grid md:grid-cols-5 h-full max-h-[90vh] md:max-h-[600px] overflow-y-auto md:overflow-hidden">
                <div className="md:col-span-2 bg-muted relative h-64 md:h-full">
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent md:hidden" />
                </div>
                <div className="md:col-span-3 p-6 md:p-8 flex flex-col h-full bg-background">
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-muted-foreground">
                        {selectedBook.category || "General"}
                      </Badge>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold text-foreground">{selectedBook.rating}</span>
                      </div>
                    </div>
                    <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight mb-1">
                      {selectedBook.title}
                    </DialogTitle>
                    <p className="text-lg text-muted-foreground font-medium">
                      by {selectedBook.author}
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 mb-6">
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      {selectedBook.description}
                    </p>
                  </div>
                  <Separator className="mb-6" />
                  <div className="flex items-center justify-between gap-4 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Price</span>
                      <span className="text-3xl font-bold text-primary">${selectedBook.price}</span>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setSelectedBook(null)}>
                        Close
                      </Button>
                      <Button className="" asChild>
                        <Link to={'/all-books'}>
                          See all books
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

const BookCard = ({ book, onView }) => (
  <div className="group flex flex-col gap-3 cursor-pointer" onClick={onView}>
    <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-muted shadow-sm transition-all group-hover:shadow-md">
      <img
        src={book.image}
        alt={book.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        <Button size="sm" className="w-full shadow-lg">
          Quick View
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
      <div className="pt-2 flex items-center justify-between">
        <span className="font-bold text-lg text-primary">
          ${book.price}
        </span>
        <div className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded-full">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold">{book.rating}</span>
        </div>
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <section className="py-16 px-4 container mx-auto">
    <div className="flex justify-between items-center mb-10">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-2/3 rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  </section>
);

export default LatestBooks;
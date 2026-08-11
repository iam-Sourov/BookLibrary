import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import Map from './map/Map';
import LatestBooks from './latestBooks/LatestBooks';
import BookCourier from './statics/BookCourier';
import Stats from './statics/Stats';
import NewsLetter from './statics/NewsLetter';
import Slider from './slider/Slider';
import Categories from './statics/Categories';
import Testimonials from './statics/Testimonials';
import Container from '../../shared/container';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Home = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [heroSearch, setHeroSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await axiosSecure.get('/books');
      return res.data;
    }
  });

  const publishedBooks = books.filter(b => b.status === 'published');
  const suggestions = heroSearch.trim().length >= 1
    ? publishedBooks.filter(b => 
        b.title.toLowerCase().includes(heroSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(heroSearch.toLowerCase()) ||
        (b.category && b.category.toLowerCase().includes(heroSearch.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/all-books?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/all-books');
    }
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <section className="relative pt-24 pb-12 md:pt-40 md:pb-24 overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute inset-0 max-w-full overflow-hidden pointer-events-none z-0">
          {/* Main glowing orb */}
          <div className="absolute -top-[10%] left-[50%] -translate-x-[50%] w-[800px] h-[500px] bg-primary/20 rounded-[100%] blur-[120px] opacity-80 mix-blend-screen dark:mix-blend-color-dodge"></div>
          {/* Secondary ambient orbs */}
          <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-0 -left-[10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] opacity-60"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
            <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 text-center z-10 relative pt-10">

          {/* Animated Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs md:text-sm font-semibold text-primary shadow-lg shadow-primary/5 hover:bg-primary/10 hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 mb-8 cursor-default animate-in fade-in slide-in-from-bottom-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Discover 10,000+ Curated Titles
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both max-w-4xl mx-auto">
            Your Next Great Read <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-primary to-pink-500">
              Is Waiting For You.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-sm md:text-lg text-muted-foreground/90 mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            Discover a highly curated collection of rare books and modern bestsellers. Manage your reading journey in one beautifully tailored place.
          </p>

          {/* Hero Search Bar */}
          <div ref={suggestionRef} className="max-w-xl mx-auto mb-10 px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400 fill-mode-both relative z-30">
            <form onSubmit={handleHeroSearch} className="relative flex items-center bg-card/65 backdrop-blur-md border border-border shadow-2xl p-2 rounded-2xl focus-within:border-primary/55 transition-all duration-300">
              <Search className="h-5 w-5 text-muted-foreground ml-3 shrink-0" />
              <input 
                name="search"
                type="text" 
                value={heroSearch}
                onChange={(e) => {
                  setHeroSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search title, author, or genre..." 
                className="w-full bg-transparent border-0 outline-none px-3 text-foreground placeholder:text-muted-foreground text-sm h-10"
                autoComplete="off"
              />
              <Button type="submit" size="sm" className="rounded-xl h-10 px-5 bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 cursor-pointer">
                Search
              </Button>
            </form>

            {/* Suggestion Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-4 right-4 mt-2 bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl z-50 p-2 overflow-hidden max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((book) => (
                  <Link
                    key={book._id}
                    to={`/book/${book._id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 transition-colors duration-200 text-left"
                  >
                    <img 
                      src={book.image} 
                      alt={book.title} 
                      className="h-12 w-9 object-cover rounded-lg border border-border shrink-0 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">{book.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                    </div>
                    {book.category && (
                      <Badge variant="secondary" className="text-[10px] py-0.5 px-2 font-semibold">
                        {book.category}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both relative z-10">
            <Button size="lg" className="h-12 px-8 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer" asChild>
              <Link to="/all-books">
                Browse All Books
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl text-sm font-semibold bg-background/30 backdrop-blur-md border border-border hover:bg-muted/50 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer" asChild>
              <Link to="/register">Create Free Account</Link>
            </Button>
          </div>

          {/* Hero Trust Indicators */}
          <div className="flex items-center justify-center gap-6 md:gap-12 mt-12 pt-8 border-t border-border/30 max-w-2xl mx-auto text-xs md:text-sm text-muted-foreground font-semibold animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-base md:text-lg">50K+</span>
              <span>Happy Readers</span>
            </div>
            <div className="h-4 w-px bg-border/60" />
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-base md:text-lg">10K+</span>
              <span>Curated Books</span>
            </div>
            <div className="h-4 w-px bg-border/60" />
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-base md:text-lg">24h</span>
              <span>Courier Delivery</span>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative w-full opacity-95 hover:opacity-100 transition-opacity duration-500 px-4 md:px-0 z-10 drop-shadow-xl">
          <Slider />
        </div>
      </section>
      <div className="border-y ">
        <Container>
          <div className="py-12">
            <Stats />
          </div>
        </Container>
      </div>
      <section className="py-16 md:py-24">
        <Container>
          <Categories />
        </Container>
      </section>
      <section className="pb-16 md:pb-24">
        <Container>
          <LatestBooks />
        </Container>
      </section>
      <section className=" py-16 md:py-24">
        <Container>
          <BookCourier />
        </Container>
      </section>
      <section className="py-16 md:py-24">
        <Container>
          <div className="space-y-4 text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nationwide Delivery</h2>
            <p className="text-lg text-muted-foreground">
              We deliver to every corner of the country. Check our coverage map below
              to see if your district is on our priority list.
            </p>
          </div>
          <Map />
        </Container>
      </section>
      <section className="py-16 md:py-24">
        <Container>
          <Testimonials />
        </Container>
      </section>
      <section className="py-16 md:py-24">
        <Container>
          <NewsLetter />
        </Container>
      </section>
    </div>
  );
};

export default Home;
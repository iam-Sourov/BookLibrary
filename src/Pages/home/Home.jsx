import React from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import Map from './map/Map';
import LatestBooks from './latestBooks/LatestBooks';
import BookCourier from './statics/BookCourier';
import Stats from './statics/Stats';
import NewsLetter from './statics/NewsLetter';
import Slider from './slider/Slider';
import Categories from './statics/Categories';
import Testimonials from './statics/Testimonials';
import Container from '../../shared/container';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <section className="relative pt-24 pb-12 md:pt-40 md:pb-24 overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute inset-0 max-w-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-70"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-accent/20 rounded-full blur-[80px] opacity-60"></div>
        </div>

        <div className="container mx-auto px-4 text-center z-10 relative">

          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:scale-105 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            New Arrivals In Stock
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight lg:text-7xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Your Next Great Read <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-indigo-400 dark:to-purple-400">Is Waiting For You.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground/90 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Discover a curated collection of thousands of books. From timeless classics
            to modern bestsellers, manage your library in one beautifully designed place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Button size="lg" className="h-14 px-10 rounded-full text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1" asChild>
              <Link to="/all-books">Start Exploring</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-base font-semibold bg-background/50 backdrop-blur-sm border-border hover:bg-muted transition-all hover:-translate-y-1" asChild>
              <Link to="/register">Join the Community</Link>
            </Button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative w-full opacity-95 hover:opacity-100 transition-opacity duration-500 px-4 md:px-0 z-10 drop-shadow-xl">
          <Slider />
        </div>
      </section>
      <div className="border-y bg-muted/20">
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
      <section className="bg-muted/30 py-16 md:py-24">
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
      <section className="py-16 md:py-24 bg-muted/10">
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
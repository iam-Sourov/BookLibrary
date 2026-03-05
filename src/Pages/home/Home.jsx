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

          {/* Animated Badge */}
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 mb-10 cursor-default animate-in fade-in slide-in-from-bottom-4">
            <span className="relative flex h-2.5 w-2.5 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            New Arrivals In Stock Now
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
            Your Next Great Read <br className="hidden md:block" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                Is Waiting For You.
              </span>
              {/* Subtle underline highlight */}
              <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10 rounded-sm skew-x-12 hidden md:block"></span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-lg md:text-2xl text-muted-foreground/90 mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            Discover a highly curated collection of rare books and modern bestsellers. Manage your journey in one beautifully tailored place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both">
            <Button size="lg" className="h-14 px-10 rounded-full text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 group" asChild>
              <Link to="/all-books">
                Start Exploring
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-base font-bold bg-background/40 backdrop-blur-md border border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1" asChild>
              <Link to="/register">Join the Community</Link>
            </Button>
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
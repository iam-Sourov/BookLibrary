import React from 'react';
import { toast } from "sonner";
import { Mail, ArrowRight, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewsLetter = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      toast.success("Subscribed successfully!");
      e.target.reset();
    }
  };

  return (
    <section className="px-2">
      <div className="relative w-full overflow-hidden rounded-3xl bg-card/45 border border-border/80 text-foreground">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-between gap-8 p-8 md:p-12 lg:gap-16 md:flex-row max-w-6xl mx-auto">
          <div className="flex max-w-xl flex-col items-center text-center md:items-start md:text-left space-y-4">
            <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-3 shadow-lg border border-primary/20 mb-2">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Unlock Weekly <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-primary to-pink-500">Stories</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
              Join 15,000+ readers. Get the latest book arrivals, exclusive author interviews, and hidden gems delivered to your inbox.
            </p>
          </div>
          
          <div className="w-full max-w-md space-y-3">
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
              <Input
                name="email"
                type="email"
                required
                className="h-12 border border-border bg-background/55 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-0 rounded-2xl shadow-inner"
                placeholder="Enter your email address" />
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold sm:w-auto w-full rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-0.5">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center md:text-left flex items-center justify-center md:justify-start gap-2 font-medium">
              <BellRing className="h-3 w-3 text-primary animate-pulse" />
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;

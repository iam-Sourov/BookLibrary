import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Book Club Lead",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    text: "The delivery speed is unmatched. I ordered a set for my book club and they arrived in pristine condition within 24 hours.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Student",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    text: "Finally, a platform that covers rural districts! I got my engineering textbooks delivered to my hometown without any hassle.",
    rating: 5
  },
  {
    name: "Emma Wilson",
    role: "Fiction Lover",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    text: "The curated collection is amazing. I found rare editions here that weren't available on any other major e-commerce site.",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="px-2">
      <div className="relative p-8 md:p-12 w-full overflow-hidden rounded-3xl bg-card/45 backdrop-blur-xl border border-border/80 text-foreground shadow-2xl">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-primary to-pink-500">Voices</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed font-medium">What our 50,000+ happy readers are saying about us</p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((review, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}>
              <Card className="relative h-full w-full overflow-hidden rounded-3xl bg-background/55 border border-border/60 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 group">
                <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/15 blur-3xl opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <CardContent className="pt-12 px-8 pb-8 flex flex-col h-full relative z-10">
                  <div className="flex gap-1 mb-6 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`}
                      />
                    ))}
                  </div>
                  <p className="leading-relaxed mb-8 text-muted-foreground group-hover:text-foreground/90 transition-colors text-sm flex-grow">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                    <Avatar className="h-11 w-11 border border-border shadow-md">
                      <AvatarImage src={review.img} />
                      <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{review.name}</h4>
                      <p className="text-xs text-muted-foreground">{review.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
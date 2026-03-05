import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Book Club Lead",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    text: "The delivery speed is unmatched. I ordered a set for my book club and they arrived in pristine condition within 24 hours.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Student",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    text: "Finally, a platform that covers rural districts! I got my engineering textbooks delivered to my hometown without any hassle.",
    rating: 5
  },
  {
    name: "Emma Wilson",
    role: "Fiction Lover",
    img: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    text: "The curated collection is amazing. I found rare editions here that weren't available on any other major e-commerce site.",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="p-2">
      <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-900 text-white shadow-xl">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mt-10 tracking-tight">Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Voices</span></h2>
          <p className="text-muted-foreground mt-4 text-lg">What our 50,000+ happy readers are saying about us</p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 lg:p-10"
        >
          {testimonials.map((review, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}>
              <Card className="relative h-full w-full overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 text-white shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-500 group">
                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-12 px-8 pb-8 flex flex-col h-full">
                  <div className="absolute top-6 left-8 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Quote className="h-10 w-10 text-primary rotate-180" />
                  </div>
                  <div className="flex gap-1 mb-6 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <p className="leading-relaxed mb-8 relative z-10 text-zinc-300 group-hover:text-white transition-colors flex-grow">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
                    <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                      <AvatarImage src={review.img} />
                      <AvatarFallback className="bg-primary/20 text-primary">U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-sm">{review.name}</h4>
                      <p className="text-xs text-zinc-400">{review.role}</p>
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
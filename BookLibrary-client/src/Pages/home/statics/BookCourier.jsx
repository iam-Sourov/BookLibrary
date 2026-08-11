import React from 'react';
import { motion } from "framer-motion";
import { Truck, Library, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Express Delivery",
    desc: "Doorstep delivery within 24-48 hours. Real-time tracking included.",
  },
  {
    icon: Library,
    title: "Curated Collection",
    desc: "Access thousands of rare and popular titles across 50+ genres.",
  },
  {
    icon: Wallet,
    title: "Best Price Guarantee",
    desc: "Premium reads at student-friendly prices with seasonal discounts.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
};

const BookCourier = () => {
  return (
    <section className="px-2">
      <div className="relative p-8 md:p-12 w-full overflow-hidden rounded-3xl bg-card/45 backdrop-blur-xl border border-border/80 text-foreground">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Why Readers <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-primary to-pink-500">Trust Us</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
              We don't just sell books; we deliver stories with care, speed, and affordability. Join our growing community of book lovers.
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <motion.div key={index} variants={itemVariants} className="h-full">
                <Card className="relative w-full h-full overflow-hidden rounded-3xl bg-background/55 border border-border/60 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 group">
                  <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/15 blur-3xl opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <CardContent className="p-8 md:p-10 flex flex-col items-start gap-6 relative z-10 w-full h-full">
                    <div className="h-16 w-16 rounded-2xl bg-card/90 backdrop-blur-md flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 shadow-lg transition-all duration-300 border border-border">
                      <item.icon className="h-8 w-8 text-primary transition-colors" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/80 transition-colors">
                        {item.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookCourier;

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
    <section className="">
      <div className="relative p-10 w-full overflow-hidden rounded-3xl bg-zinc-900 text-white shadow-xl">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Why Readers <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Trust Us</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We don't just sell books; we deliver stories with care, speed, and affordability. Join our growing community of book lovers.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 p-4 gap-8">
            {features.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="relative w-full h-full overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group">
                  <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />
                  <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />
                  <CardContent className="p-10 flex flex-col items-start gap-6 relative z-10 w-full">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-800/80 backdrop-blur-md flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 shadow-lg transition-all duration-300 border border-white/5">
                      <item.icon className="h-8 w-8 text-white group-hover:text-primary transition-colors" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold ">
                        {item.title}
                      </h3>
                      <p className=" leading-relaxed">
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
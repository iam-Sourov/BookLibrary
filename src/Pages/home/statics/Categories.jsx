import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Book, Rocket, Heart, Brain, Zap, Coffee, Ghost } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  { name: "Fiction", icon: Book, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Sci-Fi", icon: Rocket, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Romance", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
  { name: "Self Help", icon: Brain, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Thriller", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "History", icon: Compass, color: "text-amber-600", bg: "bg-amber-600/10" },
  { name: "Lifestyle", icon: Coffee, color: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Horror", icon: Ghost, color: "text-slate-500", bg: "bg-slate-500/10" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
};

const Categories = () => {
  return (
    <section className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 space-y-3"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-indigo-400 dark:to-purple-400">Genre</span></h2>
        <p className="text-lg text-muted-foreground">Dive into your favorite worlds and discover new passions</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="cursor-pointer group relative overflow-hidden bg-background/40 backdrop-blur-sm border border-primary/10 hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] transition-all duration-500 rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="flex flex-col items-center justify-center p-8 gap-5 relative z-10">
                <div className={`p-5 rounded-2xl ${cat.bg} group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg transition-all duration-300`}>
                  <cat.icon className={`h-8 w-8 ${cat.color}`} />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Explore <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Categories;
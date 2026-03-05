import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Marquee } from "@/components/ui/marquee";
import { Spinner } from "@/components/ui/spinner";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion } from "framer-motion";

const BookCard = ({ book }) => (
  <div className="h-full transform-gpu will-change-transform">
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link
        to="/all-books"
        className="group relative flex w-[240px] md:w-[280px] h-[360px] md:h-[400px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card text-card-foreground shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50"
      >
        <div className="relative h-3/4 w-full overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          <img
            src={book.image}
            alt={book.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-md">
              View
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5 bg-background group-hover:bg-muted/30 transition-colors duration-300 z-20 relative -mt-4 rounded-t-2xl border-t border-border/50 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)]">
          <h3 className="line-clamp-1 text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {book.description || "A captivating journey awaits inside the pages of this incredible book."}
          </p>
        </div>
      </Link>
    </motion.div>
  </div>
);

const Slider = () => {
  const axiosSecure = useAxiosSecure();

  const { data: books = [], isLoading, isError } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axiosSecure.get("/books");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-destructive bg-background">
        <p>Failed to load books.</p>
      </div>
    );
  }
  return (
    <section className="relative w-full overflow-hidden py-10 md:py-20 bg-background/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 mb-16 text-center space-y-3"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Books</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A highly curated selection of our most loved literature.
        </p>
      </motion.div>
      <div className="relative flex w-full flex-col gap-8 md:gap-12">
        <div className="relative z-10 hover:z-20">
          <Marquee pauseOnHover className="[--duration:120s] md:[--duration:150s]">
            {books.map((book, idx) => (
              <div key={idx} className="mx-4 md:mx-6 cursor-pointer py-4 pl-1">
                <BookCard book={book} />
              </div>
            ))}
          </Marquee>
        </div>
        <div className="relative z-10 hover:z-20">
          <Marquee pauseOnHover reverse className="[--duration:120s] md:[--duration:150s]">
            {books.map((book, idx) => (
              <div key={`${idx}-reverse`} className="mx-4 md:mx-6 cursor-pointer py-4 pl-1">
                <BookCard book={book} />
              </div>
            ))}
          </Marquee>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-background to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-background to-transparent z-10"></div>
      </div>
    </section>
  );
};

export default Slider;
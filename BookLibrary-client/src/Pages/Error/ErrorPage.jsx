import React from 'react';
import { Link, useNavigate } from 'react-router'; 
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { MoveLeft, Home, FileQuestion } from 'lucide-react';

const ErrorPage = () => {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      }
    },
  };

  const floatAnimation = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      <motion.div
        className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="relative"
          {...floatAnimation}
        >
          <div className="text-[150px] font-black text-primary/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <FileQuestion className="h-24 w-24 text-primary" />
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="space-y-4 max-w-lg">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Page not found
          </h1>
          <p className="text-lg text-muted-foreground">
            Oops! It seems like the page you are looking for has vanished into the digital void or never existed.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 min-w-[300px] justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate(-1)}
            className="group">
            <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          <Button 
            size="lg" 
            asChild
            className="group">
            <Link to="/">
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Back to Home
            </Link>
          </Button>
        </motion.div>
        <motion.div variants={itemVariants}>
            <p className="text-xs text-muted-foreground mt-8">
                Error Code: 404_NOT_FOUND
            </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
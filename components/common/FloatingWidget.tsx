"use client";
import { ThemeBtn } from "@/components/common/ThemeToggler";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaShareAlt,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";

const icons = [FaGithub, FaLinkedin, FaShareAlt, FaWhatsapp];

const FloatingWidget = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [iconIndex, setIconIndex] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      // Pick a random icon when the widget is hidden
      setIconIndex(Math.floor(Math.random() * icons.length));
    }
  }, [isVisible]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + pathname);
    alert("Link copied to clipboard!");
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check this out!",
        url: window.location.origin + pathname,
      });
    } else {
      handleCopy();
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const RandomIcon = icons[iconIndex];

  return (
    <>
      {isVisible && (
        <motion.div
          animate={{ x: [100, 0], opacity: [0, 1] }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            ease: "easeInOut",
          }}
          className="fixed bottom-12 inset-x-0 transform md:right-4 md:left-auto z-50 h-auto flex flex-col justify-center items-center gap-3 bg-transparent pointer-events-none"
        >
          <div className="p-2 flex flex-row md:flex-col justify-center items-center gap-3 bg-secondary rounded-full pointer-events-auto">
            <ThemeBtn />
            <Button
              onClick={shareLink}
              className="p-2 bg-muted rounded-full hover:bg-accent transition aspect-square cursor-pointer"
            >
              <FaShareAlt className="text-foreground" size={20} />
            </Button>
            <Link
              href="https://github.com/khanshifaul"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-muted rounded-full hover:bg-accent transition aspect-square cursor-pointer"
            >
              <FaGithub className="text-foreground" size={20} />
            </Link>
            <Link
              href="https://linkedin.com/in/khan-shifaul"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-muted rounded-full hover:bg-accent transition aspect-square cursor-pointer"
            >
              <FaLinkedin className="text-foreground" size={20} />
            </Link>
            <Link
              href={`https://wa.me/+8801701005355?text=Hi, I saw your portfolio and I'm interested in working with you!`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-muted rounded-full hover:bg-accent transition aspect-square cursor-pointer"
            >
              <FaWhatsapp className="text-foreground" size={20} />
            </Link>
            <Button
              onClick={toggleVisibility}
              className="p-2 bg-muted rounded-full hover:bg-accent transition aspect-square cursor-pointer"
            >
              <FaTimes className="text-destructive" size={20} />
            </Button>
          </div>
        </motion.div>
      )}
      {!isVisible && (
        <motion.div
          animate={{ scale: [0.8, 1], opacity: [0, 1] }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="fixed bottom-12 right-4 aspect-square z-50 h-auto flex flex-col justify-center items-center gap-3 bg-transparent pointer-events-none"
        >
          <div className="p-2 flex flex-row md:flex-col justify-center items-center gap-3 bg-secondary rounded-full pointer-events-auto z-50 shadow-[0_0_20px_rgba(34,197,94,0.2)] border border-green-500/20">
            <Button
              onClick={toggleVisibility}
              className="p-2 bg-muted rounded-full hover:bg-accent transition aspect-square cursor-pointer group"
            >
              <RandomIcon className="text-green-500 group-hover:scale-110 transition-transform" size={20} />
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default FloatingWidget;

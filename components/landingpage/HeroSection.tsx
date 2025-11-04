"use client";
import { motion } from "framer-motion";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="px-4 md:px-6 lg:px-28 py-2 md:py-4 lg:py-6 flex justify-center">
        <div className="text-center max-w-[600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="bg-transparent mb-8 flex items-center justify-center rounded-lg w-full">
              <img src="bost.png" className="w-48" />
            </div>

            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Inventory Management Portal
            </h1>
            <p className="w-full text-muted-foreground md:text-xl">
              Liquid&apos;s comprehensive
              solution for efficient inventory tracking and management.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Button size="lg" className="inline-flex gap-2" asChild>
                <Link href="/auth?v=signup">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

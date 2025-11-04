"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import Link from "next/link";

const AuthTabSystem = ({ tab }: { tab: string }) => {
  const [activeTab, setActiveTab] = useState(tab);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md px-4 z-10"
    >
      <div className="flex justify-center mb-8 w-full">
        <Link href="/" className="flex items-center gap-2 w-full justify-center">
          <img src="bost.png" className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold w-5/6 text-center">Liquid Inventory Management Portal</h1>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "signin" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === "signin" ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="signin">
              <SignInForm setActiveTab={setActiveTab} />
            </TabsContent>

            <TabsContent value="signup">
              <SignUpForm setActiveTab={setActiveTab} />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default AuthTabSystem;

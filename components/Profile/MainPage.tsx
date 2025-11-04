"use client";
import { RootState } from "@/lib/store";
import { motion } from "framer-motion";
import React from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import General from "./General";
import Security from "./Security";

const MainPage = () => {
  const user = useSelector((state: RootState) => state.UserData.user);
  return (
    <div
      className="mx-auto p-4 md:p-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage your account information
        </p>
      </motion.div>
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Profile Details
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Security
          </TabsTrigger>
        </TabsList>
        <General currentUser={user} />
        <Security />
      </Tabs>
    </div>
  );
};

export default MainPage;

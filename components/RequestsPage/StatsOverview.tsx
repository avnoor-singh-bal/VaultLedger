import { containerVariants, itemVariants } from "@/lib/animations";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import React from "react";

interface props {
    setActiveTab: (tab: string) => void;
    pendingLength: number;
    approvedLength: number;
    rejectedLength: number;
}

const StatsOverview:React.FC<props> = ({setActiveTab, pendingLength, approvedLength, rejectedLength}) => {
  return (
    <>
      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid-cols-3 gap-4 mb-8 hidden lg:grid"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-4 border-l-4 border-amber-500"
          onClick={() => setActiveTab("pending")}
        >
          <div className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold">{pendingLength}</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-full">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500"
          onClick={() => setActiveTab("approved")}
        >
          <div className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-gray-500">Approved Requests</p>
              <p className="text-2xl font-bold">{approvedLength}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500"
          onClick={() => setActiveTab("rejected")}
        >
          <div className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-gray-500">Rejected Requests</p>
              <p className="text-2xl font-bold">{rejectedLength}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default StatsOverview;

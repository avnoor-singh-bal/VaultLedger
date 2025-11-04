"use client";
import React, { useEffect, useState } from "react";
import { UserInventory } from "@/models/models";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  XCircle,
  CheckCircle,
  Search,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const MyInventory = () => {
  const [userInventory, setUserInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state: RootState) => state.UserData.user);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`/api/user_data?pn=${user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUserInventory(data.inventory);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [user.id]);

  // Filter inventory based on search query
  const filterInventory = (items: UserInventory[]) => {
    if (!searchQuery) return items;
    return items.filter(
      (item: UserInventory) =>
        item.inventoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const acquiredInventory = filterInventory(
    userInventory.filter(
      (item: UserInventory) => item.status === "Approved" && !item.returned
    )
  );

  const pendingInventory = filterInventory(
    userInventory.filter((item: UserInventory) => item.status === "Pending")
  );

  const rejectedInventory = filterInventory(
    userInventory.filter((item: UserInventory) => item.status === "Rejected")
  );

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex flex-col items-center justify-center h-[50vh] text-center p-6"
      >
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const countItems = {
    acquired: acquiredInventory.length,
    pending: pendingInventory.length,
    rejected: rejectedInventory.length,
    total: userInventory.length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 md:p-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Inventory
        </h1>
        <p className="text-gray-600 mt-2">
          Manage and track all your inventory items in one place
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Acquired Items</p>
              <p className="text-2xl font-bold">{countItems.acquired}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-4 border-l-4 border-amber-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold">{countItems.pending}</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-full">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected Items</p>
              <p className="text-2xl font-bold">{countItems.rejected}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold">{countItems.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative mb-6"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search inventory items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-6 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </motion.div>

      {/* Tabs for different inventory categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="acquired"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Acquired
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            Rejected
          </TabsTrigger>
        </TabsList>

        {/* All Items */}
        <TabsContent value="all">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {userInventory.length > 0 ? (
              filterInventory(userInventory).map((item: UserInventory) => (
                <InventoryCard key={item._id} item={item} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-3 text-center py-12"
              >
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">
                  No inventory items found
                </h3>
                <p className="text-gray-500 mt-2">
                  You don&apos;t have any inventory items yet.
                </p>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        {/* Acquired Items */}
        <TabsContent value="acquired">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {acquiredInventory.length > 0 ? (
              acquiredInventory.map((item: UserInventory) => (
                <InventoryCard key={item._id} item={item} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-3 text-center py-12"
              >
                <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">
                  No acquired items
                </h3>
                <p className="text-gray-500 mt-2">
                  You don&apos;t have any acquired inventory items yet.
                </p>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        {/* Pending Items */}
        <TabsContent value="pending">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {pendingInventory.length > 0 ? (
              pendingInventory.map((item: UserInventory) => (
                <InventoryCard key={item._id} item={item} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-3 text-center py-12"
              >
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">
                  No pending requests
                </h3>
                <p className="text-gray-500 mt-2">
                  You don&apos;t have any pending inventory requests.
                </p>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>

        {/* Rejected Items */}
        <TabsContent value="rejected">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {rejectedInventory.length > 0 ? (
              rejectedInventory.map((item: UserInventory) => (
                <InventoryCard key={item._id} item={item} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-3 text-center py-12"
              >
                <XCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">
                  No rejected requests
                </h3>
                <p className="text-gray-500 mt-2">
                  You don&apos;t have any rejected inventory requests.
                </p>
              </motion.div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

interface CardProps {
  item: UserInventory;
}

const InventoryCard: React.FC<CardProps> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4" />;
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="relative">
        <motion.img
          src={`https://utfs.io/f/${item.inventoryImage}`}
          alt={item.inventoryName}
          className="w-full h-48 object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute top-3 right-3">
          <Badge
            className={`${getStatusColor(
              item.status
            )} px-3 py-1 flex items-center gap-1`}
          >
            {getStatusIcon(item.status)}
            {item.status}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {item.inventoryName}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Package className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm">Quantity: {item.quantity}</span>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-start text-gray-600">
                  <Info className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <span className="text-sm line-clamp-1">
                    Purpose: {item.purpose}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{item.purpose}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <motion.div
          className="w-full h-1 bg-gray-100 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className={`h-full ${
              item.status === "Approved"
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : item.status === "Pending"
                ? "bg-gradient-to-r from-amber-400 to-amber-600"
                : "bg-gradient-to-r from-red-400 to-red-600"
            }`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 0.7 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyInventory;

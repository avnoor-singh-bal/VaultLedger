"use client";

import React, { useEffect, useState } from "react";
import { Project, Request } from "@/models/models";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatsOverview from "./StatsOverview";
import PendingRequestsTab from "./tabs/PendingRequestsTab";
import ApprovedRequestsTab from "./tabs/ApprovedRequestsTab";
import RejectedRequestTab from "./tabs/RejectedRequestTab";

const RequestsTabular = () => {
  const [getRequests, setGetRequests] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null
  );

  const user = useSelector((state: RootState) => state.UserData.user);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/request?pn=${user.category}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Filter and set specific requests
        setPendingRequests(
          data.requests.filter((req: Request) => req.status === "Pending")
        );
        setApprovedRequests(
          data.requests.filter((req: Request) => req.status === "Approved")
        );
        setRejectedRequests(
          data.requests.filter((req: Request) => req.status === "Rejected")
        );
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [getRequests, user.category]);

  // Getting Projects list
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/projects?pn=${user.category}`);
        const data = await response.json();
        const projectTitles = data.projects.map(
          (project: Project) => project.title
        );
        setProjects(projectTitles);
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast({
          title: "Error",
          description: "Failed to fetch projects",
          variant: "destructive",
        });
      }
    };
    fetchProjects();
  }, [user.category, toast]);

  const gettingRequests = () => {
    setGetRequests(!getRequests);
  };

  // Filter requests based on search query
  const filterRequests = (requests: Request[]) => {
    if (!searchQuery) return requests;

    return requests.filter(
      (req: Request) =>
        req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredPendingRequests = filterRequests(pendingRequests);
  const filteredApprovedRequests = filterRequests(approvedRequests);
  const filteredRejectedRequests = filterRequests(rejectedRequests);

  if (user.role === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-[50vh] text-center p-6"
      >
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h3>
        <p className="text-gray-600">
          You are not authorized to access this page.
        </p>
      </motion.div>
    );
  }

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
        <Button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Inventory Requests
        </h1>
        <p className="text-gray-600 mt-2">
          Manage and process all inventory requests in one place
        </p>
      </motion.div>

      <StatsOverview
        setActiveTab={setActiveTab}
        pendingLength={pendingRequests.length}
        approvedLength={approvedRequests.length}
        rejectedLength={rejectedRequests.length}
      />

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative mb-6"
      >
        <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by name, component, or purpose..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-6 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8 bg-gray-100/40 backdrop-blur-lg rounded-xl p-1.5">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approved
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-md rounded-lg transition-all duration-200"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejected
          </TabsTrigger>
        </TabsList>

        <PendingRequestsTab
          processingRequestId={processingRequestId}
          setProcessingRequestId={setProcessingRequestId}
          category={user.category}
          gettingRequests={gettingRequests}
          filteredPendingRequests={filteredPendingRequests}
          searchQuery={searchQuery}
        />

        <ApprovedRequestsTab
          filteredApprovedRequests={filteredApprovedRequests}
          searchQuery={searchQuery}
          gettingRequests={gettingRequests}
          category={user.category}
          projects={projects}
        />

        <RejectedRequestTab
          filteredRejectedRequests={filteredRejectedRequests}
          searchQuery={searchQuery}
        />
      </Tabs>
    </motion.div>
  );
};

export default RequestsTabular;

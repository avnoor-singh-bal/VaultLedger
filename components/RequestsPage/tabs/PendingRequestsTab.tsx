"use client";
import { TabsContent } from "@/components/ui/tabs";
import { containerVariants, itemVariants } from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Info,
  Loader2,
  Mail,
  Package,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import React from "react";
import { Component, Request } from "@/models/models";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface props {
    setProcessingRequestId: (id: string | null) => void;
    category: string;
    gettingRequests: () => void;
    filteredPendingRequests: Request[];
    processingRequestId: string | null;
    searchQuery: string;
}

const PendingRequestsTab:React.FC<props> = ({processingRequestId, setProcessingRequestId, category, gettingRequests, filteredPendingRequests, searchQuery}) => {
  const { toast } = useToast();
  // Function to update request status
  const updateRequestStatus = async (req: Request, status: string) => {
    setProcessingRequestId(req._id);

    let alreadyBeingUsed = 0;
    if (status === "Approved") {
      // Checking Stock
      try {
        const response = await fetch(`/api/inventory?pn=${category}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Find the component in the inventory
        const component = data.inventory.find(
          (item: Component) => item._id === req.inventoryId
        );

        // Check stock availability
        if (component.inStock - component.inUse >= req.quantity) {
          alreadyBeingUsed = component.inUse;
        } else {
          // Insufficient stock
          toast({
            title: "Insufficient Stock",
            description: `Available: ${
              component.inStock - component.inUse
            }, Required: ${req.quantity}`,
            variant: "destructive",
          });
          setProcessingRequestId(null);
          return;
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setProcessingRequestId(null);
        return;
      }

      // Updating Stock
      try {
        const response = await fetch(`/api/inventory`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: category,
            task: 0,
            _id: req.inventoryId,
            project: false,
            email: req.email,
            name: req.name,
            phone: req.phone,
            reqId: req._id,
            reqQuantity: req.quantity,
            quantity: alreadyBeingUsed + req.quantity,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Failed to update status.");
        }
      } catch (err) {
        console.error("Error updating status:", err);
        toast({
          title: "Error",
          description: "Failed to update inventory status",
          variant: "destructive",
        });
        setProcessingRequestId(null);
        return;
      }
    }

    // Updating User-Data
    try {
      await fetch(`/api/user_data?pn=${req.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: 0,
          reqId: req._id,
          status: status,
        }),
      });
    } catch (err) {
      console.error("Error updating user-data:", err);
      toast({
        title: "Error",
        description: "Failed to update user data",
        variant: "destructive",
      });
      setProcessingRequestId(null);
      return;
    }

    // Updating status
    try {
      const response = await fetch(`/api/request`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: req._id,
          task: 0,
          status: status,
          category: category,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update status.");
      }

      toast({
        title: status === "Approved" ? "Request Approved" : "Request Rejected",
        description: `The request from ${
          req.name
        } has been ${status.toLowerCase()}.`,
      });

      gettingRequests();
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    } finally {
      setProcessingRequestId(null);
    }
  };

  return (
    <TabsContent
      value="pending"
      className="focus-visible:outline-none focus-visible:ring-0"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-amber-500" />
            Pending Requests
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Review and process incoming inventory requests
          </p>
        </div>
        <AnimatePresence>
          {filteredPendingRequests.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-gray-100"
            >
              {filteredPendingRequests.map((req: Request) => (
                <motion.div
                  key={req._id}
                  variants={itemVariants}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <h3 className="font-medium text-gray-900">
                          {req.name}
                        </h3>
                      </div>

                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-2" />
                        <h1 className="text-gray-700">
                          {req.component}{" "}
                          <Badge variant="outline" className="ml-1">
                            {req.quantity}
                          </Badge>
                        </h1>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <h1 className="text-gray-700">
                          Return by:{" "}
                          {format(new Date(req.date), "MMM dd, yyyy")}
                        </h1>
                      </div>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-start">
                              <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                              <h1 className="text-gray-700 line-clamp-1 max-w-md">
                                {req.purpose}
                              </h1>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{req.purpose}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <Info className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="left"
                          align="center"
                          className="w-80 p-0"
                        >
                          <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h4 className="font-semibold text-gray-900">
                              Request Details
                            </h4>
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <h1 className="text-sm text-gray-700">
                                {req.name}
                              </h1>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              <h1 className="text-sm text-gray-700">
                                {req.email}
                              </h1>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              <h1 className="text-sm text-gray-700">
                                {req.phone}
                              </h1>
                            </div>
                            <div className="flex items-center">
                              <Package className="h-4 w-4 text-gray-400 mr-2" />
                              <h1 className="text-sm text-gray-700">
                                {req.component}{" "}
                                <Badge variant="outline" className="ml-1">
                                  {req.quantity}
                                </Badge>
                              </h1>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <h1 className="text-sm text-gray-700">
                                Return by:{" "}
                                {format(new Date(req.date), "MMM dd, yyyy")}
                              </h1>
                            </div>
                            <div className="flex items-start">
                              <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                              <h1 className="text-sm text-gray-700">
                                {req.purpose}
                              </h1>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateRequestStatus(req, "Approved")}
                          className="bg-green-500 hover:bg-green-600 text-white"
                          disabled={processingRequestId === req._id}
                        >
                          {processingRequestId === req._id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => updateRequestStatus(req, "Rejected")}
                          className="bg-red-500 hover:bg-red-600 text-white"
                          disabled={processingRequestId === req._id}
                        >
                          {processingRequestId === req._id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Clock className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">
                No pending requests
              </h3>
              <p className="text-gray-500 mt-2 max-w-md">
                {searchQuery
                  ? "No pending requests match your search criteria."
                  : "There are no pending inventory requests at the moment."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TabsContent>
  );
};

export default PendingRequestsTab;

"use client";
import { TabsContent } from "@/components/ui/tabs";
import { containerVariants, itemVariants } from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertTriangle,
  Calendar,
  CheckCircle,
  FileText,
  Info,
  Mail,
  Package,
  Phone,
  User,
} from "lucide-react";
import React from "react";
import { Request } from "@/models/models";
import { Badge } from "@/components/ui/badge";
import { format, isAfter, isBefore } from "date-fns";
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
import MarkAsReturnButton from "../markAsReturnButton";

interface props {
    filteredApprovedRequests: Request[];
    category: string;
    projects: string[];
    gettingRequests: () => void;
    searchQuery: string;
}

const ApprovedRequestsTab:React.FC<props> = ({filteredApprovedRequests, category, projects, gettingRequests, searchQuery}) => {
  return (
    <TabsContent
    value="approved"
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
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Approved Requests
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Track approved inventory requests and manage returns
        </p>
      </div>

      <AnimatePresence>
        {filteredApprovedRequests.length > 0 ? (
          <div>
            {/* Overdue Requests */}
            {filteredApprovedRequests.some(
              (req: Request) =>
                isBefore(new Date(req.date), new Date()) && !req.returned
            ) && (
              <div className="mt-4">
                <div className="px-6 py-3 bg-red-50">
                  <h3 className="text-lg font-semibold text-red-700 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Overdue Requests
                  </h3>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-gray-100"
                >
                  {filteredApprovedRequests
                    .filter(
                      (req: Request) =>
                        isBefore(new Date(req.date), new Date()) &&
                        !req.returned
                    )
                    .map((req: Request) => (
                      <motion.div
                        key={req._id}
                        variants={itemVariants}
                        className="p-6 bg-red-50/50 hover:bg-red-50 transition-colors duration-150 w-full"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 w-full">
                          <div className="space-y-2 w-full">
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
                              <Calendar className="h-4 w-4 text-red-500 mr-2" />
                              <h1 className="text-red-600 font-medium">
                                Overdue since:{" "}
                                {format(
                                  new Date(req.date),
                                  "MMM dd, yyyy"
                                )}
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
                                  <p className="max-w-xs">
                                    {req.purpose}
                                  </p>
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
                                      <Badge
                                        variant="outline"
                                        className="ml-1"
                                      >
                                        {req.quantity}
                                      </Badge>
                                    </h1>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 text-red-500 mr-2" />
                                    <h1 className="text-sm text-red-600 font-medium">
                                      Overdue since:{" "}
                                      {format(
                                        new Date(req.date),
                                        "MMM dd, yyyy"
                                      )}
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

                            <MarkAsReturnButton
                              req={req}
                              projects={projects}
                              category={category}
                              getReqsFunc={gettingRequests}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </div>
            )}

            {/* Non-Overdue Requests */}
            {filteredApprovedRequests.some(
              (req: Request) =>
                isAfter(new Date(req.date), new Date()) && !req.returned
            ) && (
              <div className="mt-4">
                <div className="px-6 py-3 bg-green-50">
                  <h3 className="text-lg font-semibold text-green-700 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Active Requests
                  </h3>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-gray-100"
                >
                  {filteredApprovedRequests
                    .filter(
                      (req: Request) =>
                        isAfter(new Date(req.date), new Date()) &&
                        !req.returned
                    )
                    .map((req: Request) => (
                      <motion.div
                        key={req._id}
                        variants={itemVariants}
                        className="p-6 hover:bg-gray-50 transition-colors duration-150 w-full"
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
                                {format(
                                  new Date(req.date),
                                  "MMM dd, yyyy"
                                )}
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
                                  <p className="max-w-xs">
                                    {req.purpose}
                                  </p>
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
                                      <Badge
                                        variant="outline"
                                        className="ml-1"
                                      >
                                        {req.quantity}
                                      </Badge>
                                    </h1>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                    <h1 className="text-sm text-gray-700">
                                      Return by:{" "}
                                      {format(
                                        new Date(req.date),
                                        "MMM dd, yyyy"
                                      )}
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

                            <MarkAsReturnButton
                              req={req}
                              projects={projects}
                              category={category}
                              getReqsFunc={gettingRequests}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </div>
            )}

            {/* Returned Requests */}
            {filteredApprovedRequests.some(
              (req: Request) => req.returned
            ) && (
              <div className="mt-4">
                <div className="px-6 py-3 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-gray-500" />
                    Returned Components
                  </h3>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-gray-100"
                >
                  {filteredApprovedRequests
                    .filter((req: Request) => req.returned)
                    .map((req: Request) => (
                      <motion.div
                        key={req._id}
                        variants={itemVariants}
                        className="p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors duration-150"
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

                            {req.returnedProject && (
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                <h1 className="text-gray-700">
                                  Used in project:{" "}
                                  <Badge
                                    variant="secondary"
                                    className="ml-1"
                                  >
                                    {req.returnedProject}
                                  </Badge>
                                </h1>
                              </div>
                            )}

                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <h1 className="text-gray-700">
                                Return date:{" "}
                                {format(
                                  new Date(req.date),
                                  "MMM dd, yyyy"
                                )}
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
                                  <p className="max-w-xs">
                                    {req.purpose}
                                  </p>
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
                                      <Badge
                                        variant="outline"
                                        className="ml-1"
                                      >
                                        {req.quantity}
                                      </Badge>
                                    </h1>
                                  </div>
                                  {req.returnedProject && (
                                    <div className="flex items-center">
                                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                      <h1 className="text-sm text-gray-700">
                                        Used in project:{" "}
                                        {req.returnedProject}
                                      </h1>
                                    </div>
                                  )}
                                  <div className="flex items-start">
                                    <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                                    <h1 className="text-sm text-gray-700">
                                      {req.purpose}
                                    </h1>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <CheckCircle className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              No approved requests
            </h3>
            <p className="text-gray-500 mt-2 max-w-md">
              {searchQuery
                ? "No approved requests match your search criteria."
                : "There are no approved inventory requests at the moment."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </TabsContent>
  )
}

export default ApprovedRequestsTab

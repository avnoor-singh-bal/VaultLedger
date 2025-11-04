import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Component, Usage } from "@/models/models";
import { motion } from "framer-motion";
import {
  Archive,
  CheckCircle,
  ExternalLink,
  Info,
  Package,
  Tag,
} from "lucide-react";

type Props = {
  component: Component;
  role: number;
};

const InventoryInfoButton: React.FC<Props> = ({ component, role }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-primary/10 transition-colors duration-200"
        >
          <Info className="h-5 w-5 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Inventory Information
          </DialogTitle>
        </DialogHeader>
        {/* Component Card */}
        <div className="max-h-[83vh] overflow-y-auto">
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="md:flex">
              <div className="md:shrink-0 p-4 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="relative">
                  <div
                    className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"
                    style={{ animationDuration: "3s" }}
                  ></div>
                  <img
                    src={`https://utfs.io/f/${component.image}`}
                    alt={component.component}
                    className="h-36 w-36 object-cover rounded-full border-2 border-primary/20 shadow-md transition-transform hover:scale-105 duration-300"
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {component.component}
                  </h1>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag className="h-4 w-4 text-primary/70" />
                    <span className="font-medium">Category:</span>{" "}
                    {component.category}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Archive className="h-4 w-4 text-primary/70" />
                    <span className="font-medium">In Stock:</span>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold mr-1">
                        {component.inStock}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4 text-primary/70" />
                    <span className="font-medium">Available:</span>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold mr-1">
                        {component.inStock - component.inUse}
                      </span>
                    </div>
                  </div>

                  {component.link && (
                    <div className="mt-4">
                      <a
                        href={component.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200"
                      >
                        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        <span className="font-medium">View Details</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Used Where Section */}
          {role !== 0 &&
            component.usedWhere &&
            component.usedWhere.length > 0 && (
              <div className="mt-4 w-full overflow-x-auto overflow-y-hidden">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Used Where:
                </h3>
                <div className="flex space-x-4 w-full mt-2 p-2 rounded-lg">
                  {component.usedWhere.map((use: Usage, index: number) => (
                    <motion.div
                      key={use._id}
                      className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {use.project ? (
                        <>
                          <div className="mb-2 pb-2 border-b border-gray-100">
                            <p className="font-bold text-primary">
                              {use.projectName}
                            </p>
                          </div>
                          <p className="font-medium text-gray-800">
                            {use.name}
                          </p>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p>Email: {use.email}</p>
                            <p>Phone: {use.phone}</p>
                            <p className="mt-2 inline-block px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                              Qty: {use.quantity}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-gray-800 mb-2">
                            {use.name}
                          </p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Email: {use.email}</p>
                            <p>Phone: {use.phone}</p>
                            <p className="mt-2 inline-block px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                              Qty: {use.quantity}
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryInfoButton;

"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import IssueInventoryButton from "./issueInventoryButton";
import EditInventoryButton from "./editInventoryButton";
import { Admin, Component } from "@/models/models";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { IconTrash } from "@tabler/icons-react";
import InventoryInfoButton from "./inventoryInfoButton";
import { useToast } from "@/hooks/use-toast";
import AddInventoryButton from "./addInventoryButton";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

const InventoryTable = () => {
  const [inventory, setInventory] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Component[]>([]);
  const user = useSelector((state: RootState) => state.UserData.user);
  const { toast } = useToast();
  useEffect(() => {
    const fetchInventory = async () => {
      if (user.role === 1) {
        try {
          const response = await fetch(`/api/inventory?pn=${user.category}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setInventory(data.inventory);
        } catch (err) {
          console.error("Error fetching inventory:", err);
          setError("Failed to load inventory.");
        } finally {
          setLoading(false);
        }
      } else {
        try {
          // Fetch categories
          const res = await fetch("/api/admin");
          const data = await res.json();
          const AdminsData = data.admins;
          const newCategories = [
            "Sample",
            ...AdminsData.map((admin: Admin) => admin.category),
          ];

          // Fetch inventory **after** categories are set
          const inventoryData = await Promise.all(
            newCategories.map(async (category) => {
              const response = await fetch(`/api/inventory?pn=${category}`);
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              const data = await response.json();
              return data.inventory;
            })
          );

          setInventory(inventoryData.flat());
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load data.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInventory();
  }, []);
  useEffect(() => {
    setFilteredData(
      inventory.filter((item) =>
        item.component.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [inventory, searchTerm]);

  // Real time changes
  const removeBlock = (id: string) => {
    setInventory((prevInventory) =>
      prevInventory.filter((item: Component) => item._id !== id)
    );
  };

  const deleteInventory = async (id: string, cat: string) => {
    try {
      const response = await fetch(`/api/inventory`, {
        method: "DELETE",
        body: JSON.stringify({
          _id: id,
          category: cat,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      await response.json();
      removeBlock(id);
      toast({ title: "Deleted!!" });
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        {user.role !== 0 && (
          <AddInventoryButton
            category={user.category}
            isSuperAdmin={user.role === 2}
          />
        )}
      </div>
      <Table>
        <TableCaption>A list of your inventory.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Component</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>In Stock</TableHead>
            <TableHead>In Use</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {filteredData.map((item: Component) => (
              <motion.tr
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <TableCell className="w-[100px]">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative h-12 w-12 rounded-md overflow-hidden"
                  >
                    <img
                      src={`https://utfs.io/f/${item.image}`}
                      alt={item.component}
                      className="w-10 h-10 rounded-full"
                    />
                  </motion.div>
                </TableCell>
                <TableCell className="font-medium w-[300px]">
                  {item.component}
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.inStock}</TableCell>
                <TableCell>{item.inUse}</TableCell>
                <TableCell className="text-right space-x-2">
                  <div className="flex space-x-2 justify-end">
                    <InventoryInfoButton component={item} role={user.role} />
                    {user.role !== 0 && (
                      <>
                        <EditInventoryButton
                          component={item}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button className="bg-red-700">
                              <IconTrash />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">
                                  Delete this Inventory
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Are your sure want to delete this Inventory?
                                </p>
                              </div>
                              <div className="grid gap-2">
                                <Button
                                  onClick={() => {
                                    deleteInventory(item._id, item.category);
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button>No</Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </>
                    )}
                    {user.role !== 1 && (
                      <IssueInventoryButton component={item} user={user} />
                    )}
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </>
  );
};

export default InventoryTable;

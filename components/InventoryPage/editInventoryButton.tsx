"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconEdit } from "@tabler/icons-react";
import { Component } from "@/models/models";

interface EditInventoryProps {
  component: Component
}
const EditInventoryButton: React.FC<EditInventoryProps> = ({
  component
}) => {
  const [newComponent, setNewComponent] = useState(component.component);
  const [newQuantity, setNewQuantity] = useState(component.inStock);
  const [newLink, setNewLink] = useState((component.link ? component.link : ""));

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only non-negative whole numbers
    const numericValue = Math.max(component.inUse, Math.floor(Number(value)));
    setNewQuantity(numericValue);
  };

  const updateInventory = async () => {
    try {
      const response = await fetch(`/api/inventory`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: 1,
          _id: component._id,
          inStock: newQuantity,
          category: component.category,
          component: newComponent,
          link: newLink,
        }),
      });

      await response.json();
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <IconEdit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Inventory</DialogTitle>
        </DialogHeader>
        <form onSubmit={updateInventory}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-lg font-bold">
                Component
              </Label>
              <Input
                id="name"
                placeholder="Servo Motor"
                className="col-span-3"
                value={newComponent}
                onChange={(e) => setNewComponent(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="quantity"
                className="text-right text-lg font-bold"
              >
                Quantity
              </Label>
              <Input
                id="quantity"
                placeholder="2"
                className="col-span-3"
                type="number"
                step="1"
                value={newQuantity}
                onChange={handleQuantityChange}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="link"
                className="text-right text-lg font-bold"
              >
                Link
              </Label>
              <Input
                id="link"
                placeholder="https://www.robu.in/.."
                className="col-span-3"
                type="text"
                step="1"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit">Edit Inventory</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInventoryButton;

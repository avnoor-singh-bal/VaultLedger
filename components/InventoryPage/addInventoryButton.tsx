"use client";

import React, { useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
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
import { UploadButton } from "@/lib/utils/uploadthing";
import { useState } from "react";
import SuperAdminInventoryCategoryCombo from "./superAdminInventoryCategory";

interface Props {
  category: string;
  isSuperAdmin: boolean;
}

const AddInventoryButton: React.FC<Props> = ({
  category,
  isSuperAdmin,
}) => {
  const [component, setComponent] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [invCategory, setInvCategory] = useState(category);
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = Math.max(1, Math.floor(Number(value)));
    setQuantity(numericValue);
  };

  // Submit
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (component === "") return;

    fetch(`/api/inventory`, {
      method: "POST",
      body: JSON.stringify({
        component: component,
        image: image,
        category: invCategory,
        inStock: quantity,
        link: link,
        inUse: 0,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
  }, [submitting]);
  const handleSubmit = () => {
    if (!image) {
      alert("Please upload an image before submitting.");
      return;
    }
    setSubmitting(!submitting);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="float-right text-md font-bold">
          <IconPlus />
          Add Inventory
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Inventory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Label className="text-lg font-bold">Image</Label>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  setImage(res[0].key);
                  setImageName(res[0].name);
                  alert("Upload Completed");
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
            {imageName && (
              <div style={{ marginTop: "10px" }} className="mb-2">
                <label>Uploaded Image:</label>
                <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
                  {imageName}
                </span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-lg font-bold">
                Component
              </Label>
              <Input
                id="name"
                placeholder="Servo Motor"
                className="col-span-3"
                value={component}
                onChange={(e) => setComponent(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-lg font-bold">
                Category
              </Label>
              {isSuperAdmin ? <SuperAdminInventoryCategoryCombo onChange={setInvCategory}/> : (
                <Label htmlFor="name" className="text-right text-lg font-black">
                  {category}
                </Label>
              )}
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
                value={quantity}
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
                placeholder="https://www.robu.in/...."
                className="col-span-3"
                type="link"
                step="1"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit">Add Inventory</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryButton;

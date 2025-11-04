"use client"
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconCalendar, IconGitPullRequest } from "@tabler/icons-react";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Component, User } from "@/models/models";
import { useToast } from "@/hooks/use-toast";

interface Props {
  component: Component;
  user: User;
}

const IssueInventoryButton: React.FC<Props> = ({ component, user }) => {
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const issueInventory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    type ReqId = {
      acknowledged: boolean;
      insertedId: string;
    }
    let reqId;

    if (!date)
    {
      alert("Please select a returning date!!!");
      return;
    }

    // Issue Inventory Request
    try {
      const res = await fetch(`/api/request`, {
        method: "POST",
        body: JSON.stringify({
          category: component.category,
          inventoryId: component._id,
          component: component.component,
          image: component.image,
          userId: user.id,    // For notifications
          name: user.firstName + " " + user.lastName,
          email: user.email,
          phone: phone,
          purpose: purpose,
          quantity: quantity,
          date: date?.toISOString(),
          status: "Pending",
          returned: false,
          returnedProject: ""
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      reqId = await res.json() as ReqId;
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err);
    }

    // Adding requests to user_data
    try {
      const response = await fetch(`/api/user_data?pn=${user.id}`, {
        method: "POST",
        body: JSON.stringify({
          inventoryId: component._id,
          inventoryName: component.component,
          inventoryImage: component.image,
          reqId: reqId?.insertedId,
          purpose: purpose,
          quantity: quantity,
          returningDate: date?.toISOString(),
          status: "Pending",
          returned: false
        }),
        headers: {
          "Content-type": "application/json",
        },
      });

      await response.json();
      toast ({title: "Requested!!"});
      setOpen(false);
      setPhone("");
      setPurpose("");
      setQuantity(1);
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = Math.min(
      component.inStock - component.inUse,
      Math.max(1, Math.floor(Number(value)))
    );
    setQuantity(numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconGitPullRequest />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Requesting Inventory</DialogTitle>
          <div className="grid grid-cols-2">
            <div className="flex justify-end">
              <img
                src={`https://utfs.io/f/${component.image}`}
                alt={component.component}
                className="w-20 h-20"
              />
            </div>
            <div className="h-full flex text-lg items-center text-black p-5">
              <div>
                <h1>{component.component}</h1>
                <h1>In Stock: {component.inStock}</h1>
              </div>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={issueInventory}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name:
              </Label>
              <Label htmlFor="name" className="font-extrabold col-span-3">
                {user.firstName + " " + user.lastName}
              </Label>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Email
              </Label>
              <Label htmlFor="name" className="font-extrabold col-span-3">
                {user.email}
              </Label>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Mobile Number
              </Label>
              <Input
                id="number"
                placeholder="Your Mobile Number"
                className="col-span-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
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
              <Label htmlFor="username" className="text-right">
                Purpose for issuinng
              </Label>
              <Textarea
                id="description"
                placeholder="I need for project .... this and that"
                className="col-span-3"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Returning Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <IconCalendar />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date < new Date()
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button type="submit">Request</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IssueInventoryButton;

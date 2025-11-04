"use client";
import { Admin } from "@/models/models";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const CoSuperAdminsCard = () => {
  // State to store admins
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [category, setCategory] = useState("");
  const [newAdminEmail, setEmail] = useState("");

  // Fetching admin data on component mount
  useEffect(() => {
    const getAdmins = async () => {
      try {
        const res = await fetch("/api/admin");
        const data = await res.json();
        setAdmins(data.admins);
      } catch (error) {
        alert(error);
        console.error("Failed to fetch admins:", error);
      }
    };
    getAdmins();
  }, []);

  const addAdmin = async () => {
    try {
      await fetch("/api/admin", {
        method: "POST",
        body: JSON.stringify({
          email: newAdminEmail,
          category: category,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
    } catch (error) {
      console.error("Failed to add new admin:", error);
    }
  };
  const deleteAdmin = async (id: string) => {
    try {
      await fetch("/api/admin", {
        method: "DELETE",
        body: JSON.stringify({
          _id: id,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
    } catch (error) {
      console.error("Failed to add new admin:", error);
    }
  };

  const formSubmitHandler = () => {
    addAdmin();
  };
  const handleDelete = (_id: string) => {
    deleteAdmin(_id);
    setAdmins(admins.filter((admin) => admin._id !== _id));
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <div className="grid grid-cols-2">
        <h2 className="text-xl font-semibold mb-2">Admins</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="float-right text-md font-bold">
              <IconPlus />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Admin</DialogTitle>
            </DialogHeader>
            <form onSubmit={formSubmitHandler}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="name"
                    className="text-right text-lg font-bold"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="robotics@iitrpr.ac.in"
                    className="col-span-3"
                    value={newAdminEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="name"
                    className="text-right text-lg font-bold"
                  >
                    Category
                  </Label>
                  <Input
                    id="name"
                    placeholder="Robotics"
                    className="col-span-3"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Add</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {admins.length > 0 ? (
        <ul className="divide-y mt-5">
          {admins.map((admin: Admin) => (
            <li
              key={admin._id}
              className="flex justify-between items-center p-3 hover:bg-gray-100 border rounded-lg shadow-md"
            >
              <span className="text-gray-800">{admin.email}</span>
              <button
                onClick={() => handleDelete(admin._id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <IconTrash size={18} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No admins found.</p>
      )}
    </div>
  );
};

export default CoSuperAdminsCard;

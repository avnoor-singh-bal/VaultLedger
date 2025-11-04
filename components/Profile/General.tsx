"use client";
import React, { useState } from "react";
import { TabsContent } from "../ui/tabs";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  Edit2,
  LucideUser,
  Mail,
  Save,
  Tag,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { User } from "@/models/models";
import { Alert, AlertDescription } from "../ui/alert";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/features/userdata/UserDataSlice";
import { useUser } from "@clerk/nextjs";

interface GeneralProps {
  currentUser: User;
}

const General: React.FC<GeneralProps> = ({ currentUser }) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(currentUser);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const getRoleName = (level: number) => {
    if (level === 0) return "User";
    else if (level === 1) return "Admin";
    else if (level === 2) return "Co-Super Admin";
    else if (level === 3) return "BoST";
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedUser({ ...currentUser });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      dispatch(setUser(editedUser));
      await user!.update({
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
      });
      setEditedUser(editedUser);
      setIsEditing(false);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      {showSuccessAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-6"
        >
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile updated successfully!
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {showErrorAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-6"
        >
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <TabsContent value="details">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-center md:text-left gap-4">
                <div>
                  <CardTitle className="text-2xl">
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Manage your personal details and account information
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleEditToggle}
                  className="flex items-center gap-1"
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4" /> Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4" /> Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col justify-center items-center space-y-3 w-full md:w-auto"
                >
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      alt={`${currentUser.firstName} ${currentUser.lastName}`}
                    />
                    <AvatarFallback className="text-2xl">
                      {currentUser.firstName.charAt(0)}
                      {currentUser.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <div className="flex-1 space-y-4 w-full">
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <LucideUser className="h-4 w-4 text-gray-500" /> First
                        Name
                      </label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          name="firstName"
                          value={editedUser.firstName}
                          onChange={handleInputChange}
                          className="border-gray-300"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
                          {currentUser.firstName}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <LucideUser className="h-4 w-4 text-gray-500" /> Last
                        Name
                      </label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          name="lastName"
                          value={editedUser.lastName}
                          onChange={handleInputChange}
                          className="border-gray-300"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
                          {currentUser.lastName}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <Separator className="my-4" />
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4 text-gray-500" /> Email Address
                    </label>
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-50 rounded-md border border-gray-200 w-full font-mono">
                        {currentUser.email}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" /> Role
                      </label>
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-50 rounded-md border border-gray-200 w-full">
                          {getRoleName(currentUser.role)}
                        </div>
                      </div>
                    </div>
                    {currentUser.category && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-500" /> Category
                        </label>
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-50 rounded-md border border-gray-200 w-full">
                            {currentUser.category}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <LucideUser className="h-4 w-4 text-gray-500" /> User ID
                    </label>
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-50 rounded-md border border-gray-200 w-full font-mono">
                        {currentUser.id}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end pt-0">
                <Button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </TabsContent>
    </>
  );
};

export default General;

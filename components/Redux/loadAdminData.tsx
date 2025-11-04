"use client";
import { Admin } from "@/models/models";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

interface props {
  superAdmin: string;
  setRole: (role: number) => void;
  setCategory: (category: string) => void;
}

const LoadAdminData: React.FC<props> = ({
  superAdmin,
  setRole,
  setCategory,
}) => {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCategory, setAdminCategory] = useState("");
  const [isCoSuperAdmin, setIsCoSuperAdmin] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch(`/api/admin`);
        const resJson = await res.json();
        const adminIdsJson = resJson.admins as Admin[];
        adminIdsJson.map((admin: Admin) => {
          if (user!.primaryEmailAddress?.emailAddress == admin.email) {
            setIsAdmin(true);
            setAdminCategory(admin.category);
          }
        });
      } catch (err) {
        console.error("Error fetching Admins:", err);
      }
    };
    const fetchCoSuperAdmins = async () => {
      try {
        const res = await fetch(`/api/co_admins`);
        const resJson = await res.json();
        const adminIdsJson = resJson.admins as Admin[];
        const adminIds = adminIdsJson.map((admin: Admin) => admin.email);
        if (!user || !user.primaryEmailAddress) return;
        setIsCoSuperAdmin(
          adminIds.includes(user.primaryEmailAddress.emailAddress!)
        );
      } catch (err) {
        console.error("Error fetching Admins:", err);
      }
    };

    if (user) {
      if (user && user.primaryEmailAddress && user.primaryEmailAddress.emailAddress === superAdmin) {
        setRole(3);
        setCategory("Sample");
        return;
      }
      fetchCoSuperAdmins();
      fetchAdmins();
    }
  }, [user, setIsAdmin, setRole, setCategory, setIsCoSuperAdmin]);

  useEffect(() => {
    if (isCoSuperAdmin) {
      setRole(2);
      setCategory("Sample");
      return;
    }
    if (isAdmin) {
      setRole(1);
      setCategory(adminCategory);
      return;
    }
  }, [isAdmin, isCoSuperAdmin, adminCategory, setRole, setCategory])

  return <></>;
};

export default LoadAdminData;

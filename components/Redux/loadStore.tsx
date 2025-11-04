"use client";

import {
  setCategory,
  setEmail,
  setFirstName,
  setId,
  setLastName,
  setRole,
} from "@/lib/features/userdata/UserDataSlice";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoadAdminData from "./loadAdminData";

interface props {
  superAdmin: string;
}

const LoadStore: React.FC<props> = ({ superAdmin }) => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const [role, setCurRole] = useState(0);
  const [category, setCurCategory] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(setId(user.id));
      dispatch(setFirstName(user.firstName!));
      dispatch(setLastName(user.lastName!));
      if (user && user.primaryEmailAddress)
        dispatch(setEmail(user.primaryEmailAddress.emailAddress!));
      dispatch(setRole(role));
      dispatch(setCategory(category));
    }
  }, [user, dispatch, role, category]);
  return (
    <>
      <LoadAdminData
        superAdmin={superAdmin}
        setRole={setCurRole}
        setCategory={setCurCategory}
      />
    </>
  );
};

export default LoadStore;

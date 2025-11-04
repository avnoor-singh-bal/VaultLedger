import AdminsCard from "@/components/AdminPortal/admins";
import CoSuperAdminsCard from "@/components/AdminPortal/coSuperAdmins";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const user = await currentUser();
  if (user?.primaryEmailAddress?.emailAddress !== process.env.SUPER_ADMIN)
    return <p>You are not authorised to access to this page</p>;
  return(
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 pt-5">
        <AdminsCard/>
        <CoSuperAdminsCard/>
    </div>
  );
};

export default page;

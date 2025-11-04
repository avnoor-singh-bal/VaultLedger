import MyInventory from "@/components/MyInventory/myInventory";
import React from "react";

const page = async () => {
  return (
    <div className="mt-10 mx-5 rounded-xl p-3 shadow-lg border border-gray-200 relative mb-5">
      <MyInventory/>
    </div>
  );
};

export default page;

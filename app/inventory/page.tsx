import InventoryTable from "@/components/InventoryPage/InventoryTable";
import React from "react";

const InventoryPage = async () => {

  return (
    <div className="mt-10 mx-5 rounded-xl p-3 shadow-lg border border-gray-200 relative mb-5">
      <InventoryTable/>
    </div>
  );
};

export default InventoryPage;

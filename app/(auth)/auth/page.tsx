"use client";

import AuthTabSystem from "@/components/Auth/AuthTabSystem";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("v") || "signin";

  return <AuthTabSystem tab={view} />;
}

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthContent />
      </Suspense>
    </div>
  );
}

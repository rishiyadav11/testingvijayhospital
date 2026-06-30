"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RedirectCountdown() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
      <p className="text-xs text-on-surface-variant font-medium">
        Redirecting you to the home page in{" "}
        <span className="font-bold text-primary text-sm font-display">{countdown}</span>{" "}
        seconds...
      </p>
    </div>
  );
}

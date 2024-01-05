import React, { useState, useEffect } from "react";

export default function Loader() {
  const [loadingText, setLoadingText] = useState("Loading...");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingText("Taking longer than usual");
    }, 7000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center py-10 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-800 border-t-transparent"></div>
      <span className="my-2 animate-pulse text-sm text-gray-900">
        {loadingText}
      </span>
    </div>
  );
}

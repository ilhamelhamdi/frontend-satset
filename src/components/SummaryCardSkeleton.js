import React from "react";

export const SummaryCardSkeleton = ({ item }) => {
  return (
    <div className="w-full flex flex-col items-center max-w-sm px-5 py-5 border-2 rounded-xl shadow-md m-4 bg-white animate-pulse space-y-2">
      <div className="h-7 w-8 bg-slate-300"></div>
      <div className="h-5 w-36 bg-slate-300"></div>
    </div>
  )
}
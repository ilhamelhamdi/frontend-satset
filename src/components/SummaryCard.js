import React from "react";

export const SummaryCard = ({item}) => {
    return (
        <div className="w-full flex flex-col max-w-sm px-5 py-4 border-2 rounded-xl hover:shadow-md m-4 bg-white">
            <h1 className="text-3xl font-semibold text-center">{item.amount}</h1>
            <h1 className="text-lg font-semibold text-center">{item.name}</h1>
        </div>
    )
}
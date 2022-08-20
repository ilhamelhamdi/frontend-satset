import React, { useState } from "react";

export const ProposalCard = ({item, action}) => {
    const [onHover, setOnHover] = useState(false)

    return (
        <div className="flex flex-col w-full border-2 rounded-xl hover:shadow-md m-4 bg-white p-3">
            <div className="flex justify-center mb-5">
                <img src={item.image} className="rounded-full w-20 h-20"/>
            </div>
            <h1 className="font-semibold text-lg truncate" onMouseOver={() => setOnHover(true)} onMouseOut={() => setOnHover(false)}>{item.title ? item.title : item.name}</h1>
            {
                onHover &&
                    <div className="relative" style={{top: "-1.75rem"}}>
                        <p className="absolute bottom-0 bg-gray-700 text-white rounded-lg p-1 text-xs">{item.title ? item.title : item.name}</p>
                    </div>
            }
            <h1 className="text-md">{item.instructor ? item.instructor : (item.gender === 'm' ? 'Male' : 'Female')}</h1>
            <div className="flex mt-2 lg:flex-col xl:flex-row  gap-1">
                <button className="w-full rounded-lg py-1 border-2 border-teal-700 bg-white text-teal-700 hover:bg-teal-700 hover:text-white transition" onClick={() => action(item.id, 'Approved', 'success')}>Approve</button>
                <button className="w-full rounded-lg py-1 border-2 border-red-700 bg-white text-red-700 hover:bg-red-700 hover:text-white transition" onClick={() => action(item.id, 'Rejected', 'error')}>Reject</button>
            </div>
        </div>
    )
}
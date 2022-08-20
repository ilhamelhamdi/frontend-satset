const SummaryCardSkeleton = ({children}) => {
    return (
        <div className="w-full flex flex-col px-5 py-4 border-2 rounded-xl hover:shadow-md m-4 bg-white animate-pulse">
            {/* <div className="h-10 bg-slate-300 self-center w-16 rounded mb-3"></div> */}
            {/* <div className="h-6 bg-slate-300 self-center w-64 rounded"></div> */}
            {children}
        </div>
    )
}

export default SummaryCardSkeleton
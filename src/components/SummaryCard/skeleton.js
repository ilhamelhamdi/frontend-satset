const SummaryCardSkeleton = ({children}) => {
    return (
        <div className="w-full flex flex-col px-5 py-4 border-2 rounded-xl hover:shadow-md m-4 bg-white animate-pulse">
            {children}
        </div>
    )
}

export default SummaryCardSkeleton
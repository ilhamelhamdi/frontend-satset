const ChartSkeleton = () => {
    return (
        <div className="w-full max-w-xl flex flex-col p-5 border-2 rounded-xl hover:shadow m-4 bg-white animate-pulse">
            <div className="h-6 bg-slate-300 w-16 rounded mb-3"></div>
            <div className="h-64 bg-slate-300 self-center w-full rounded"></div>
        </div>
    )
}

export default ChartSkeleton
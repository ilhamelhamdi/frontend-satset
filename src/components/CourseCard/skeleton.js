import Images from "../../images"

const CourseCardSkeleton = ({ children }) => {
  return (
    <div className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
      <div className="mx-2 mb-4 shadow hover:shadow-lg rounded-lg overflow-hidden animate-pulse">
        <div style={{ paddingTop: '56.25%' }} className="w-full relative overflow-hidden bg-slate-300" />
        <div className="p-4 flex flex-col">
          <div className="w-full h-5 bg-slate-300 mb-2"></div>
          <div className="w-full h-5 bg-slate-300 mb-3"></div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default CourseCardSkeleton
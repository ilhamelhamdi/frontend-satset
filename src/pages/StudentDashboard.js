import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useSWR from "swr"

import Button from "../components/Button"
import CourseCard from "../components/CourseCard"
import CourseCardSkeleton from "../components/CourseCard/skeleton"
import Header from "../components/Header"
import MainLayout from "../components/MainLayout"
import { SummaryCard } from "../components/SummaryCard/SummaryCard"
import { SummaryCardSkeleton } from "../components/SummaryCardSkeleton"
import { API_URL } from "../config"
import { AuthContext } from "../context"
import Icons from "../images/icons"


const CoursesList = (props) => {
  const { data, error } = useSWR(`${API_URL}/enrolled-course/${props.index}`, props.fetcher)

  // Loading handler
  if (!data) {
    return [1, 2, 3, 4, 5].map((i) => (
      <CourseCardSkeleton key={i}>
        <div className="mb-5 h-4 bg-slate-300 w-1/3" />
        <div className="mb-1 h-4 w-full bg-slate-300" />
        <div className="mb-1 h-4 bg-slate-300 w-1/6 self-end" />
      </CourseCardSkeleton>
    ))
  }

  // Fetch success handler
  if (data) {
    return data.map((course) => {
      const status = (course.completed_content === course.total_content) ? 'Completed' : 'In Progress'
      if (props.status === 'All' || props.status === status) return (
        <CourseCard key={course.id} title={course.title} image={course.image} id={course.id}>
          <p className="mb-4 font-semibold text-slate-500">{course.instructor_name}</p>
          <div className="border-solid border border-teal-700 h-4 rounded-full overflow-hidden">
            <div
              style={{ width: (course.completed_content / course.total_content * 100) + '%' }}
              className="bg-teal-700 h-full"
            />
          </div>
          <div className="text-right text-teal-700">
            {course.completed_content}/{course.total_content}
          </div>
        </CourseCard>

      )
    })
  }
  if (error) {
    console.log(error);
  }

}

const StudentDashboard = () => {
  // CHECK AUTHENTICATION
  const { auth } = useContext(AuthContext)
  useEffect(() => {
    if (auth === null) navigate('/')
  }, [])

  // FETCH Summary Data
  const fetcher = async (url) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + auth.accessToken.value
      }
    }
    const res = await fetch(url, requestOptions)
    if (res.status === 403) navigate('/403', { replace: true })
    return (await res.json()).data
  }

  const { data: summaryData, error: summaryError } = useSWR(`${API_URL}/student-dashboard`, fetcher)

  const [search, setSearch] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const [courseStatus, setCourseStatus] = useState('All')

  const navigate = useNavigate()


  let courses = []
  for (let i = 0; i < pageIndex; i++) {
    courses.push(<CoursesList index={i + 1} key={i} status={courseStatus} fetcher={fetcher} />)
  }
  useEffect(() => {
    setPageIndex(1)
  }, [courseStatus])


  return (
    <MainLayout>
      <Header />
      <div className="container mx-auto xl:max-w-screen-xl mt-4 px-4">
        <div>
          <h1 className="text-3xl font-bold text-teal-700">Summary</h1>
          <div className="flex justify-between">
            {
              summaryData ?
                <>
                  <SummaryCard item={{ name: 'Enrolled Course', amount: summaryData.enrolled_course }} />
                  <SummaryCard item={{ name: 'Completed Course', amount: summaryData.completed_course }} />
                  <SummaryCard item={{ name: 'Completed Lecture', amount: summaryData.completed_lecture }} />
                  <SummaryCard item={{ name: 'Completed Quiz', amount: summaryData.completed_quiz }} />
                </>
                :
                <>
                  <SummaryCardSkeleton />
                  <SummaryCardSkeleton />
                  <SummaryCardSkeleton />
                  <SummaryCardSkeleton />
                </>
            }
          </div>
        </div>

        <hr />

        <div className="mt-4">
          <div className="flex flex-wrap justify-between">
            <h1 className="text-3xl font-bold text-teal-700">Your Courses</h1>
            <div className="flex w-1/3 justify-between">
              <select
                name="course-status"
                value={courseStatus}
                onChange={e => setCourseStatus(e.target.value)}
                className="rounded-lg px-2 outline outline-2 outline-slate-200 focus:outline-teal-700"
              >
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
              <div className="relative flex-auto ml-8 mr-2">
                <div className="absolute inset-y-0 left-2 flex items-center">
                  <Icons.Search className="fill-stone-300" />
                </div>
                <input
                  type="text"
                  id="search-box"
                  placeholder="Search courses..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full text-stone-700 pl-12 py-2 rounded-lg outline outline-2 outline-slate-200 focus:outline-teal-700"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap mt-4">
            {courses}
          </div>

          <div className="flex justify-center">
            <Button onClick={() => setPageIndex(pageIndex + 1)}>Load more...</Button>
          </div>

        </div>
      </div>
    </MainLayout>
  )
}

export default StudentDashboard
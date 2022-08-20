import { useState } from "react"
import Button from "../components/Button"
import CourseCard from "../components/CourseCard"
import Header from "../components/Header"
import MainLayout from "../components/MainLayout"
import { SummaryCard } from "../components/SummaryCard"
import Icons from "../images/icons"

const StudentDashboard = () => {
  const [search, setSearch] = useState('')

  const summaryData = [
    {
      name: 'Course enrolled',
      amount: 214
    },
    {
      name: 'Course completed',
      amount: 193
    },
    {
      name: 'Lectures completed',
      amount: 154
    },
    {
      name: 'Quizzes completed',
      amount: 50
    },
  ]

  const courseEnrolled = [
    {
      title: "Learn Python from Scratch Blablabla Bla Bla Bla",
      instructor: "Hamdi",
      total_content: 18,
      completed_content: 10
    },
    {
      title: "Learn Python from Scratch Blablabla Bla Bla Bla",
      instructor: "Hamdi",
      total_content: 4,
      completed_content: 3
    },
    {
      title: "Learn Python from Scratch Blablabla Bla Bla Bla",
      instructor: "Hamdi",
      total_content: 5,
      completed_content: 5
    },
    {
      title: "Learn Python from Scratch Blablabla Bla Bla Bla",
      instructor: "Hamdi",
      total_content: 10,
      completed_content: 1
    },
    {
      title: "Learn Python from Scratch Blablabla Bla Bla Bla",
      instructor: "Hamdi",
      total_content: 10,
      completed_content: 9
    },
  ]

  return (
    <MainLayout>
      <Header />
      <div className="container mx-auto xl:max-w-screen-xl mt-4 px-4">
        <div>
          <h1 className="text-3xl font-bold text-teal-700">Summary</h1>
          <div className="flex justify-between">
            {
              summaryData.map((val, idx) => (
                <SummaryCard key={idx} item={val} />
              ))
            }
          </div>
        </div>

        <hr />

        <div className="mt-4">
          <div className="flex flex-col lg:flex-row lg:justify-between">
            <h1 className="text-3xl font-bold text-teal-700">Your Courses</h1>
            <div className="flex w-full lg:w-1/3 mt-4 lg:mt-0">
              <select name="course-status" className="rounded-lg px-2 outline outline-2 outline-slate-200 focus:outline-teal-700">
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
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
            {courseEnrolled.map((course, idx) => (
              <CourseCard key={idx} title={course.title} image={course.image}>
                <p className="mb-4 font-semibold text-slate-500">{course.instructor}</p>
                <div className="border-solid border border-teal-700 h-4">
                  <div
                    style={{ width: (course.completed_content / course.total_content * 100) + '%' }}
                    className="bg-teal-700 h-full"
                  />
                </div>
                <div className="text-right text-teal-700">
                  {course.completed_content}/{course.total_content}
                </div>
              </CourseCard>
            ))}
          </div>

          <div className="flex justify-center">
            <Button>Load more...</Button>
          </div>

        </div>
      </div>
    </MainLayout>
  )
}

export default StudentDashboard
import Header from "../components/Header"
import MainLayout from "../components/MainLayout"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from "../components/Carousel";
import Button from "../components/Button";
import CourseCard from "../components/CourseCard";
import { useState } from "react";
import { API_URL } from "../config";
import CourseCardSkeleton from "../components/CourseCard/skeleton";
import useSWR from "swr";

const CoursesList = ({ index }) => {
  const fetchCourses = async (...args) => {
    const res = await fetch(...args)
    return (await res.json()).data
  }

  const { data, error } = useSWR(`${API_URL}/courses/${index}`, fetchCourses)

  // Loading handler
  if (!data && !error) {
    return [1, 2, 3, 4, 5].map((i) => (
      <CourseCardSkeleton key={i}>
        <div className="w-1/2 h-4 bg-slate-300 mb-7" />
        <div className="w-1/2 h-4 bg-slate-300 self-end" />
      </CourseCardSkeleton>
    ))
  }

  // Fetch success handler
  if (data) {
    return data.map(course => (
      <CourseCard key={course.id} title={course.title} image={course.image} id={course.id}>
        <p className="mb-4 font-semibold text-teal-700">{course.instructor_name}</p>
        <p className="text-right ">{course.enrolled_student} students</p>
      </CourseCard>
    ))
  }

}

const Homepage = () => {
  const [pageIndex, setPageIndex] = useState(1)

  const courses = []
  for (let i = 0; i < pageIndex; i++) {
    courses.push(<CoursesList index={i + 1} key={i} />)
  }

  return (
    <MainLayout>
      <Header />
      <div className="container mx-auto xl:max-w-screen-xl px-4 pt-2 mb-8">
        <Carousel />

        <div className="w-full mb-4">
          <h2 className="text-3xl font-bold mb-4 text-teal-700">Popular Courses</h2>
          <div className="flex flex-wrap">
            {courses}
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setPageIndex(pageIndex + 1)}>Load more...</Button>
          </div>
        </div>

        <hr />

        <div className="w-full my-4">
          <h2 className="text-3xl font-bold mb-4 text-teal-700">Main Features</h2>
          <div className="flex flex-col lg:flex-row space-x-2">
            <div className="w-full lg:w-1/2 flex items-center">
              <img src="lectures.jpg" alt="" className="h-60 w-60 md:h-80 md:w-80 object-cover" />
              <div className="w-1/2 ml-4">
                <h3 className="text-2xl font-bold">Various Lectures</h3>
                <p>Grasp the material from various format you want (text, audio, video, etc)</p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center">
              <img src="quiz.jpg" alt="" className="h-60 w-60 md:h-80 md:w-80 object-cover" />
              <div className="w-1/2 ml-4">
                <h3 className="text-2xl font-bold">Interactive Quizzes</h3>
                <p>Check your understanding by taking the quizzes.</p>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="w-full flex my-4">
          <img src="webinar.jpg" alt="" className="w-1/2" />
          <div className="w-1/2 space-y-4 flex flex-col justify-center">
            <h2 className="text-3xl text-teal-700 font-bold">Become An Instructor</h2>
            <p>Be the one who share the knowledge to the others. We provide the tools and skills to teach what you love.</p>
            <Button>Start teaching today</Button>
          </div>
        </div>
      </div>
    </MainLayout >
  )
}

export default Homepage
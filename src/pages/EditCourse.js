import { useContext, useEffect, useState } from "react"
import useSWR from "swr"

import Button from "../components/Button"
import Header from "../components/Header"
import InputQuizModal from "../components/CreateCourse/InputQuizModal"
import MainLayout from "../components/MainLayout"
import QuizBox from "../components/CreateCourse/QuizBox"
import Icons from "../images/icons"
import LectureBox from "../components/CreateCourse/LectureBox"
import InputLectureModal from "../components/CreateCourse/InputLectureModal"
import { API_URL } from "../config"
import { AuthContext } from "../context"
import { useNavigate, useParams } from "react-router-dom"
import Toast from "../components/Toast"
import ContentBoxSkeleton from "../components/CreateCourse/ContentBoxSkeleton"
import Images from "../images"


const CourseHeaderSkelton = () => (
  <div className="flex flex-col lg:flex-row mb-10 animate-pulse">
    <div className="w-full lg:w-1/2 flex items-center">
      <div style={{ paddingTop: '56.25%' }} className="w-full bg-slate-300"></div>
    </div>
    <div className="w-full lg:w-1/2 lg:pl-8 mt-2">
      <div className="w-full h-8 bg-slate-300 mb-2" />
      <div className="w-full h-8 bg-slate-300 mb-2" />
      <div className="w-1/3 h-5 bg-slate-300 mb-2" />
      <div className="w-1/5 h-4 bg-slate-300 mb-2" />
      <div>
        <div className="w-full h-4 bg-slate-300 mb-2" />
        <div className="w-full h-4 bg-slate-300 mb-2" />
        <div className="w-full h-4 bg-slate-300 mb-2" />
        <div className="w-full h-4 bg-slate-300 mb-2" />
      </div>
    </div>
  </div>
)

const CourseHeader = ({ item, status }) => {
  const [showMoreDesc, setShowMoreDesc] = useState(false)

  return (
    <div className="flex flex-col lg:flex-row mb-10">
      <div className="w-full lg:w-1/2 flex items-center">
        <img src={item ? item.image : Images.CourseBanner} alt="courses" className="border-2 w-full" />
      </div>
      <div className="w-full lg:w-1/2 lg:pl-8">
        <h1 className="font-bold text-3xl">{item ? item.title : 'Title'}</h1>
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-semibold text-lg">Status: {status || 'Approved'}</h1>
        </div>
        <h1 className="font-semibold italic">Description</h1>
        <p>
          {
            item.description &&
            (showMoreDesc ? item.description : item.description.substring(0, 630) + '...')
          }
          {item.description && (item.description.length > 630 &&
            <button className="text-blue-400 font-semibold ml-1" onClick={() => setShowMoreDesc(!showMoreDesc)}>
              {showMoreDesc ? 'Show Less' : 'Show More'}
            </button>)
          }
        </p>
      </div>
    </div>
  )
}

const EditCourse = () => {
  // CHECK AUTHENTICATION
  const { auth } = useContext(AuthContext)
  useEffect(() => {
    if (auth === null) navigate('/')
    if (auth.user.role !== 'instructor') navigate('/403', { replace: true })
  }, [])


  const courseId = (useParams()).id
  const [contents, setContents] = useState(JSON.parse(localStorage.getItem('contents:' + courseId)))
  const [showInputLecture, setShowInputLecture] = useState(false)
  const [showInputQuiz, setShowInputQuiz] = useState(false)
  const [indexEdit, setIndexEdit] = useState(-1)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  const navigate = useNavigate()

  // FETCH COURSE DETAIL
  const fetcher = async (url, token) => {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      },
    })
    if (res.status === 403) {
      navigate('/403')
    } else if (res.status === 401) {
      navigate('/register')
    }
    const data = await res.json()
    return data
  }

  const fetchCourse = async (url, token) => {
    return (await fetcher(url, token))
  }

  const fetchOrder = async (url, token) => {
    return (await fetcher(url, token)).order
  }
  const courseStatus = 'Approved'
  const { data: course, error: errorCourse } = useSWR([`${API_URL}/course/${courseId}`, auth.accessToken.value], fetchCourse)
  const { data: courseOrder, error: errorOrder } = useSWR([`${API_URL}/course-order/${courseId}`, auth.accessToken.value], fetchOrder)


  useEffect(() => {
    // SAVE Data to Local Storage
    if (course && courseOrder) {

      const newContents = courseOrder.map(type => {
        if (type === 'l') {
          const content = course.data.lectures.slice(0, 1)[0]
          course.data.lectures.splice(0, 1)
          return {
            type: 'l',
            data: content
          }
        }
        if (type === 'q') {
          const content = course.data.quizzes.slice(0, 1)[0]
          course.data.quizzes.splice(0, 1)
          return {
            type: 'q',
            data: content
          }
        }
      })

      localStorage.setItem('contents:' + courseId, JSON.stringify(newContents))
      setContents(newContents)
      setFetchLoading(false)
    }
  }, [course, courseOrder])


  useEffect(() => {
    localStorage.setItem('contents:' + courseId, JSON.stringify(contents))
  }, [contents])

  useEffect(() => {
    setFetchLoading(true)
    localStorage.removeItem('temp')
  }, [])


  return (
    <MainLayout>
      <Header />
      <div className="container mx-auto xl:max-w-screen-xl pt-2 mb-12 px-4 lg:px-0">
        {
          fetchLoading ?
            <CourseHeaderSkelton /> :
            <CourseHeader {...{ item: course.data, status: courseStatus }} />
        }
        <div className="mb-6">
          <h1 className="text-3xl font-bold my-4">Content</h1>
          {
            fetchLoading ?
              <div>
                <ContentBoxSkeleton />
                <ContentBoxSkeleton />
                <ContentBoxSkeleton />
              </div> :
              <>
                {contents.map((content, idx) => {
                  if (content === undefined) return null
                  if (content.type === 'l') return <LectureBox key={idx} {...{ contents, setContents, setShowInputLecture, setIndexEdit, idx }} />
                  if (content.type === 'q') return <QuizBox key={idx} {...{ contents, setContents, setShowInputQuiz, setIndexEdit, idx }} />
                })}
                <div className="flex justify-end space-x-4">
                  <Button onClick={() => setShowInputLecture(true)}>+ Add Lecture</Button>
                  <Button onClick={() => setShowInputQuiz(true)}>+ Add Quiz</Button>
                </div>
              </>
          }
        </div>

      </div>

      {showInputLecture && <InputLectureModal {...{ setShowInputLecture, contents, setContents, indexEdit, setIndexEdit }} />}
      {showInputQuiz && <InputQuizModal {...{ setShowInputQuiz, contents, setContents, indexEdit, setIndexEdit }} />}

    </MainLayout>
  )
}

export default EditCourse
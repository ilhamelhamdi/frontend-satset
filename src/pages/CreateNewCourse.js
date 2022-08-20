import { useContext, useEffect, useState } from "react"
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
import { useNavigate } from "react-router-dom"


const CreateNewCourse = () => {
  // CHECK AUTHENTICATION
  const { auth } = useContext(AuthContext)
  useEffect(() => {
    if (auth === null) navigate('/')
  }, [])

  const MAX_TITLE = 70
  const MAX_DESC = 2000
  const [courseProfile, setCourseProfile] = useState(JSON.parse(localStorage.getItem('course-profile')))
  const [title, setTitle] = useState(courseProfile ? courseProfile.title : '')
  const [desc, setDesc] = useState(courseProfile ? courseProfile.desc : '')
  const [image, setImage] = useState(courseProfile ? courseProfile.image : { preview: '', raw: '' })
  const [contents, setContents] = useState(JSON.parse(localStorage.getItem('contents')) || [])
  const [showInputLecture, setShowInputLecture] = useState(false)
  const [showInputQuiz, setShowInputQuiz] = useState(false)
  const [indexEdit, setIndexEdit] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleImage = e => {
    if (e.target.files.length) {
      const data = {
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      }
      setImage(data)
      setCourseProfile({ ...courseProfile, image: data })
    }
  }

  const validateTitle = (value) => {
    if (value.length <= MAX_TITLE) setTitle(value)
  }
  const validateDesc = (value) => {
    if (value.length <= MAX_DESC) setDesc(value)
  }

  const imageUploadHandler = async () => {
    if (image.raw !== '') {
      const data = new FormData();
      data.append('image', image.raw)
      try {
        const res = await fetch('https://api.imgur.com/3/image', {
          method: "POST",
          headers: {
            'Authorization': 'Client-ID 35d873feaf37beb'
          },
          referrerPolicy: "no-referrer",
          body: data
        })
        if (res.status !== 200) throw Error('Failed to upload image')
        const json = await res.json()
        return json.data.link
      } catch (e) {
        console.log(e)
      }
    }
    return 'https://i.imgur.com//teA8hQ0.png'
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const lectures = []
      const quizzes = []
      const order = []

      contents.forEach(content => {
        if (content.type === 'l') {
          order.push('l')
          lectures.push(content.data)
        }
        if (content.type === 'q') {
          order.push('q')
          const questions = content.data.questions.map((val) => ({
            opt_true: val.optTrue,
            opt: val.options,
            question: val.title
          }))
          quizzes.push({ title, questions })
        }
      })

      const imageLink = await imageUploadHandler()

      const requestBody = {
        title,
        description: desc,
        image: await imageLink,
        lectures,
        quizzes,
        order
      }

      console.log(requestBody);

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.accessToken.value
        },
        body: JSON.stringify(requestBody)
      }

      const res = await fetch(`${API_URL}/course`, requestOptions)
      const courseId = (await res.json()).course_id
      console.log(courseId);

      localStorage.removeItem('course-profile')
      localStorage.removeItem('contents')

      navigate('/course/' + courseId)
    } catch (e) {
      alert(e);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setCourseProfile({ title, desc, image })
  }, [title, desc, image])

  useEffect(() => {
    localStorage.setItem('course-profile', JSON.stringify(courseProfile))
  }, [courseProfile])

  useEffect(() => {
    localStorage.setItem('contents', JSON.stringify(contents))
  }, [contents])

  useEffect(() => {
    localStorage.removeItem('temp')
  }, [])


  return (
    <MainLayout>
      <Header />
      <div className="container mx-auto xl:max-w-screen-xl pt-2 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-center">Create New Course</h1>

          <div id="title">
            <h2 className="text-xl font-bold text-teal-700 mb-2">Title</h2>
            <input
              type="text"
              placeholder="Insert your course title"
              value={title}
              onChange={e => validateTitle(e.target.value)}
              className="inline-block w-full outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
            />
            <p className="text-right text-slate-500">{title.length}/{MAX_TITLE}</p>
          </div>

          <div id="desc">
            <h2 className="text-xl font-bold text-teal-700 mb-2">Description</h2>
            <textarea
              type="text"
              placeholder="Insert your course description"
              cols={30}
              value={desc}
              onChange={e => validateDesc(e.target.value)}
              className="inline-block w-full outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
            />
            <p className="text-right text-slate-500">{desc.length}/{MAX_DESC}</p>
          </div>

          <div className="flex flex-col mb-4">
            <h2 className="text-xl font-bold text-teal-700 mb-2">Image</h2>
            <div className="w-1/2 self-center">
              <label htmlFor="upload-button" style={{ backgroundImage: image.preview ? 'url(' + image.preview + ')' : '', paddingTop: '56.25%' }} className="w-full block relative cursor-pointer group bg-center bg-no-repeat bg-cover bg-gray-200">
                {
                  !image.preview &&
                  <div className="flex flex-col items-center justify-center absolute inset-0">
                    <Icons.AddImg className="h-1/2 fill-teal-700/75 group-hover:fill-teal-700/100" />
                  </div>
                }
              </label>
              <input className="hidden" type="file" accept=".jpg, .jpeg, .png" id="upload-button" onChange={handleImage} />
              <p className="text-center">Tips: Image format .jpg .jpeg .png and minimum size 400 x 225 px (ratio 16:9)</p>
            </div>
          </div>
        </div>

        <hr />
        <div className="mb-6">
          <h1 className="text-3xl font-bold my-4">Content</h1>
          {
            contents.map((content, idx) => {
              if (content === undefined) return null
              if (content.type === 'l') return <LectureBox key={idx} {...{ contents, setContents, setShowInputLecture, setIndexEdit, idx }} />
              if (content.type === 'q') return <QuizBox key={idx} {...{ contents, setContents, setShowInputQuiz, setIndexEdit, idx }} />
            })
          }
          <div className="flex justify-end space-x-4">
            <Button onClick={() => setShowInputLecture(true)}>+ Add Lecture</Button>
            <Button onClick={() => setShowInputQuiz(true)}>+ Add Quiz</Button>
          </div>
        </div>


        {isLoading ?
          <Button className="w-full bg-teal-700 text-white text-xl font-bold cursor-not-allowed">
            <Icons.Loading className="animate-spin h-5 w-5 mr-3 inline-block" />
            Loading...
          </Button> :
          <Button onClick={handleSubmit} className="w-full bg-teal-700 text-white text-xl font-bold">Submit</Button>
        }
      </div>

      {showInputLecture && <InputLectureModal {...{ setShowInputLecture, contents, setContents, indexEdit, setIndexEdit }} />}
      {showInputQuiz && <InputQuizModal {...{ setShowInputQuiz, contents, setContents, indexEdit, setIndexEdit }} />}

    </MainLayout>
  )
}

export default CreateNewCourse
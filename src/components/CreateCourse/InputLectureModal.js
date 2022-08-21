import { useContext, useState } from "react"
import { useParams } from "react-router-dom"
import { API_URL } from "../../config"
import { AuthContext } from "../../context"
import Icons from "../../images/icons"
import Button from "../Button"
import ModalBox from "../ModalBox"
import Toast from "../Toast"


const InputLectureModal = (props) => {
  const { auth } = useContext(AuthContext)
  const courseId = (useParams()).id
  const [lecture, setLecture] = useState(JSON.parse(localStorage.getItem('temp')) || {})
  const [isLoading, setIsLoading] = useState(false)


  const handleClose = () => {
    localStorage.removeItem('temp')
    props.setIndexEdit(-1)
    props.setShowInputLecture(false)
    setIsLoading(false)
  }

  const handleAddLecture = async (courseId) => {
    try {
      // Add Lecture Content
      const resContent = await fetch(`${API_URL}/course/${courseId}/lecture`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + auth.accessToken.value,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: lecture.title,
          link: lecture.link
        })
      })

      // Modify Lecture Content Order
      const order = props.contents.map(content => (content.type))
      order.push('l')
      const resOrder = await fetch(`${API_URL}/course-order/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + auth.accessToken.value,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order })
      })

      if (resContent.status === 200 && resOrder.status === 200) Toast('success', 'Successfully Added Lecture')
      const lectureId = (await resContent.json()).lecture_id
      setLecture({ ...lecture, id: lectureId })
    } catch (e) {
      console.log(e);
    }
  }

  const handleModifyLecture = async (lectureId) => {
    try {
      const res = await fetch(`${API_URL}/lecture/${lectureId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + auth.accessToken.value,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: lecture.title,
          link: lecture.link
        })
      })
      if (res.status === 202) Toast('success', 'Successfully Modified Lecture')
    } catch (e) {
      console.log(e);
    }
  }


  const handleSave = async () => {
    setIsLoading(true)
    // For course-edit page (course has id)
    if (courseId !== undefined) {
      if (lecture.id !== undefined) await handleModifyLecture(lecture.id)
      else await handleAddLecture(courseId)
    }

    const content = {
      type: 'l',
      data: lecture
    }
    if (props.indexEdit !== -1) {
      const newContents = props.contents.map((val, idx) => {
        if (idx === props.indexEdit) return content
        return val
      })
      props.setContents(newContents)
    } else {
      props.setContents([...props.contents, content])
    }
    handleClose()
  }

  return (
    <ModalBox>
      <h2 className="text-2xl text-teal-700 font-bold text-center">Lecture</h2>
      <div id="title" className="mb-4">
        <h2 className="text-lg  mb-2">Title</h2>
        <input
          type="text"
          placeholder="Insert your lecture title"
          value={lecture.title}
          onChange={e => setLecture({ ...lecture, title: e.target.value })}
          className="inline-block w-full outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
        />
      </div>
      <div id="link" className="mb-4">
        <h2 className="text-lg  mb-2">Link</h2>
        <input
          type="text"
          placeholder="Insert your lecture link"
          value={lecture.link}
          onChange={e => setLecture({ ...lecture, link: e.target.value })}
          className="inline-block w-full outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
        />
      </div>
      <div className="space-x-2 flex justify-end">
        {isLoading ?
          <Button className="cursor-not-allowed">
            <Icons.Loading className="animate-spin h-5 w-5 mr-3 inline-block" />
            Loading...
          </Button> :
          <>
            <Button onClick={handleClose} className="font-bold">Cancel</Button>
            <Button onClick={handleSave} className="font-bold">Save</Button>
          </>
        }
      </div>
    </ModalBox>
  )
}

export default InputLectureModal
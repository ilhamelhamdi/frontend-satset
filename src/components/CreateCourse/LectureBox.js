import { useContext } from "react"
import { useParams } from "react-router-dom"
import { API_URL } from "../../config"
import { AuthContext } from "../../context"
import Icons from "../../images/icons"
import Toast from "../Toast"

const LectureBox = (props) => {
  const { auth } = useContext(AuthContext)
  const courseId = (useParams()).id
  const content = props.contents[props.idx]
  const handleEdit = () => {
    localStorage.setItem('temp', JSON.stringify(content.data))
    props.setShowInputLecture(true)
    props.setIndexEdit(props.idx)
  }

  const handleDeleteAPI = async () => {
    const lectureId = content.data.id
    const resDelete = await fetch(`${API_URL}/lecture/${lectureId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + auth.accessToken.value
      },
    })

    // UPDATE Course Content Order
    const order = props.contents.map(content => (content.type))
    console.log(order);
    order.splice(props.idx, 1)
    const resOrder = await fetch(`${API_URL}/course-order/${courseId}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + auth.accessToken.value,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ order })
    })
    if (resDelete.status === 202 && resOrder.status === 200) Toast('success', 'Successfully deleted lecture')
    else Toast('error', 'Something wrong')
  }

  const handleDelete = async () => {
    if (courseId !== undefined) await handleDeleteAPI()
    const newContents = [...props.contents]
    newContents.splice(props.idx, 1)
    props.setContents(newContents)
  }

  return (
    <div className="shadow-lg border-2 border-solid border-slate-200 p-4 mb-4 rounded-lg">
      <div className="flex justify-between">
        <h2 className="text-2xl"> <em className="text-teal-700">
          Lecture</em> : <span className="font-bold">{content.data.title}</span>
        </h2>
        <div className="flex">
          <Icons.Edit onClick={handleEdit} className="fill-teal-700 opacity-70 hover:opacity-100 h-8 cursor-pointer" />
          <Icons.Delete onClick={handleDelete} className="fill-rose-800 opacity-70 hover:opacity-100 h-8 cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

export default LectureBox

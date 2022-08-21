import { useContext, useState } from "react"
import { useParams } from "react-router-dom"
import { API_URL } from "../../config"
import { AuthContext } from "../../context"
import Icons from "../../images/icons"
import Toast from "../Toast"

const Loading = () => (
  <Icons.Loading className="fill-sky-500 h-8 cursor-wait animate-spin" />
)

const QuizBox = (props) => {
  const { auth } = useContext(AuthContext)
  const content = props.contents[props.idx]
  const courseId = (useParams()).id
  const quizId = content.data.id


  const [loadingDelete, setLoadingDelete] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)

  const handleFetch = async () => {
    const res = await fetch(`${API_URL}/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + auth.accessToken.value
      }
    })
    const data = await res.json()
    return data.data
  }

  const handleDeleteAPI = async () => {
    try {
      const resDelete = await fetch(`${API_URL}/quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + auth.accessToken.value
        },
      })

      // UPDATE Course Content Order
      const order = props.contents.map(content => (content.type))
      order.splice(props.idx, 1)
      const resOrder = await fetch(`${API_URL}/course-order/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + auth.accessToken.value,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order })
      })
      if (resDelete.status === 202 && resOrder.status === 200) return true
      else return false
    } catch (e) {
      console.log(e)
      return false
    }
  }

  const handleEdit = async () => {
    setLoadingEdit(true)
    const quiz = (content.data.questions) ? content.data : await handleFetch()
    if (quiz) setLoadingEdit(false)
    localStorage.setItem('temp', JSON.stringify(quiz))
    props.setShowInputQuiz(true)
    props.setIndexEdit(props.idx)
  }

  const handleDelete = async () => {
    setLoadingDelete(true)
    let isSuccess = true
    if (courseId !== undefined) isSuccess = await handleDeleteAPI()
    setLoadingDelete(false)
    if (!isSuccess) {
      Toast('error', 'Somethin wrong')
      return
    }
    Toast('success', 'Successfully Deleted Quiz')
    const newContents = [...props.contents]
    newContents.splice(props.idx, 1)
    props.setContents(newContents)
  }

  return (
    <div className="shadow-lg border-2 border-solid border-slate-200 p-4 mb-4 rounded-lg">
      <div className="flex justify-between">
        <h2 className="text-2xl"> <em className="text-teal-700">Quiz</em> : <span className="font-bold">{content.data.title}</span></h2>
        <div className="flex">
          {
            loadingEdit ?
              <Loading /> :
              <Icons.Edit onClick={handleEdit} className="fill-teal-700 opacity-70 hover:opacity-100 h-8 cursor-pointer" />
          }
          {
            loadingDelete ?
              <Loading /> :
              <Icons.Delete onClick={handleDelete} className="fill-rose-800 opacity-70 hover:opacity-100 h-8 cursor-pointer" />}
        </div>
      </div>
    </div>
  )
}

export default QuizBox
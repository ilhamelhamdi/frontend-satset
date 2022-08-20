import Icons from "../../images/icons"

const QuizBox = (props) => {
  const content = props.contents[props.idx]

  const handleEdit = () => {
    localStorage.setItem('temp', JSON.stringify(content.data))
    props.setShowInputQuiz(true)
    props.setIndexEdit(props.idx)
  }

  const handleDelete = () => {
    const newContents = [...props.contents]
    newContents.splice(props.idx, 1)
    props.setContents(newContents)
  }

  return (
    <div className="shadow-lg border-2 border-solid border-slate-200 p-4 mb-4 rounded-lg">
      <div className="flex justify-between">
        <h2 className="text-2xl"> <em className="text-teal-700">Quiz</em> : <span className="font-bold">{content.data.title}</span></h2>
        <div className="flex">
          <Icons.Edit onClick={handleEdit} className="fill-teal-700 opacity-70 hover:opacity-100 h-8 cursor-pointer" />
          <Icons.Delete onClick={handleDelete} className="fill-rose-800 opacity-70 hover:opacity-100 h-8 cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

export default QuizBox
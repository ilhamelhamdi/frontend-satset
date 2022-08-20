import { useState } from "react"
import Button from "../Button"
import ModalBox from "../ModalBox"


const InputLectureModal = (props) => {
  const [lecture, setLecture] = useState(JSON.parse(localStorage.getItem('temp')))
  const [title, setTitle] = useState(lecture ? lecture.title : '')
  const [link, setLink] = useState(lecture ? lecture.link : '')

  const handleClose = () => {
    localStorage.removeItem('temp')
    props.setIndexEdit(-1)
    props.setShowInputLecture(false)
  }

  const handleSave = () => {
    const content = {
      type: 'l',
      data: {
        title,
        link
      }
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
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="inline-block w-full outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
        />
      </div>
      <div id="link" className="mb-4">
        <h2 className="text-lg  mb-2">Link</h2>
        <input
          type="text"
          placeholder="Insert your lecture link"
          value={link}
          onChange={e => setLink(e.target.value)}
          className="inline-block w-full outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
        />
      </div>
      <div className="space-x-2 flex justify-end">
        <Button onClick={handleClose} className="font-bold">Cancel</Button>
        <Button onClick={handleSave} className="font-bold">Save</Button>
      </div>
    </ModalBox>
  )
}

export default InputLectureModal
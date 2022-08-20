import { useEffect, useState } from "react"
import Icons from "../../images/icons"
import Button from "../Button"
import ModalBox from "../ModalBox"


const InputQuizModal = (props) => {
  const [quiz, setQuiz] = useState(JSON.parse(localStorage.getItem('temp')))
  const [title, setTitle] = useState(quiz ? quiz.title : '')
  const [questions, setQuestions] = useState(quiz ? quiz.questions : [{ questionId: 0 }])
  const [activeQuestion, setActiveQuestion] = useState()

  const handleClose = () => {
    localStorage.removeItem('temp')
    props.setIndexEdit(-1)
    props.setShowInputQuiz(false)
  }

  const handleSaveButton = () => {
    const content = {
      type: 'q',
      data: quiz
    }
    if (props.indexEdit !== -1) {
      const newContents = props.contents.map((val, idx) => {
        if (idx === props.indexEdit) return content
        return val
      })
      props.setContents(newContents)
    } else {
      props.setContents([...props.contents, { type: 'q', data: quiz }])
    }
    handleClose()
  }

  const handleTitleUpdate = () => {
    setQuiz({ ...quiz, title })
  }

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionId: questions.length }])
  }

  useEffect(() => {
    setQuiz({ ...quiz, questions })
  }, [questions])

  useEffect(() => {
    localStorage.setItem('temp', JSON.stringify(quiz))
  }, [quiz])

  return (
    <ModalBox>
      <h2 className="text-2xl text-teal-700 font-bold text-center">Quiz</h2>
      <div id="title" className="mb-4">
        <h2 className="text-lg  mb-2">Title</h2>
        <input
          type="text"
          placeholder="Insert your lecture title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleTitleUpdate}
          className="inline-block w-full outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
        />
      </div>
      <div id="questions" className="mb-4">
        <h2 className="text-lg  mb-2">Questions</h2>
        <div className="space-y-4 mb-4">{
          questions.map((question, idx) => {
            if (activeQuestion === question.questionId) {
              return <InputQuestion key={idx} {...{ questions, setQuestions, idx, setActiveQuestion }} />
            }
            return <NonInputQuestion key={idx} {...{ question, idx, activeQuestion, setActiveQuestion }} />

          })
        }
        </div>
        <Button onClick={handleAddQuestion}>+ Add Question</Button>
      </div>

      <div className="space-x-2 flex justify-end">
        <Button onClick={handleClose} className="font-bold">Cancel</Button>
        <Button onClick={handleSaveButton} className="font-bold">Save</Button>
      </div>
    </ModalBox >
  )
}

const InputQuestion = ({ questions, setQuestions, idx, setActiveQuestion }) => {
  const [options, setOptions] = useState(questions[idx].options || [''])
  const [optTrue, setOptTrue] = useState(questions[idx].optTrue)
  const [question, setQuestion] = useState({
    questionId: questions[idx].questionId || idx,
    title: questions[idx].title || '',
    options: questions[idx].options || options,
    optTrue: questions[idx].optTrue || optTrue
  })

  const handleSaveQuestion = () => {
    const newQuestions = questions.map((val, i) => {
      if (i === idx) return question
      return val
    })
    setQuestions(newQuestions)
    setActiveQuestion()
  }

  const handleRemoveQuestion = () => {
    const newQuestions = [...questions]
    newQuestions.splice(idx, 1)
    setQuestions(newQuestions)
  }

  const handleAddOption = () => {
    setOptions([...options, ''])
  }

  // Rerender question box when questions list updated - TOP -> DOWN
  useEffect(() => {
    setQuestion(questions[idx])
  }, [questions])

  // Update Question object when options list or optTrue updated - BOTTOM -> UP
  useEffect(() => {
    setQuestion({ ...question, options, optTrue })
  }, [options, optTrue])

  return (
    <div className="border rounded-lg w-full p-4 space-y-4 border-l-8 border-teal-700">
      <div className="w-full flex space-x-2">
        <span>{idx + 1}.</span>
        <textarea
          placeholder="Question"
          value={question.title}
          onChange={e => setQuestion({ ...question, title: e.target.value })}
          className="inline-block flex-auto outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
        />
        <Icons.Delete
          title="Remove Question"
          onClick={handleRemoveQuestion}
          className="cursor-pointer fill-black/30 hover:fill-black/90"
        />
      </div>
      <div className="pl-4 pr-2 space-y-2">
        {options.map((val, idx) => (
          <InputOption key={idx} {...{ idx, options, optTrue, setOptions, setOptTrue, questionId: question.questionId }} />
        ))}
      </div>
      <div className="space-x-4 flex justify-between">
        <Button onClick={handleAddOption}>+ Add Option</Button>
        <div className="space-x-2">
          <Button onClick={() => setActiveQuestion()}>Cancel</Button>
          <Button onClick={handleSaveQuestion}>Save</Button>
        </div>
      </div>
    </div >
  )
}

const NonInputQuestion = ({ question, idx, activeQuestion, setActiveQuestion }) => {
  const switchActiveQuestion = () => {
    if (activeQuestion === undefined) setActiveQuestion(question.questionId)
  }
  return (
    <div
      onClick={switchActiveQuestion}
      className="border rounded-lg w-full p-4 space-y-4"
    >
      <div className="w-full flex space-x-2">
        <span>{idx + 1}.</span>
        <span className="flex-auto pl-4">{question.title || 'Question'}</span>
      </div>
      <div className="pl-4 pr-2 space-y-4">
        {question.options ?
          question.options.map((option, idx) => (
            <NonInputOption key={idx} {...{ question, option, idx }} />
          )) :
          <NonInputOption {...{ question: { questionId: 0 }, idx: 0 }} />
        }
        {/* <div>Hamdi</div> */}
      </div>
    </div >
  )
}

const NonInputOption = (props) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        name={props.question.questionId}
        checked={(props.question.optTrue !== undefined) ? (props.question.optTrue === props.option) : false}
        readOnly
        className="h-6 w-6 accent-teal-700 opacity-70 "
      />
      <span className="pl-4">{props.option || `Option ${props.idx + 1}`}</span>
    </div>
  )
}

const InputOption = (props) => {
  const [option, setOption] = useState(props.options[props.idx])

  useEffect(() => {
    setOption(props.options[props.idx])
  }, [props.options])

  const handleOptionChange = (val) => {
    if (props.optTrue === option) props.setOptTrue(val)
    setOption(val)
  }

  const handleOptionsUpdate = () => {
    const newOptions = props.options.map((val, i) => {
      if (i === props.idx) return option
      return val
    })
    props.setOptions(newOptions)
  }

  const handleRemove = () => {
    const newOptions = [...props.options]
    newOptions.splice(props.idx, 1)
    props.setOptions(newOptions)
  }

  const handleRadioButton = (e) => {
    if (props.optTrue === option) props.setOptTrue()
    else props.setOptTrue(option)
  }

  return (
    <div className="space-x-2 flex items-center">
      <input
        type="radio"
        value={option}
        checked={(props.optTrue !== undefined) ? (props.optTrue === option) : false}
        onClick={handleRadioButton}
        onChange={() => { }}
        name={props.questionId}
        className="h-6 w-6 accent-teal-700"
      />
      <input
        type="text"
        placeholder={`Option ${props.idx + 1}`}
        value={option}
        onChange={e => handleOptionChange(e.target.value)}
        onBlur={handleOptionsUpdate}
        className="inline-block flex-auto outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
      />
      <Icons.Cross
        title="Remove Option"
        onClick={handleRemove}
        className="h-4 cursor-pointer fill-red-700/30 hover:fill-red-700/90"
      />
    </div>
  )
}

export default InputQuizModal
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API_URL } from "../../config"
import { AuthContext } from "../../context"
import Icons from "../../images/icons"
import Button from "../Button"
import ModalBox from "../ModalBox"
import Toast from "../Toast"


const InputQuizModal = (props) => {
  const [quiz, setQuiz] = useState(JSON.parse(localStorage.getItem('temp')))
  const [title, setTitle] = useState(quiz ? quiz.title : '')
  const [questions, setQuestions] = useState(quiz ? quiz.questions : [{ id: -1 }])
  const [activeQuestion, setActiveQuestion] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const courseId = (useParams()).id
  const { auth } = useContext(AuthContext)


  const handleClose = () => {
    localStorage.removeItem('temp')
    props.setIndexEdit(-1)
    props.setShowInputQuiz(false)
    setIsLoading(false)
  }

  const handleAddQuiz = async (courseId) => {
    try {
      // Add Quiz Content
      const resContent = await fetch(`${API_URL}/course/${courseId}/quiz`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + auth.accessToken.value,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quiz)
      })
      console.log(quiz);

      // Modify Content Order
      const order = props.contents.map(content => (content.type))
      order.push('q')
      const resOrder = await fetch(`${API_URL}/course-order/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + auth.accessToken.value,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order })
      })

      if (resContent.status === 200 && resOrder.status === 200) {
        Toast('success', 'Successfully Added Lecture')
      }
      const quizId = (await resContent.json()).quiz_id
      setQuiz({ ...quiz, id: quizId })
      console.log(quizId);
    } catch (e) {
      console.log(e);
    }
  }

  const handleModifyQuiz = async (quizId) => {
    try {
      const res = await fetch(`${API_URL}/quiz/${quizId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + auth.accessToken.value,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: quiz.title
        })
      })
      if (res.status === 202) Toast('success', 'Successfully Modified Quiz')
      else Toast('error', 'Failed to modify quiz')
    } catch (e) {
      console.log(e);
    }
  }

  const handleSaveButton = async () => {
    setIsLoading(true)

    if (courseId !== undefined) {
      if (quiz.id !== undefined) await handleModifyQuiz(quiz.id)
      else await handleAddQuiz(courseId)
    }

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
      props.setContents([...props.contents, { type: 'q', data: { ...quiz, questions } }])
    }
    handleClose()
  }

  // const handleTitleUpdate = () => {
  //   setQuiz({ ...quiz, title })
  // }

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: -(questions.length + 1) }])
  }

  useEffect(() => {
    setQuiz({ ...quiz, questions, title })
  }, [questions, title])

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
          // onBlur={handleTitleUpdate}
          className="inline-block w-full outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
        />
      </div>
      <div id="questions" className="mb-4">
        <h2 className="text-lg  mb-2">Questions</h2>
        <div className="space-y-4 mb-4">{
          questions.map((question, idx) => {
            if (activeQuestion === question.id) {
              return <InputQuestion key={idx} {...{ questions, setQuestions, idx, setActiveQuestion, quizId: quiz.id }} />
            }
            return <NonInputQuestion key={idx} {...{ question, idx, activeQuestion, setActiveQuestion }} />

          })
        }
        </div>
        <Button onClick={handleAddQuestion}>+ Add Question</Button>
      </div>

      <div className="space-x-2 flex justify-end">
        {
          isLoading ?
            <Button className="cursor-not-allowed">
              <Icons.Loading className="animate-spin h-5 w-5 mr-3 inline-block" />
              Loading...
            </Button> :
            <>
              <Button onClick={handleClose} className="font-bold">Cancel</Button>
              <Button onClick={handleSaveButton} className="font-bold">Save</Button>
            </>
        }
      </div>
    </ModalBox >
  )
}

const InputQuestion = ({ questions, setQuestions, idx, setActiveQuestion, quizId }) => {
  const { auth } = useContext(AuthContext)
  const courseId = (useParams()).id
  const [question, setQuestion] = useState(questions[idx])
  const [opt, setOpt] = useState(question.opt || [''])
  const [opt_true, setOptTrue] = useState(question.opt_true)
  const [isLoading, setIsLoading] = useState(false)

  const handleModifyQuestion = async (questionId) => {
    try {
      const res = await fetch(`${API_URL}/question/${questionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + auth.accessToken.value,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: question.question,
          opt: question.opt,
          opt_true: question.opt_true
        })
      })
      if (res.status === 202) Toast('success', 'Successfully Modified Question')
      else Toast('error', 'Failed to modify question')
    } catch (e) {
      console.log(e);
    }
  }

  const handleAddQuestion = async (quizId) => {
    try {
      const res = await fetch(`${API_URL}/quiz/${quizId}/question`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + auth.accessToken.value,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: question.question,
          opt: question.opt,
          opt_true: question.opt_true
        })
      })
      if (res.status === 200) Toast('success', 'Successfully Added Question')
      const questionId = (await res.json()).question_id
      setQuestion({ ...question, id: questionId })
    } catch (e) {
      console.log(e);
    }
  }

  const handleSaveQuestion = async () => {
    setIsLoading(true)
    if (courseId !== undefined && quizId) {
      if (question.id >= 0) await handleModifyQuestion(question.id)
      else await handleAddQuestion(quizId)
    }
    const newQuestions = questions.map((val, i) => {
      if (i === idx) return question
      return val
    })
    setQuestions(newQuestions)
    setIsLoading(false)
    setActiveQuestion()
  }

  const handleDeleteQuestionAPI = async () => {
    const res = await fetch(`${API_URL}/quiz/${quizId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + auth.accessToken.value,
        'Content-Type': 'application/json'
      }
    })
    if (res.status === 202) Toast('success', 'Successfully Deleted Question')
    else Toast('error', 'Failed to delete question')
  }

  const handleRemoveQuestion = () => {
    if (courseId !== undefined && question.id >= 0) {
      console.log('fire');
      handleDeleteQuestionAPI(question.id)
    }

    const newQuestions = [...questions]
    newQuestions.splice(idx, 1)
    setQuestions(newQuestions)
  }

  const handleAddOption = () => {
    setOpt([...opt, ''])
  }

  // Rerender question box when questions list updated - TOP -> DOWN
  useEffect(() => {
    setQuestion(questions[idx])
  }, [questions])

  // Update Question object when opt list or opt_true updated - BOTTOM -> UP
  useEffect(() => {
    setQuestion({ ...question, opt, opt_true })
  }, [opt, opt_true])

  return (
    <div className="border rounded-lg w-full p-4 space-y-4 border-l-8 border-teal-700">
      <div className="w-full flex space-x-2">
        <span>{idx + 1}.</span>
        <textarea
          placeholder="Question"
          value={question.question}
          onChange={e => setQuestion({ ...question, question: e.target.value })}
          className="inline-block flex-auto outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
        />
        <Icons.Delete
          title="Remove Question"
          onClick={handleRemoveQuestion}
          className="cursor-pointer fill-black/30 hover:fill-black/90"
        />
      </div>
      <div className="pl-4 pr-2 space-y-2">
        {opt.map((val, idx) => (
          <InputOption key={idx} {...{ idx, opt, opt_true, setOpt, setOptTrue, id: question.id }} />
        ))}
      </div>
      <div className="space-x-4 flex justify-between">
        <Button onClick={handleAddOption}>+ Add Option</Button>
        <div className="space-x-2">
          {
            isLoading ?
              <Button className="cursor-not-allowed">
                <Icons.Loading className="animate-spin h-5 w-5 mr-3 inline-block" />
                Loading...
              </Button> :
              <>
                <Button onClick={() => setActiveQuestion()}>Cancel</Button>
                <Button onClick={handleSaveQuestion}>Save</Button>
              </>
          }
        </div>
      </div>
    </div >
  )
}

const NonInputQuestion = ({ question, idx, activeQuestion, setActiveQuestion }) => {
  const switchActiveQuestion = () => {
    if (activeQuestion === undefined) setActiveQuestion(question.id)
  }
  return (
    <div
      onClick={switchActiveQuestion}
      className="border rounded-lg w-full p-4 space-y-4"
    >
      <div className="w-full flex space-x-2">
        <span>{idx + 1}.</span>
        <span className="flex-auto pl-4">{question.question || 'Question'}</span>
      </div>
      <div className="pl-4 pr-2 space-y-4">
        {question.opt ?
          question.opt.map((option, idx) => (
            <NonInputOption key={idx} {...{ question, option, idx }} />
          )) :
          <NonInputOption {...{ question: { id: -1 }, idx: 0 }} />
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
        name={props.question.id}
        checked={(props.question.opt_true !== undefined) ? (props.question.opt_true === props.option) : false}
        readOnly
        className="h-6 w-6 accent-teal-700 opacity-70 "
      />
      <span className="pl-4">{props.option || `Option ${props.idx + 1}`}</span>
    </div>
  )
}

const InputOption = (props) => {
  const [option, setOption] = useState(props.opt[props.idx])

  useEffect(() => {
    setOption(props.opt[props.idx])
  }, [props.opt])

  const handleOptionChange = (val) => {
    if (props.opt_true === option) props.setOptTrue(val)
    setOption(val)
  }

  const handleOptionsUpdate = () => {
    const newOptions = props.opt.map((val, i) => {
      if (i === props.idx) return option
      return val
    })
    props.setOpt(newOptions)
  }

  const handleRemove = () => {
    const newOptions = [...props.opt]
    newOptions.splice(props.idx, 1)
    props.setOpt(newOptions)
  }

  const handleRadioButton = (e) => {
    if (props.opt_true === option) props.setOptTrue()
    else props.setOptTrue(option)
  }

  return (
    <div className="space-x-2 flex items-center">
      <input
        type="radio"
        value={option}
        checked={(props.opt_true !== undefined) ? (props.opt_true === option) : false}
        onClick={handleRadioButton}
        onChange={() => { }}
        name={props.id}
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
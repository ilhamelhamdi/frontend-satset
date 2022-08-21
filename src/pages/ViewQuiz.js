import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { API_URL } from "../config"
import useSWR from "swr";
import MainLayout from "../components/MainLayout";
import { Loading } from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ViewQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState()
    const [currentNumber, setCurrentNumber] = useState()
    const [currentAnswer, setCurrentAnswer] = useState()
    const [answer, setAnswer] = useState([])
    const [isResult, setIsResult] = useState(false)
    const [submittedAnswer, setSubmittedAnswer] = useState([])
    const idOfQuiz = (useParams()).id
    const [quiz, setQuiz] = useState()
    const accessToken = JSON.parse(localStorage.getItem('auth')).accessToken.value
    const [quizFeedback, setQuizFeedback] = useState()
    const navigate = useNavigate();

    const changeQuestion = (number) => {
        const question = data.questions[number-1]
        const idxOfExist = answer.findIndex(el => el.number === (number))
        if(idxOfExist !== -1){
            setCurrentAnswer(answer[idxOfExist].answer)
        } else{
            setCurrentAnswer('')
        }
        setCurrentQuestion(question)
        setCurrentNumber(number)
    }

    const answerQuestion = (ans) => {
        const idxOfExist = answer.findIndex(el => el.number === currentNumber)
        if(idxOfExist !== -1){
            answer.splice(idxOfExist, 1, {number: currentNumber, answer: ans})
            setAnswer(answer)
        } else {
            setAnswer([...answer, {
                number: currentNumber,
                answer: ans
            }])
        }
        setCurrentAnswer(ans)
    }

    const isAnswerExist = (number) => {
        const idxOfExist = answer.findIndex(el => el.number === number)
        if(idxOfExist !== -1){
            return true
        }
        return false
    }

    const submitQuiz = async () => {
        for(let i=0;i<quiz.questions.length;i++){
            const idxOfAns = answer.findIndex(el => el.number === i+1)
            submittedAnswer.push(answer[idxOfAns].answer)
        }

        try {
            const res = await fetch(API_URL + `/quiz/${idOfQuiz}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({"answers": submittedAnswer})
            })
            const data = (await res.json()).data
            setQuizFeedback(data)
            setIsResult(true)
        } catch (e) {
            Toast('error', e)
        }
        
    }

    const fetchData = async (url) => {
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + accessToken }
            })
            const quizData = (await res.json()).data
            setQuiz(quizData)
            return quizData
        } catch (e) {
            Toast('error', e)
        } 
    }

    const { data, error } = useSWR(API_URL + `/quiz/${idOfQuiz}`, fetchData)
    
    if(!data && !error) {
        return (
            <MainLayout>
                <Loading/>
            </MainLayout>
        )
    }

    if(data) {
        return (
        <div className="container mx-auto xl:max-w-screen-xl px-4 pt-2 mb-8 mt-10">
            {
                isResult ?
                    <button onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon="fa-solid fa-chevron-left" /> Back
                    </button>
                :
                    <h1 className="font-semibold text-3xl">{data.title}</h1>
            }
            <div className="flex w-full mt-2">
                <div className="w-3/12 border-2 rounded-xl p-3 mr-5 h-full">
                    {
                        isResult ?
                            <div>
                                <h1 className="font-semibold text-5xl text-center">{quizFeedback.score}</h1>
                                <h1 className="text-center mb-3">Score</h1>
                                {
                                    quizFeedback.answer_feedback.map((val, idx) => (
                                        <button
                                            className="border-2 py-2 px-3 rounded-lg hover:border-gray-400 mr-1 text-white"
                                            key={idx}
                                            style={{backgroundColor: val === '1' ? "#0D9488" : "#dc2626"}}
                                            >
                                                {idx+1}
                                        </button>
                                    ))
                                }
                            </div>
                        :
                            data.questions.map((val, idx) => (
                                <button
                                    className="border-2 py-2 px-3 rounded-lg hover:border-gray-400 mr-1"
                                    key={idx}
                                    style={{
                                        backgroundColor: isAnswerExist(idx+1) ? "#0D9488" : (currentNumber === idx+1 ? "#E5E7EB" : "white"),
                                        color: isAnswerExist(idx+1) ? "white" : "black"
                                    }}
                                    onClick={() => changeQuestion(idx+1)}
                                    >
                                        {idx+1}
                                </button>
                            ))
                    }
                </div>
                <div className="w-9/12 border-2 rounded-xl p-3 h-full">
                    {
                        isResult ?
                            <div className="p-3">
                                {
                                    data.questions.map((val, idx) => (
                                        <div className="mb-2">
                                            <h1 className="font-semibold text-xl">
                                                {idx+1 + '. ' + val.question}
                                            </h1>
                                            <div className="ml-6 grid grid-cols-2 gap-2 mt-2">
                                                {
                                                    val.opt.map((opt, index) => (
                                                        <a
                                                            className="p-2 border-2 border-gray-200 hover:border-gray-400 w-full rounded-md text-start mr-1"
                                                            key={index}
                                                            style={{
                                                                backgroundColor: submittedAnswer[idx] === opt ? (quizFeedback.answer_feedback[idx] === '1' ? "#0D9488" : "#dc2626") : "white",
                                                                color: submittedAnswer[idx] === opt ? "white" : "black"
                                                            }}
                                                            >{opt}
                                                        </a>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        :
                            <div className="p-3">
                                <h1 className="font-semibold text-xl">
                                    {currentQuestion ?
                                        currentNumber + '. ' + currentQuestion.question
                                        :
                                        <div>
                                            <h1 className="text-center">Selamat datang di Quiz: {data.title}</h1>
                                            <p className="text-sm mt-10">Tekan tombol angka disamping kiri untuk menampilkan soal sesuai urutan</p>
                                            <p className="text-sm">Klik Submit jika sudah selesai</p>
                                            <p className="text-sm">Selamat Mengerjakan!</p>
                                        </div>
                                    }
                                </h1>
                                <div className="ml-6 grid grid-cols-2 gap-2 mt-5">
                                    {
                                        currentQuestion ?
                                            currentQuestion.opt.map((val, idx) => (
                                                <button
                                                    className="p-2 border-2 border-gray-200 hover:border-gray-400 w-full rounded-md text-start mr-1"
                                                    key={idx}
                                                    onClick={e => answerQuestion(val)}
                                                    style={{
                                                        backgroundColor: currentAnswer === val ? "#0D9488" : "white",
                                                        color: currentAnswer === val ? "white" : "black"
                                                    }}
                                                    >{val}
                                                </button>
                                            ))
                                        :
                                            <></>
                                    }
                                </div>
                                <div className="flex justify-between mt-5">
                                    {
                                        currentNumber && currentNumber !== 1 ?
                                            <button className="border-2 rounded-md py-2 px-4 hover:bg-teal-600 hover:text-white" onClick={() => changeQuestion(currentNumber-1)}>Previous</button>
                                        :
                                            <div></div>
                                    }
                                    {
                                        currentNumber && currentNumber !== data.questions.length ?
                                            <button className="border-2 rounded-md py-2 px-4 hover:bg-teal-600 hover:text-white" onClick={() => changeQuestion(currentNumber+1)}>Next</button>
                                        :
                                            (answer.length === data.questions.length ?
                                                <button className="border-2 rounded-md py-2 px-4 hover:bg-teal-600 bg-teal-700 text-white" onClick={() => submitQuiz()}>Submit</button>
                                            :   currentNumber &&
                                                <button className="border-2 rounded-md py-2 px-4 cursor-no-drop" disabled>Submit</button>    
                                            )
                                        
                                    }
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
        )
    }
}
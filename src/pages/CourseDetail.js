import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import Header from "../components/Header"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { API_URL } from "../config"
import { Loading } from "../components/Loading";
import Toast from "../components/Toast";
import Icons from "../images/icons"
import Button from "../components/Button"

const auth = JSON.parse(localStorage.getItem('auth'))
const accessToken = auth ? auth.accessToken.value : ''
const userRole = auth ? auth.user.role : ''
const instructorEmail = auth ? auth.user.email : ''

const ContentLecture = ({ item, is_enrolled }) => {
    const [isCompleted, setIsCompleted] = useState(item.is_completed)

    const completeCourse = async (id) => {
        try {
            const res = await fetch(API_URL + `/progress/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            if (res.status === 202) {
                setIsCompleted(true)
                Toast('success', 'Successfuly Completed Lecture!')
            }
        } catch (e) {
            Toast('error', e)
        }
    }

    return (
        <div className="flex items-center py-1">
            <FontAwesomeIcon icon="fa-solid fa-circle-play" />
            {is_enrolled || userRole === 'admin' ?
                <div className="flex justify-between w-full">
                    <a className="ml-2 text-blue-600" href={item.link} target="_blank" rel="noreferrer" >{item.title}</a>
                    {!isCompleted ? <button className="text-xs p-1 border-2 rounded-lg border-teal-700 bg-white text-teal-700 hover:bg-teal-700 hover:text-white transition" onClick={() => completeCourse(item.id)}>Mark as Complete</button>
                        : <p className="text-xs text-teal-700">Completed</p>}
                </div>
                :
                <p className="ml-2">{item.title}</p>
            }
        </div>
    )
}

const ContentQuiz = ({ item, is_enrolled }) => {
    return (
        <div className="flex items-center py-1">
            <FontAwesomeIcon icon="fa-solid fa-list-check" />
            {is_enrolled || userRole === 'admin' ?
                <div className="flex justify-between w-full items-center">
                    <a className="ml-2 text-blue-600" href={`/quiz/${item.id}`}>{item.title}</a>
                    {item.score >= 0 && <p className="text-xs text-teal-700">Score: {item.score}</p>}
                </div>
                :
                <p className="ml-2">{item.title}</p>
            }
        </div>
    )
}

const CourseHeader = ({ item, is_enrolled, role }) => {
    const [showMoreDesc, setShowMoreDesc] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const enrolledCourse = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(API_URL + '/enroll', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({ "course_id": item.id })
            })
            if (res.status === 202) {
                navigate(0)
                Toast('success', 'Successfully enrolled the course')
            } else {
                Toast('error', 'Something wrong')
            }
        } catch (e) {
            Toast('error', e)
        }
    }

    return (
        <div className="grid lg:grid-cols-3 sm:grid-rows-1 mb-10">
            <div className="col-span-1 content-center">
                <img src={item.image} alt="courses" className="border-2 col-span-1" />
                {!is_enrolled && role === 'student' &&
                    <div className="flex justify-center mt-2">
                        {
                            isLoading ?
                                <Button className="cursor-not-allowed">
                                    <Icons.Loading className="animate-spin h-5 w-5 mr-3 inline-block" />
                                    Loading...
                                </Button>
                                : <button className="py-2 px-5 border-2 rounded-lg border-teal-700 bg-white text-teal-700 hover:bg-teal-700 hover:text-white transition" onClick={() => enrolledCourse()}>Enroll</button>
                        }

                    </div>
                }
                {
                    item.instructor.email === instructorEmail &&
                    <div className="flex justify-center mt-2">
                        <button className="py-2 px-5 border-2 rounded-lg border-teal-700 bg-white text-teal-700 hover:bg-teal-700 hover:text-white transition" onClick={() => navigate(`/edit-course/${item.id}`)}>Edit</button>
                    </div>
                }
            </div>
            <div className="lg:ml-10 col-span-2">
                <h1 className="font-bold text-3xl">{item.title}</h1>
                <div className="flex justify-between items-center mb-2">
                    <h1 className="font-semibold text-lg">Instructor: {item.instructor.name}</h1>
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

const CourseContent = ({ item, is_enrolled, orders }) => {
    const [showContent, setShowContent] = useState(false)
    const lectures = [...item.lectures]
    const quizzes = [...item.quizzes]

    return (
        <div className="rounded-xl shadow-md bg-white border-2 p-5">
            <div className="flex justify-between items-center">
                <h1 className="font-semibold text-xl">Content</h1>
                <button className="cursor-pointer" onClick={() => setShowContent(!showContent)}>
                    {
                        showContent ?
                            <FontAwesomeIcon icon="fa-solid fa-angles-up" />
                            :
                            <FontAwesomeIcon icon="fa-solid fa-angles-down" />
                    }
                </button>
            </div>
            {showContent &&
                <div className="px-5 pt-5">
                    {
                        orders.map((val, idx) => {
                            if (val === 'l') {
                                const content = lectures[0]
                                lectures.splice(0, 1)
                                return <ContentLecture key={idx} item={content} is_enrolled={is_enrolled} />

                            } else if (val === 'q') {
                                const content = quizzes[0]
                                quizzes.splice(0, 1)
                                return <ContentQuiz key={idx} item={content} is_enrolled={is_enrolled} />
                            }
                        })
                    }
                </div>
            }
        </div>
    )
}

const CourseData = () => {
    const idOfCourse = (useParams()).id
    const navigate = useNavigate()

    const fetchData = async (url, token) => {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        if (res.status === 403) {
            navigate('/403')
        } else if (res.status === 401) {
            navigate('/register')
        }
        const data = await res.json()
        return data
    }

    const fetchOrder = async (url, token) => {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const order = (await res.json()).order
        return order
    }

    const { data } = useSWR([`${API_URL}/course/${idOfCourse}`, accessToken], fetchData)
    const { data: order } = useSWR([`${API_URL}/course-order/${idOfCourse}`, accessToken], fetchOrder)

    if (!data || !order) {
        return (
            <Loading />
        )
    }

    if (data && order) {
        return (
            <div className="container mx-auto mt-10 xl:max-w-screen-xl px-4">
                <CourseHeader item={data.data} is_enrolled={data.is_enrolled} role={userRole} />
                <CourseContent item={data.data} is_enrolled={data.is_enrolled} orders={order} />
            </div>
        )
    }
}

export const CourseDetail = () => {
    return (
        <MainLayout>
            <Header />
            <CourseData />
        </MainLayout>
    )
}
import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import Header from "../components/Header"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { API_URL } from "../config"
import { Loading } from "../components/Loading";
import Toast from "../components/Toast";

const accessToken = JSON.parse(localStorage.getItem('auth')).accessToken.value
const userRole = JSON.parse(localStorage.getItem('auth')).user.role

const ContentLecture = ({item, is_enrolled}) => {
    const [isEnrolled, setIsEnrolled] = useState(is_enrolled)

    const completeCourse = async (id) => {
        try{
            const res = await fetch(API_URL + `/progress/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            if(res.status === 202) {
                setIsEnrolled(true)
                Toast('success', 'Successfuly Completed Lecture!')
            }
        } catch (e) {
            Toast('error', e)
        }
    }

    return (
        <div className="flex items-center py-1">
            <FontAwesomeIcon icon="fa-solid fa-circle-play" />
            {   isEnrolled ?
                    <div className="flex justify-between w-full">
                        <a className="ml-2 text-blue-600" href={item.link} target="_blank">{item.title}</a>
                        <button className="text-xs p-1 border-2 rounded-lg border-teal-700 bg-white text-teal-700 hover:bg-teal-700 hover:text-white transition" onClick={() => completeCourse(item.id)}>Mark as Complete</button>
                    </div>
                :
                    <p className="ml-2">{item.title}</p>
            }
        </div>
    )
}

const ContentQuiz = ({item, is_enrolled}) => {
    return (
        <div className="flex items-center py-1">
            <FontAwesomeIcon icon="fa-solid fa-list-check" />
            {   is_enrolled ?
                    <div className="flex justify-between w-full items-center">
                        <a className="ml-2 text-blue-600" href={`/quiz/${item.id}`}>{item.title}</a>
                        <p className="text-xs text-teal-700">Score: {item.score}</p>
                    </div>
                :
                    <p className="ml-2">{item.title}</p>
            }
        </div>
    )
}

const CourseHeader = ({item, is_enrolled, role}) => {
    const [showMoreDesc, setShowMoreDesc] = useState(false)
    const [isEnrolled, setIsEnrolled] = useState(is_enrolled)

    const enrolledCourse = async () => {
        try{
            const res = await fetch(API_URL + '/enroll', {
                method: "POST",
                headers: { 'Authorization': 'Bearer ' + accessToken},
                body: JSON.stringify({"course_id": item.id})
            })
            console.log(res)
            if(res.status === 202){
                Toast('success', 'Successfully enrolled the course')
                setIsEnrolled(true)
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
                <img src={item.image} className="border-2 col-span-1"/>
                { !isEnrolled && role === 'student' &&
                    <div className="flex justify-center mt-2">
                        <button className="py-2 px-5 border-2 rounded-lg border-teal-700 bg-white text-teal-700 hover:bg-teal-700 hover:text-white transition" onClick={() => enrolledCourse()}>Enroll</button>
                    </div>
                }
            </div>
            <div className="lg:ml-10 col-span-2">
                <h1 className="font-bold text-3xl">{item.title}</h1>
                <div className="flex justify-between items-center mb-2">
                    <h1 className="font-semibold text-lg">Instructor: {item.instructor.name}</h1>
                    {/* <h1 className="text-sm text-gray-500">{item.updated_at.slice(0,10)}</h1> */}
                </div>
                <h1 className="font-semibold italic">Description</h1>
                <p>
                    {/* { showMoreDesc ? item.description : item.description.substring(0, 630) + '...'} */}
                    {/* {   item.description.length > 630 &&
                        <button className="text-blue-400 font-semibold ml-1" onClick={() => setShowMoreDesc(!showMoreDesc)}>
                            { showMoreDesc ? 'Show Less' : 'Show More'}
                        </button>
                    } */}
                </p>
            </div>
        </div>
    )
}

const CourseContent = ({item, is_enrolled}) => {
    const [showContent, setShowContent] = useState(false)

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
            {   showContent &&
                <div className="px-5 pt-5">
                    {   
                        item.lectures.map((val, idx) => (
                            <ContentLecture key={idx} item={val} is_enrolled={is_enrolled}/>
                        ))
                    }
                    {
                        item.quizzes.map((val, idx) => (
                            <ContentQuiz key={idx} item={val} is_enrolled={is_enrolled}/>
                        ))
                    }
                </div>
            }
        </div>
    )
}

const CourseData = () => {
    const idOfCourse = (useParams()).id
    const [isEnrolled, setIsEnrolled] = useState()
    const navigate = useNavigate()

    const fetchData = async (url, token) => {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        if(res.status === 403){
            navigate('/403')
        } else if(res.status === 401){
            navigate('/register')
        }
        const data = await res.json()
        setIsEnrolled(data.is_enrolled)
        return data.data
    }

    const { data, error } = useSWR([`${API_URL}/course/${idOfCourse}`, accessToken], fetchData)

    if(!data && !error) {
        return (
            <Loading/>
        )
    }

    if (data) {
        return (
            <div className="container mx-auto mt-10">
                <CourseHeader item={data} is_enrolled={isEnrolled} role={userRole}/>
                <CourseContent item={data} is_enrolled={isEnrolled}/>
            </div>
        )
    }
}

export const CourseDetail = () => {
    return (
        <MainLayout>
            <Header/>
            <CourseData/>
        </MainLayout>
    )
}
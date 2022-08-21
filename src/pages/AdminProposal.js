import React, { useState, useEffect, useContext } from "react";
import { ProposalCard } from "../components/ProposalCard";
import { AuthContext } from "../context"
import { useNavigate } from "react-router-dom"
import SummaryCardSkeleton from "../components/SummaryCard/skeleton"
import { API_URL } from "../config"
import MainLayout from "../components/MainLayout";
import Header from "../components/Header";
import Toast from "../components/Toast";
import Button from "../components/Button";

export const AdminProposal = () => {
    const [dataProposal, setDataProposal] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [type, setType] = useState('instructor')
    const [page, setPage] = useState(1)
    const { auth } = useContext(AuthContext)
    const [nextLink, setNextLink] = useState('')
    const accessToken = JSON.parse(localStorage.getItem('auth')).accessToken.value
    const navigate = useNavigate()

    useEffect(() => {
        if (auth === null) navigate('/')
    }, [])

    useEffect(() => {
        fetchData(type + 's', page)
            .then(data => (setDataProposal([...dataProposal, ...data.data]), setNextLink(data.next)))
    }, [page]);

    const fetchData = async (type, page) => {
        setIsLoading(true)
        try {
            const res = await fetch(API_URL + `/proposal-${type}/${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
            })
            const json = await res.json()
            return json
        } catch (e) {
            console.log(e)
            throw (e)
        } finally {
            setIsLoading(false)
        }
    }

    const changeData = val => {
        setType(val.slice(0, -1))
        fetchData(val, 1)
            .then(data => (setDataProposal(data.data), setNextLink(data.next)))
    }

    const actionHandler = async (id, action, icon) => {
        setIsLoading(true)
        const typeOfID = type === 'instructor' ? 'user_id' : 'course_id'
        try {
            const res = await fetch(API_URL + `/verify-${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify(
                    {
                        [typeOfID]: id,
                        "verified_status": action
                    })
            })
            const json = await res.json()
            return json
        } catch (e) {
            Toast('error', e)
            throw (e)
        } finally {
            setDataProposal(dataProposal.filter(val => val.id !== id))
            setIsLoading(false)
            Toast(icon, `Successfully ${action}`)
        }
    }

    return (
        <MainLayout>
            <Header />
            <div className="container mx-auto xl:max-w-screen-xl px-4 pt-10">
                <div className="flex justify-between">
                    <h1 className="font-bold text-3xl text-teal-700">Proposal</h1>
                    <div className="flex">
                        <select className="mr-2" onChange={e => changeData(e.target.value)}>
                            <option value="instructors">Instructors</option>
                            <option value="courses">Courses</option>
                        </select>
                    </div>
                </div>
                <div className="grid lg:grid-cols-5 sm:grid-cols-2 mt-5 gap-x-2">
                    {
                        isLoading ?
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                <SummaryCardSkeleton key={i}>
                                    <div className="h-16 bg-slate-300 self-center w-16 rounded-full mb-3" />
                                    <div className="h-6 bg-slate-300 self-center w-full rounded mb-3" />
                                    <div className="h-6 bg-slate-300 self-center w-full rounded mb-3" />
                                    <div className="flex justify-between gap-x-1">
                                        <div className="h-6 bg-slate-300 self-center w-full rounded" />
                                        <div className="h-6 bg-slate-300 self-center w-full rounded" />
                                    </div>
                                </SummaryCardSkeleton>
                            ))
                            :
                            dataProposal.length > 0 ?
                                dataProposal.map((val, idx) => (
                                    <ProposalCard
                                        item={val}
                                        key={idx}
                                        action={actionHandler}
                                    />
                                ))
                                :
                                <h1 className="text-lg">No data avalaible</h1>
                    }
                </div>
                {
                    !isLoading && nextLink &&
                    <div className="flex justify-center mb-5">
                        <Button onClick={() => { fetchData(type + 's', page + 1); setPage(page + 1) }}>Load more...</Button>
                    </div>
                }
            </div>
        </MainLayout>
    )
}
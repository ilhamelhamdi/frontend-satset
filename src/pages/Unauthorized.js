import React from "react";
import Header from "../components/Header";
import MainLayout from "../components/MainLayout";
import Images from "../images"

const Unauthorized = () => {
    return (
        <MainLayout>
            <Header/>
            <div className="flex justify-center items-center container mx-auto max-w-2xl mt-10">
                <img src={Images.Unauthorized} />
            </div>
        </MainLayout>
    )
}

export default Unauthorized
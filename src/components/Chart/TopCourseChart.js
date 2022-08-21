import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export const TopCourseChart = ({top_courses}) => {
    const barColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#f5424e", "#f5ef42"]
    
    return (
        <div className="w-full border-2 rounded-xl shadow-md m-4 bg-white">
            <h1 className="p-4 font-semibold text-lg">Top Course</h1>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                    width="50%"
                    height={300} 
                    data={top_courses} 
                    layout="vertical"
                    margin={{top: 5, right: 30, left: 60, bottom: 5}}
                >
                    <XAxis type="number"/>
                    <YAxis type="category" dataKey="name" />
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend />
                    <Bar dataKey="students" fill="#8884d8">
                    {
                        top_courses.map((val, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
                        ))
                    }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
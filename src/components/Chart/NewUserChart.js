import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const NewUserChart = ({data}) => {

    return (
      <div className="w-full border-2 rounded-xl shadow-md m-4 bg-white">
        <h1 className="p-4 font-semibold text-lg">New User</h1>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            width="50%"
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="student" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="instructor" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
}
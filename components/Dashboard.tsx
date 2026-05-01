import React from 'react'
import Sidebar from './Sidebar'
import MainPanel from './MainPanel'

const Dashboard = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#080b14]">
      <Sidebar />
      <MainPanel />
    </div>
  )
}

export default Dashboard
